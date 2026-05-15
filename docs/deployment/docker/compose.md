---
title: Docker Compose
description: Run Bulwark alongside Stalwart with Docker Compose.
order: 1
---

# Docker Compose

Run Bulwark alongside Stalwart Mail Server using Docker Compose for a complete, self-contained email stack.

> **First-launch note (1.6.4+)**
> If you omit `JMAP_SERVER_URL` from the environment, the web setup wizard runs on first launch and configures the JMAP endpoint, OAuth, branding, and admin password through the browser - no need to author `.env.local` first.

## Basic Setup

Create a `docker-compose.yml`:

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
      HOSTNAME: "0.0.0.0" # Use "::" for IPv6
      PORT: "3000"
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

## Using env_file

For more complex configurations (OAuth, session secret, branding, etc.), use an environment file:

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    container_name: bulwark
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

## Persistent Volumes

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      # JMAP_SERVER_URL set here skips the setup wizard
      JMAP_SERVER_URL: http://stalwart:8080
      SESSION_SECRET: your-secret-key-here
      SETTINGS_SYNC_ENABLED: "true"
    volumes:
      - bulwark-settings:/app/data/settings    # encrypted user settings
      - bulwark-config:/app/data/admin         # wizard / admin-managed config (1.6.4+)
      - bulwark-state:/app/data/admin-state    # audit log, login timestamps (1.6.4+)
      - bulwark-telemetry:/app/data/telemetry  # instance_id + consent
    # ...

volumes:
  bulwark-settings:
  bulwark-config:
  bulwark-state:
  bulwark-telemetry:
```

- `SETTINGS_DATA_DIR` defaults to `./data/settings` → `/app/data/settings` in the container.
- `ADMIN_CONFIG_DIR` defaults to `./data/admin` → `/app/data/admin`. After the setup wizard runs you may remount this `:ro` and set `ADMIN_CONFIG_READONLY=true`.
- `ADMIN_STATE_DIR` defaults to `./data/admin-state` → `/app/data/admin-state`. Always read-write.
- Legacy single-volume installs (`ADMIN_DATA_DIR`) are still honoured when neither split variable is set.

## Start the Stack

```bash
docker compose up -d
```

## View Logs

```bash
docker compose logs -f bulwark
docker compose logs -f stalwart
```

## Updating

```bash
docker compose pull
docker compose up -d
```

## Custom Build

If you want to build Bulwark from source instead of using the prebuilt image:

```yaml
bulwark:
  build:
    context: ./webmail
    dockerfile: Dockerfile
  container_name: bulwark
  ports:
    - "3000:3000"
  environment:
    JMAP_SERVER_URL: http://stalwart:8080
  depends_on:
    - stalwart
  restart: unless-stopped
```
