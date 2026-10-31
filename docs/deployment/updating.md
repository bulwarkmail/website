---
title: Updating
description: Release channels, how to upgrade each install type, and how the update notice works.
order: 4
edition: both
---

# Updating

## Release channels

Two GHCR packages, built for `linux/amd64` and `linux/arm64` on native runners:

| Image                                           | Channel | Built from                                          |
| ----------------------------------------------- | ------- | --------------------------------------------------- |
| `ghcr.io/bulwarkmail/webmail:latest`            | Stable  | each published release                              |
| `ghcr.io/bulwarkmail/webmail:1.19.1`, `:1.19`, `:1` | Pinned  | one release, or the newest release of a minor or major line |
| `ghcr.io/bulwarkmail/webmail-beta:latest`       | Beta    | every push to `main`                                |

Run `:latest` unless you have a reason not to. Pin `:1.19.1` (or `:1.19`) when you need reproducible deploys. Use `ghcr.io/bulwarkmail/webmail-beta:latest` only where breakage is acceptable; it moves with every push to `main`. Every release tag also has an `-always` variant (for example `1.19.1-always`) built with `NEXT_PUBLIC_LOCALE_PREFIX=always`. The old `webmail:dev` tag is no longer built.

Each GitHub release also carries the standalone Node.js tarballs (`bulwark-standalone-<version>-linux-amd64.tar.gz`, `-arm64`) and, from 1.11 on, the [Bulwark Lite](/docs/deployment/static) zips `bulwark-lite-<version>.zip` and `bulwark-lite-stalwart.zip`. Every file has a `.sha256` next to it and a build provenance attestation: `gh attestation verify <file> --repo bulwarkmail/webmail`. Lite has no update channel of its own: download the new zip, keep your `config.json`, and re-upload. A Lite install hosted by Stalwart updates when Stalwart downloads `bulwark-lite-stalwart.zip` again, see [Install on Stalwart](/docs/deployment/stalwart-app#updating).

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

Configuration is read at runtime, so an upgrade never requires rewriting `.env.local` or rebuilding to change a setting. The one exception is the handful of build-time variables (`NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_LOCALE_PREFIX`, `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_PUSH_RELAY_URL`), which need a rebuild if you change them. The Docker build takes the first three as `--build-arg`; for a different push relay, add it under **User policy > Push relays** in the admin dashboard instead.

## Moving to Stalwart 1.0

Upgrade Bulwark to {{BULWARK_VERSION}} or newer before the mail server moves to Stalwart 1.0. Once the server runs 1.0, click **Set up automagically** under **OAuth / OpenID Connect** on the admin **Authentication** page, and check the server settings some features depend on there. [Upgrading to Stalwart 1.0](/docs/deployment/updating/stalwart-1-0) has the order, the settings and the differences.

## What survives an upgrade

Only what you mounted. Everything Bulwark writes lives under `/app/data`, split into directories so they can be given different treatment. Mounting `/app/data` as one volume (`-v bulwark-data:/app/data`) keeps all of them. Docker fills a new named volume from the image, owned by the app's user (uid 1001); a bind-mounted host directory has to be writable by uid 1001.

| Directory            | Variable             | Holds                                              |
| -------------------- | -------------------- | -------------------------------------------------- |
| `/app/data/admin`       | `ADMIN_CONFIG_DIR`   | Wizard and dashboard config, plugins, themes, branding |
| `/app/data/admin-state` | `ADMIN_STATE_DIR`    | Audit log, login timestamps, setup token, generated session secret |
| `/app/data/settings`    | `SETTINGS_DATA_DIR`  | Encrypted per-account user settings                |
| `/app/data/plugin-secrets` | `PLUGIN_SECRETS_DIR` | Credentials users saved for plugins, encrypted |
| `/app/data/telemetry`   | `TELEMETRY_DATA_DIR` | Instance id and telemetry consent                  |
| `/app/data/version-check` | `VERSION_CHECK_DATA_DIR` | Last update check (safe to lose)            |

An install that mounts only some of these directories loses the others when the container is recreated. Older examples in these docs, and the repository's `docker-compose.yml`, mount four volumes and leave out the plugin credentials; add a volume for `/app/data/plugin-secrets`, or move to the one `/app/data` volume.

Lose the config volume and Bulwark starts as a fresh install: the setup wizard runs again (the token is in the log), or, with `JMAP_SERVER_URL` set, the admin dashboard stays off until `ADMIN_PASSWORD` is set. Lose the settings volume and users get defaults back. Neither loses mail, because Bulwark stores no mail.

## The in-app update notice

Bulwark checks for a newer release 30 seconds after it starts and then every hour, and logs the result. When one exists, the version line on the login page turns amber ("New version available") and links to the release notes, and the admin entry in the navigation gets a dot. The admin dashboard's **Version** page shows the details.

The feed marks releases that fix a published security advisory. When the running build is older than one of those, or no longer supported, the version line turns red ("Security update available", "Version no longer supported"), so an operator can tell a routine update from one that should happen today. Signed-in users also see the advisory text in the version details; visitors who aren't signed in never do. Several releases since 1.9 have carried such fixes, the latest in 1.18.0; the details are in the [repository's security advisories](https://github.com/bulwarkmail/webmail/security/advisories).

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
