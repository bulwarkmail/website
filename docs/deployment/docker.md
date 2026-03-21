---
title: Docker Deployment
description: Deploy Bulwark with Docker and Docker Compose.
order: 1
---

# Docker Deployment

The easiest way to deploy Bulwark in production is with Docker. Pre-built images are available for amd64 and arm64 on both Docker Hub and GHCR.

## Using Docker

### Pull and Run

```bash
# From Docker Hub
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest

# From GHCR
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest

# IPv6 dual-stack
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e HOSTNAME=:: \
  -e JMAP_SERVER_URL=https://mail.example.com \
  ghcr.io/bulwarkmail/webmail:latest
```

Environment variables are read at runtime Ã¢â‚¬â€ no rebuild is needed when changing configuration.

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

## Settings Sync Volume

If you enable settings sync, mount a persistent volume so encrypted settings survive container restarts. The default `SETTINGS_DATA_DIR` is `./data/settings`, which resolves to `/app/data/settings` in the container (`WORKDIR /app`):

```yaml
bulwark:
  image: ghcr.io/bulwarkmail/webmail:latest
  environment:
    JMAP_SERVER_URL: http://stalwart:8080
    SESSION_SECRET: your-secret-key-here
    SETTINGS_SYNC_ENABLED: "true"
  volumes:
    - bulwark-settings:/app/data/settings
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
