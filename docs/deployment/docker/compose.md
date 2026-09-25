---
title: Docker Compose
description: Run Bulwark alongside Stalwart with Docker Compose.
order: 1
edition: full
---

# Docker Compose

One compose file brings up Stalwart and Bulwark together: mail server and client, no other moving parts.

> **First-launch note**
> Omit `JMAP_SERVER_URL` from the environment and the web setup wizard runs on first launch, configuring the JMAP endpoint, OAuth, branding, and the admin password through the browser. There is no `.env.local` to author first.

## Basic setup

Create a `docker-compose.yml`:

```yaml
services:
  stalwart:
    image: stalwartlabs/stalwart:v0.16 # a release line, never latest
    container_name: stalwart
    ports:
      - "443:443" # HTTPS: JMAP and the web admin
      - "25:25" # SMTP
      - "465:465" # SMTP submission, implicit TLS
      - "993:993" # IMAP, implicit TLS
      - "8080:8080" # plain HTTP: the first-launch setup
    volumes:
      - stalwart-etc:/etc/stalwart
      - stalwart-data:/var/lib/stalwart
    restart: unless-stopped

  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    container_name: bulwark
    ports:
      - "3000:3000"
    environment:
      HOSTNAME: "0.0.0.0" # Use "::" for IPv6
      PORT: "3000"
      # Stalwart's public HTTPS address. Browsers talk JMAP to it directly.
      JMAP_SERVER_URL: https://mail.example.com
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
  stalwart-etc:
  stalwart-data:
```

<div class="bw-note bw-note-warning"><b>Warning.</b> Keep Stalwart on a release line such as <code>v0.16</code>. With a floating tag like <code>latest</code>, <code>docker compose pull</code> could move a 0.16 data store onto Stalwart 1.0, which can't open it; see <a href="/docs/deployment/updating/stalwart-1-0">Upgrading to Stalwart 1.0</a>.</div>

Browsers load mail straight from `JMAP_SERVER_URL`, so it has to be an address they can reach, and Stalwart needs its [permissive CORS policy](/docs/getting-started/configuration/stalwart-setup#cors-configuration) turned on unless the two share an origin. Port 8080 serves Stalwart's first-launch setup; you can drop it once the server is configured.

The `stalwart` service above is a minimal example to get the pair talking. For the authoritative Stalwart setup - image, ports, volumes, and initial configuration - follow the [official Stalwart installation guide](https://stalw.art/docs/install/).

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

## Persistent volumes

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      # JMAP_SERVER_URL set here skips the setup wizard
      JMAP_SERVER_URL: https://mail.example.com
      SESSION_SECRET: your-secret-key-here
      SETTINGS_SYNC_ENABLED: "true"
    volumes:
      - bulwark-settings:/app/data/settings    # encrypted user settings
      - bulwark-config:/app/data/admin         # wizard / admin-managed config
      - bulwark-state:/app/data/admin-state    # audit log, login timestamps
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

## Start the stack

```bash
docker compose up -d
```

## View logs

```bash
docker compose logs -f bulwark
docker compose logs -f stalwart
```

## Updating

```bash
docker compose pull
docker compose up -d
```

See [Updating](/docs/deployment/updating) for release channels and what needs a mounted volume to survive.

## Building from source

To build from source instead of pulling the published image:

```yaml
bulwark:
  build:
    context: ./webmail
    dockerfile: Dockerfile
  container_name: bulwark
  ports:
    - "3000:3000"
  environment:
    JMAP_SERVER_URL: https://mail.example.com
  depends_on:
    - stalwart
  restart: unless-stopped
```
