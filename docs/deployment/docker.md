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
| `ghcr.io/bulwarkmail/webmail:1.5.2`  | Pinned  | Specific release    |

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

Bulwark stores two kinds of state on disk. Mount persistent volumes for both if you want them to survive container restarts.

### Settings sync (`SETTINGS_DATA_DIR`)

Encrypted per-account user preferences. Required only when `SETTINGS_SYNC_ENABLED=true`. Default: `./data/settings` → `/app/data/settings` in the container.

### Admin data (`ADMIN_DATA_DIR`)

Admin password hash, plugin/theme registry, plugin configs, runtime config overrides, and audit log. Default: `./data/admin` → `/app/data/admin` in the container. Without this volume, admin state (including the password) is lost on container recreation and a new random admin password is generated and logged on next start.

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
    - bulwark-admin:/app/data/admin
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

## Health Check

Bulwark exposes a health check endpoint at `/api/health`. Use it in your Docker or orchestration health checks.
