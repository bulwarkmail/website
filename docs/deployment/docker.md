---
title: Docker deployment
description: Deploy Bulwark with Docker and Docker Compose.
order: 1
---

# Docker deployment

Docker is the shortest production path. Pre-built images live on GitHub Container Registry at `ghcr.io/bulwarkmail/webmail`, and nowhere else. Both `linux/amd64` and `linux/arm64` come off native runners rather than QEMU emulation, which is why the ARM image isn't the slow one.

Two release channels are available as separate GHCR packages:

| Tag                                  | Channel | Source              |
| ------------------------------------ | ------- | ------------------- |
| `ghcr.io/bulwarkmail/webmail:latest` | Stable  | `main` branch tags  |
| `ghcr.io/bulwarkmail/webmail:dev`    | Dev     | `dev` branch builds |
| `ghcr.io/bulwarkmail/webmail:1.7.8`  | Pinned  | A specific release  |

## First-launch setup wizard

There is no `.env.local` to write before the first start. Launch the container with persistent volumes for `ADMIN_CONFIG_DIR` and `ADMIN_STATE_DIR`, open the URL, and the web setup wizard walks through JMAP, OAuth, branding, and the admin password, persisting everything to `ADMIN_CONFIG_DIR/config.json`. Afterwards the config volume can be remounted read-only: drop a `.config-locked` marker from the wizard's last step, or set `ADMIN_CONFIG_READONLY=true`.

```bash
docker run -d --name bulwark \
  -p 3000:3000 \
  -v bulwark-config:/app/data/admin \
  -v bulwark-state:/app/data/admin-state \
  ghcr.io/bulwarkmail/webmail:latest
# Open http://localhost:3000 and follow the wizard
```

Setting `JMAP_SERVER_URL` in the environment skips the wizard - use that path when you want env-driven configuration.

## Using Docker

### Pull and run

```bash
# Latest stable release
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest

# Pin to a specific version
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:1.7.8

# IPv6 dual-stack
docker run -d \
  --name bulwark \
  -p 3000:3000 \
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

Bulwark stores three kinds of state on disk. Mount persistent volumes for each if you want them to survive container restarts.

### Settings sync (`SETTINGS_DATA_DIR`)

Encrypted per-account user preferences. Required only when `SETTINGS_SYNC_ENABLED=true`. Default: `./data/settings` → `/app/data/settings` in the container.

### Admin config (`ADMIN_CONFIG_DIR`)

Operator-authored state written by the setup wizard and the admin dashboard: `config.json`, `policy.json`, `admin.json` (passwordHash only), `plugin-config/`, `plugins/`, `themes/`, and uploaded branding assets. Default: `./data/admin` → `/app/data/admin` in the container.

After the setup wizard completes, this volume can optionally be mounted **read-only** for immutable deployments. Pair with `ADMIN_CONFIG_READONLY=true` so the app produces a clean error instead of an EROFS halfway through a write.

### Admin runtime state (`ADMIN_STATE_DIR`)

Runtime mutations that must always stay writable: `admin-state.json` (login timestamps), `audit.log`, and the bootstrap setup token. Default: `./data/admin-state` → `/app/data/admin-state` in the container.

### Telemetry state (`TELEMETRY_DATA_DIR`)

Random `instance_id`, admin consent choice, HMAC'd login fingerprints. Default: `./data/telemetry` → `/app/data/telemetry`. Mount this so the consent and instance id survive image upgrades. Set `BULWARK_TELEMETRY=off` to disable the heartbeat entirely.

### Legacy single-volume installs (`ADMIN_DATA_DIR`)

Pre-1.6.4 installs used a single `ADMIN_DATA_DIR` volume containing both config and state. That variable is still honoured when neither split variable is set - existing installs keep working without migration.

### Example

```yaml
bulwark:
  image: ghcr.io/bulwarkmail/webmail:latest
  environment:
    JMAP_SERVER_URL: http://stalwart:8080
    SESSION_SECRET: your-secret-key-here
    SETTINGS_SYNC_ENABLED: "true"
    ADMIN_PASSWORD: your-strong-admin-password
    EXTENSION_DIRECTORY_URL: https://extensions.bulwarkmail.org
  volumes:
    - bulwark-settings:/app/data/settings
    - bulwark-config:/app/data/admin # rw during setup
    # - bulwark-config:/app/data/admin:ro       # ro after setup
    - bulwark-state:/app/data/admin-state
    - bulwark-telemetry:/app/data/telemetry
```

## Reverse proxy

Terminate TLS in front of Bulwark, in Caddy, Nginx, or Traefik. Two things matter beyond the usual: forward `X-Forwarded-For`, `X-Forwarded-Proto` and `Host`, and don't buffer the JMAP EventSource connection that push rides on. Working configs for all three, plus subpath mounting, are on the [reverse proxy](/docs/deployment/docker/reverse-proxy) page.

## Health check

`/api/health` answers liveness probes for Docker and orchestrators. It returns `healthy`, `degraded`, or `unhealthy` along with uptime, version, and heap usage measured against V8's own limit. That last figure is the first thing to look at when a container is being OOM-killed rather than crashing.

## Updating

`docker compose pull && docker compose up -d`. Release channels, what survives an upgrade, and the in-app update notice are covered under [Updating](/docs/deployment/updating).
