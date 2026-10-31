---
title: Docker deployment
description: Deploy Bulwark with Docker and Docker Compose.
order: 1
edition: full
editionNote: "This page runs Bulwark (not Lite) in a container. Lite has its own small container image, described under Static hosting."
---

# Docker deployment

Docker is the shortest production path for the full edition. (Bulwark Lite needs no container at all; see [static hosting](/docs/deployment/static).) Pre-built images live on GitHub Container Registry at `ghcr.io/bulwarkmail/webmail`, and nowhere else. Both `linux/amd64` and `linux/arm64` come off native runners rather than QEMU emulation, which is why the ARM image isn't the slow one.

Two GHCR packages carry the images:

| Image                                           | Channel | Built from                                          |
| ----------------------------------------------- | ------- | --------------------------------------------------- |
| `ghcr.io/bulwarkmail/webmail:latest`            | Stable  | each published release                              |
| `ghcr.io/bulwarkmail/webmail:1.19.1`, `:1.19`, `:1` | Pinned  | one release, or the newest release of a minor or major line |
| `ghcr.io/bulwarkmail/webmail-beta:latest`       | Beta    | every push to `main`, for testing                   |

Every release tag also has an `-always` variant (for example `1.19.1-always` or `latest-always`), built with `NEXT_PUBLIC_LOCALE_PREFIX=always` so every URL carries the locale. The old `webmail:dev` tag is no longer built; don't use it.

## First-launch setup wizard

There is no `.env.local` to write before the first start. Launch the container with a volume on `/app/data`:

```bash
docker run -d --name bulwark \
  -p 3000:3000 \
  -v bulwark-data:/app/data \
  ghcr.io/bulwarkmail/webmail:latest
docker logs bulwark   # the SETUP REQUIRED block has the setup token
```

Open http://localhost:3000. The wizard asks for a setup token first: copy it, or the full `/setup#token=…` link, from the SETUP REQUIRED block in `docker logs bulwark`. It expires after an hour; restart the container for a new one. The wizard then walks through the server, sign-in, security, logging and branding, and ends with the admin password. It writes the config to `ADMIN_CONFIG_DIR` (`config.json`, and the admin password hash in `admin.json`) and keeps the generated session secret in `ADMIN_STATE_DIR`.

Afterwards you can remount the config volume read-only; give `/app/data/admin` a volume of its own for that (see [Persistent volumes](#persistent-volumes)). Set `ADMIN_CONFIG_READONLY=true` as well, so the app refuses config writes with a clear message. The wizard's "Lock the configuration after setup" box only leaves a `.config-locked` reminder file; it doesn't lock anything by itself.

Setting `JMAP_SERVER_URL` in the environment skips the wizard - use that path when you want env-driven configuration.

## Using Docker

### Pull and run

```bash
# Latest stable release
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -v bulwark-data:/app/data \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest

# Pin to a specific version
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -v bulwark-data:/app/data \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:1.19.1

# IPv6 dual-stack
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -v bulwark-data:/app/data \
  -e HOSTNAME=:: \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest
```

Environment variables are read at runtime - no rebuild is needed when changing configuration.

### Build from source

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
docker build -t bulwark .
docker run -d --name bulwark -p 3000:3000 -e JMAP_SERVER_URL=https://mail.example.com bulwark
```

## Docker Compose

For anything longer-lived than a test, run Bulwark and Stalwart from one compose file. The full file, the `env_file` variant, and the volume layout are on the [Docker Compose](/docs/deployment/docker/compose) page.

## Persistent volumes

Bulwark writes everything under `/app/data`, in the directories below. Mount `/app/data` as one volume and all of them survive when the container is recreated. Docker fills a new named volume from the image, owned by the app's user (uid 1001). A bind mount to a host directory has to be writable by uid 1001.

### Settings sync (`SETTINGS_DATA_DIR`)

Encrypted per-account user preferences. Required only when `SETTINGS_SYNC_ENABLED=true`. Default: `./data/settings` → `/app/data/settings` in the container.

### Admin config (`ADMIN_CONFIG_DIR`)

Operator-authored state written by the setup wizard and the admin dashboard: `config.json`, `policy.json`, `admin.json` (passwordHash only), `plugin-config/`, `plugins/`, `themes/`, and uploaded branding assets. Default: `./data/admin` → `/app/data/admin` in the container.

After the setup wizard completes, this directory can optionally be mounted **read-only** for immutable deployments. For that it needs a volume of its own on top of the `/app/data` one (see the example below). Pair with `ADMIN_CONFIG_READONLY=true` so the app produces a clean error instead of an EROFS halfway through a write.

### Admin runtime state (`ADMIN_STATE_DIR`)

Runtime mutations that must always stay writable: `admin-state.json` (login timestamps), `audit.log`, the bootstrap setup token, and the session secret Bulwark generates when `SESSION_SECRET` isn't set. Default: `./data/admin-state` → `/app/data/admin-state` in the container.

### Plugin credentials (`PLUGIN_SECRETS_DIR`)

The encrypted credentials users save when they connect a plugin to an outside account. Default: next to the settings directory, `/app/data/plugin-secrets` in the container. Lose it and every user has to connect those accounts again.

### Update check (`VERSION_CHECK_DATA_DIR`)

The result of the last [update check](/docs/deployment/updating#the-in-app-update-notice). Default: `/app/data/version-check`. Safe to lose.

### Telemetry state (`TELEMETRY_DATA_DIR`)

Random `instance_id`, admin consent choice, HMAC'd login fingerprints. Default: `./data/telemetry` → `/app/data/telemetry`. Mount this so the consent and instance id survive image upgrades. The heartbeat is off until an admin opts in; `BULWARK_TELEMETRY=off` locks it off and greys out the toggle.

### Legacy single-volume installs (`ADMIN_DATA_DIR`)

Pre-1.6.4 installs used a single `ADMIN_DATA_DIR` volume containing both config and state. That variable is still honoured when neither split variable is set - existing installs keep working without migration.

### Example

```yaml
bulwark:
  image: ghcr.io/bulwarkmail/webmail:latest
  environment:
    JMAP_SERVER_URL: https://mail.example.com
    SESSION_SECRET: replace-with-64-hex-chars # openssl rand -hex 32
    SETTINGS_SYNC_ENABLED: "true"
    ADMIN_PASSWORD: your-strong-admin-password
    EXTENSION_DIRECTORY_URL: https://extensions.bulwarkmail.org
  volumes:
    - bulwark-data:/app/data
    # Only if you want to mount the admin config read-only after setup:
    # - bulwark-config:/app/data/admin       # rw during setup
    # - bulwark-config:/app/data/admin:ro    # ro after setup
```

`SESSION_SECRET` must be at least 32 characters; generate one with `openssl rand -hex 32`. Leave it out and Bulwark generates one in the state directory.

## Reverse proxy

Terminate TLS in front of Bulwark, in Caddy, Nginx, or Traefik, and forward `X-Forwarded-For`, `X-Forwarded-Proto` and `Host`. Push uses a JMAP EventSource that the browser opens to Stalwart directly, so it's the proxy in front of Stalwart that must not buffer it. Working configs for all three, plus subpath mounting, are on the [reverse proxy](/docs/deployment/docker/reverse-proxy) page.

## Health check

`/api/health` answers liveness probes for Docker and orchestrators with `{"status":"healthy"}`. Signed-in users and admins can add `?detailed=true` to get uptime, version and heap usage measured against V8's own limit; the status turns `degraded` from 85 % of that limit. If the handler itself fails, it answers `unhealthy` with a 503. The heap figure is the first thing to look at when a container is being OOM-killed rather than crashing.

## Updating

`docker compose pull && docker compose up -d`. Release channels, what survives an upgrade, and the in-app update notice are covered under [Updating](/docs/deployment/updating).
