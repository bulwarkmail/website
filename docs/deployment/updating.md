---
title: Updating
description: Release channels, how to upgrade each install type, and how the update notice works.
order: 3
---

# Updating

## Release channels

Two GHCR packages, built for `linux/amd64` and `linux/arm64` on native runners:

| Tag                                  | Channel | Built from          |
| ------------------------------------ | ------- | ------------------- |
| `ghcr.io/bulwarkmail/webmail:latest` | Stable  | tagged `main`       |
| `ghcr.io/bulwarkmail/webmail:dev`    | Dev     | every `dev` push    |
| `ghcr.io/bulwarkmail/webmail:1.7.8`  | Pinned  | one specific release |

Run `:latest` unless you have a reason not to. Pin a version when you need reproducible deploys. Use `:dev` only where breakage is acceptable, because it moves whenever `dev` does.

## Upgrading

**Docker Compose:**

```bash
docker compose pull
docker compose up -d
```

**Plain Docker:**

```bash
docker pull ghcr.io/bulwarkmail/webmail:latest
docker rm -f bulwark
# then re-run your original `docker run` command
```

**Manual install:**

```bash
cd /opt/bulwark
git pull origin main
npm install
npm run build
pm2 restart bulwark      # or: sudo systemctl restart bulwark
```

Configuration is read at runtime, so an upgrade never requires rewriting `.env.local` or rebuilding to change a setting. The one exception is the handful of build-time variables (`NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_LOCALE_PREFIX`, `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_PUSH_RELAY_URL`), which need a rebuild if you change them.

## What survives an upgrade

Only what you mounted. Everything Bulwark writes lives under `/app/data`, split into four directories so they can be given different treatment:

| Directory            | Variable             | Holds                                              |
| -------------------- | -------------------- | -------------------------------------------------- |
| `/app/data/admin`       | `ADMIN_CONFIG_DIR`   | Wizard and dashboard config, plugins, themes, branding |
| `/app/data/admin-state` | `ADMIN_STATE_DIR`    | Audit log, login timestamps, setup token           |
| `/app/data/settings`    | `SETTINGS_DATA_DIR`  | Encrypted per-account user settings                |
| `/app/data/telemetry`   | `TELEMETRY_DATA_DIR` | Instance id and telemetry consent                  |

Lose the config volume and the next start generates a fresh random admin password and logs it. Lose the settings volume and users get defaults back. Neither loses mail, because Bulwark stores no mail.

## The in-app update notice

Bulwark checks for a newer release at startup, logs the result, and shows a notice in the app when one exists. The notice is not dismissible, and its refresh button also picks up the new service worker so the PWA shell doesn't stay on the old build.

Turn it off if you'd rather manage upgrades entirely from outside:

```env
BULWARK_UPDATE_CHECK=off
```

Or point it at your own feed, which is the better option on an air-gapped deployment:

```env
BULWARK_UPDATE_CHECK_URL=https://updates.example.com/bulwark.json
```

An empty value for that variable disables the check as well. State is kept in `VERSION_CHECK_DATA_DIR` (default `./data/version-check`).

The check is separate from the [anonymous usage heartbeat](/docs/features/telemetry), which is off unless you turn it on.

## Downgrading

Pin the earlier tag and restart. Config files are read forwards and backwards for anything within a minor series, but a downgrade across a release that changed the config layout may leave keys the older build ignores. Take a copy of the config volume before a major upgrade, which costs nothing and occasionally saves an evening.

## Related pages

- [Docker deployment](/docs/deployment/docker)
- [Manual deployment](/docs/deployment/manual)
- [Admin dashboard](/docs/guides/admin)
