---
title: Docker Deployment
description: Deploy Bulwark with Docker and Docker Compose.
order: 1
---

# Docker Deployment

The easiest way to deploy Bulwark in production is with Docker. Pre-built images are published only to **GitHub Container Registry (GHCR)** at `ghcr.io/bulwarkmail/webmail`. Both `linux/amd64` and `linux/arm64` are built natively (no QEMU emulation) so ARM deployments run at full speed.

Two release channels are available as separate GHCR packages:

| Tag                                  | Channel | Source              |
| ------------------------------------ | ------- | ------------------- |
| `ghcr.io/bulwarkmail/webmail:latest` | Stable  | `main` branch tags  |
| `ghcr.io/bulwarkmail/webmail:dev`    | Dev     | `dev` branch builds |
| `ghcr.io/bulwarkmail/webmail:1.6.4`  | Pinned  | Specific release    |

## First-Launch Setup Wizard

Since 1.6.4 you don't need to write `.env.local` before the first start - launch the container with persistent volumes for `ADMIN_CONFIG_DIR` and `ADMIN_STATE_DIR`, then open the URL and the web setup wizard takes you through JMAP, OAuth, branding, and admin password. The wizard persists everything to `ADMIN_CONFIG_DIR/config.json`. After setup the config volume can optionally be remounted read-only (drop a `.config-locked` marker from the wizard or set `ADMIN_CONFIG_READONLY=true`).

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

### Pull and Run

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
  ghcr.io/bulwarkmail/webmail:1.5.2

# IPv6 dual-stack
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e HOSTNAME=:: \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest
```

Environment variables are read at runtime - no rebuild is needed when changing configuration.

### Build from Source

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
docker build -t bulwark .
docker run -d --name bulwark -p 3000:3000 -e JMAP_SERVER_URL=https://mail.example.com bulwark
```

## Docker Compose

Create a `docker-compose.yml` for running Bulwark alongside Stalwart:

```yaml
services:
  stalwart:
    image: stalwartlabs/mail-server:latest
    container_name: stalwart
    ports:
      - "443:443"
      - "25:25"
      - "587:587"
      - "993:993"
      - "8080:8080"
    volumes:
      - stalwart-data:/opt/stalwart
    restart: unless-stopped

  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    container_name: bulwark
    ports:
      - "3000:3000"
    environment:
      JMAP_SERVER_URL: http://stalwart:8080
    depends_on:
      - stalwart
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://127.0.0.1:3000/api/health",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped

volumes:
  stalwart-data:
```

Alternatively, use an `env_file` to load settings from `.env.local`:

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://127.0.0.1:3000/api/health",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped
```

Start the stack:

```bash
docker compose up -d
```

## Persistent Volumes

Bulwark stores three kinds of state on disk. Mount persistent volumes for each if you want them to survive container restarts.

### Settings sync (`SETTINGS_DATA_DIR`)

Encrypted per-account user preferences. Required only when `SETTINGS_SYNC_ENABLED=true`. Default: `./data/settings` → `/app/data/settings` in the container.

### Admin config (`ADMIN_CONFIG_DIR`) - new in 1.6.4

Operator-authored state written by the setup wizard and the admin dashboard: `config.json`, `policy.json`, `admin.json` (passwordHash only), `plugin-config/`, `plugins/`, `themes/`, and uploaded branding assets. Default: `./data/admin` → `/app/data/admin` in the container.

After the setup wizard completes, this volume can optionally be mounted **read-only** for immutable deployments. Pair with `ADMIN_CONFIG_READONLY=true` so the app produces a clean error instead of an EROFS halfway through a write.

### Admin runtime state (`ADMIN_STATE_DIR`) - new in 1.6.4

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

## Reverse Proxy

For production, place Bulwark behind a reverse proxy like Nginx or Caddy for TLS termination.

### Caddy Example

```caddy
mail.example.com {
    reverse_proxy bulwark:3000
}
```

### Nginx Example

```nginx
server {
    listen 443 ssl http2;
    server_name mail.example.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Subpath Deployment

To serve Bulwark from a URL prefix like `https://example.com/webmail`, set `NEXT_PUBLIC_BASE_PATH` at **build time** (Next.js bakes it into asset URLs) and build your own image:

```bash
docker build --build-arg NEXT_PUBLIC_BASE_PATH=/webmail -t bulwark-webmail .
```

Then run with the matching locale prefix mode:

```yaml
bulwark:
  image: bulwark-webmail
  environment:
    JMAP_SERVER_URL: http://stalwart:8080
    NEXT_PUBLIC_LOCALE_PREFIX: always
```

Do **not** strip the prefix at the proxy - the container expects requests under `/webmail/...` and serves all routes (`/webmail/api/...`, `/webmail/_next/static/...`, `/webmail/sw.js`, etc.) accordingly.

## Health Check

Bulwark exposes a health check endpoint at `/api/health`. Use it in your Docker or orchestration health checks. The health endpoint includes detailed memory diagnostics and a stable liveness probe.
