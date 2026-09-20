#!/usr/bin/env bash
# Deploys a release of the website to https://beta.bulwarkmail.org on
# mail.rath.li.
#
# Installed as /usr/local/bin/bulwarkmail-beta-deploy and run as the `ubuntu`
# user through a forced command on the deploy key in
# ~ubuntu/.ssh/authorized_keys:
#
#   command="/usr/local/bin/bulwarkmail-beta-deploy",restrict ssh-ed25519 AAAA... website beta deploy
#
# so the key can do nothing but this. Re-install it by hand when this file
# changes. The requested action comes in SSH_ORIGINAL_COMMAND:
#
#   deploy <sha>   read a release tarball (built by .github/workflows/beta.yml)
#                  from stdin, switch to it, check it, roll back on failure
#   rollback       switch back to the previous release
#   status         print the current release and the last few
#
# Layout under /opt/bulwarkmail-website-beta (owned by ubuntu):
#   releases/<time>-<sha>/  unpacked standalone builds, newest five kept
#   current -> releases/…   what pm2 runs (ecosystem.config.cjs)
# pm2 runs as root, so only the pm2 calls use sudo. Production
# (/opt/bulwarkmail-website, pm2 bulwarkmail-website) is never touched.
set -euo pipefail

BASE=/opt/bulwarkmail-website-beta
APP=bulwarkmail-website-beta
PORT=3012
KEEP_RELEASES=5

log() { echo "[beta-deploy] $*"; }

healthy() {
  local i
  for i in $(seq 1 30); do
    if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/" &&
       curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/docs"; then
      return 0
    fi
    sleep 2
  done
  return 1
}

run_current() {
  if sudo -n pm2 describe "$APP" >/dev/null 2>&1; then
    sudo -n pm2 reload "$BASE/ecosystem.config.cjs" --update-env
  else
    sudo -n pm2 start "$BASE/ecosystem.config.cjs"
  fi
  sudo -n pm2 save >/dev/null
}

# Prune all but the newest $KEEP_RELEASES releases. The app runs as root and
# writes .next/cache into its own release directory, so old releases hold
# root-owned files that ubuntu cannot remove; hence sudo. This is housekeeping,
# so it never fails a deploy that is already live.
# Releases newest first. Sorted by name, not mtime: the directories are named
# after the UTC build time, while their mtime moves whenever the running app
# writes .next/cache into the one it serves.
releases_newest_first() {
  ls -1d "$BASE"/releases/*/ 2>/dev/null | sed 's:/$::' | sort -r
}

prune_old_releases() {
  local cur old dir
  cur=$(readlink -f "$BASE/current" 2>/dev/null || true)
  # Everything but the current release and the newest few beside it.
  old=$(releases_newest_first | grep -vxF "$cur" | tail -n +"$KEEP_RELEASES")
  [[ -n "$old" ]] || return 0
  while IFS= read -r dir; do
    [[ -n "$dir" && "$dir" == "$BASE"/releases/* ]] || continue
    sudo -n rm -rf -- "$dir" || log "could not remove $dir"
  done <<< "$old"
}

# Point `current` at a release atomically.
switch_to() {
  ln -sfn "$1" "$BASE/current.next"
  mv -Tf "$BASE/current.next" "$BASE/current"
}

cmd=${SSH_ORIGINAL_COMMAND:-${1:-}}
mkdir -p "$BASE/releases"
exec 9>"$BASE/.deploy.lock"
flock -n 9 || { log "another deploy is running"; exit 1; }

case "$cmd" in
  deploy\ *)
    sha=${cmd#deploy }
    [[ "$sha" =~ ^[0-9a-f]{7,40}$ ]] || { log "bad revision: $sha"; exit 2; }
    rel="$BASE/releases/$(date -u +%Y%m%d%H%M%S)-${sha:0:12}"
    mkdir -p "$rel"
    log "unpacking into $rel"
    tar -xz -C "$rel" --no-same-owner
    [[ -f "$rel/server.js" && -d "$rel/docs" && -f "$rel/deploy/ecosystem.beta.config.cjs" ]] ||
      { log "not a release tarball"; rm -rf "$rel"; exit 3; }
    echo "$sha" > "$rel/REVISION"

    previous=$(readlink -f "$BASE/current" 2>/dev/null || true)
    cp "$rel/deploy/ecosystem.beta.config.cjs" "$BASE/ecosystem.config.cjs"
    switch_to "$rel"
    run_current
    if healthy; then
      log "live: $(basename "$rel")"
    else
      log "health check failed"
      if [[ -n "$previous" && -d "$previous" ]]; then
        switch_to "$previous"
        run_current
        log "back on $(basename "$previous")"
      fi
      exit 4
    fi

    prune_old_releases
    ;;

  rollback)
    cur=$(readlink -f "$BASE/current")
    prev=$(releases_newest_first | grep -vxF "$cur" | head -n 1 || true)
    [[ -n "$prev" ]] || { log "no earlier release to roll back to"; exit 5; }
    switch_to "$prev"
    run_current
    healthy && log "rolled back to $(basename "$prev")" || { log "rolled back, but the health check failed"; exit 4; }
    ;;

  status)
    if [[ -L "$BASE/current" ]]; then
      echo "current: $(basename "$(readlink -f "$BASE/current")")"
    else
      echo "current: none"
    fi
    releases_newest_first | head -n "$KEEP_RELEASES" | xargs -r -n1 basename || true
    ;;

  *)
    echo "usage: deploy <sha> | rollback | status" >&2
    exit 2
    ;;
esac
