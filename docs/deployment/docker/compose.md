---
title: Docker Compose
description: Run Bulwark alongside Stalwart with Docker Compose.
order: 1
edition: full
editionNote: "This Compose file runs Bulwark (not Lite) next to Stalwart. Lite has its own container image, described under Static hosting."
---

# Docker Compose

One compose file brings up Stalwart and Bulwark together: mail server and client, no other moving parts.

> **First-launch note**
> Omit `JMAP_SERVER_URL` from the environment and the web setup wizard runs on first launch, configuring the JMAP endpoint, OAuth, branding, and the admin password through the browser. There is no `.env.local` to author first. The wizard asks for a setup token, which `docker compose logs bulwark` shows in its SETUP REQUIRED block.

## Basic setup

Create a `docker-compose.yml`:

```yaml
services:
  stalwart:
    image: stalwartlabs/stalwart:v1.0 # a release line, never latest
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
    volumes:
      - bulwark-data:/app/data # admin config, sessions, user settings
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
  bulwark-data:
```

<div class="bw-note bw-note-warning"><b>Warning.</b> Keep Stalwart on a release line such as <code>v1.0</code>. With a floating tag like <code>latest</code>, <code>docker compose pull</code> moves the server to whatever Stalwart releases next. A server that still runs 0.16 stays on <code>v0.16</code> until you migrate it: Stalwart 1.0 can't open a 0.16 data store; see <a href="/docs/deployment/updating/stalwart-1-0">Upgrading to Stalwart 1.0</a>.</div>

On Stalwart 1.0, open Bulwark's admin **Authentication** page once the server is set up and click **Set up automagically** under **OAuth / OpenID Connect**. With `JMAP_SERVER_URL` set as above, the admin console is off until you also set `ADMIN_PASSWORD`. The button registers Bulwark with Stalwart, which two-factor sign-ins need for the account security settings, and single sign-on needs at all; [Register Bulwark with Stalwart](/docs/deployment/updating/stalwart-1-0#register-bulwark-with-stalwart) has the details.
Browsers load mail straight from `JMAP_SERVER_URL`, so it has to be an address they can reach, and Stalwart needs its [permissive CORS policy](/docs/getting-started/configuration/stalwart-setup#cors-configuration) turned on unless the two share an origin. Port 8080 serves Stalwart's first-launch setup; you can drop it once the server is configured.

The `stalwart` service above is a minimal example to get the pair talking. For the authoritative Stalwart setup - image, ports, volumes, and initial configuration - follow the [official Stalwart installation guide](https://stalw.art/docs/install/).

## Using env_file

For more complex configurations (OAuth, session secret, branding, etc.), use an environment file. Create it first, next to `docker-compose.yml`; Compose refuses to start without it. Copy it from a checkout (`cp .env.example .env.local`), or download [.env.example](https://github.com/bulwarkmail/webmail/blob/main/.env.example) from the repository. Set `JMAP_SERVER_URL` to your server: the example file sets it to a placeholder, and any value there turns the setup wizard off.

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    container_name: bulwark
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    volumes:
      - bulwark-data:/app/data
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
  bulwark-data:
```

## Persistent volumes

Everything Bulwark writes lives under `/app/data`, so one volume there keeps all of it: the admin config, its runtime state, synced user settings, the credentials users save for plugins, the telemetry id and the update-check state.

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      # JMAP_SERVER_URL set here skips the setup wizard
      JMAP_SERVER_URL: https://mail.example.com
      SESSION_SECRET: replace-with-64-hex-chars # openssl rand -hex 32
      SETTINGS_SYNC_ENABLED: "true"
    volumes:
      - bulwark-data:/app/data
      # Only if you want to mount the admin config read-only after setup:
      # - bulwark-config:/app/data/admin
    # ...

volumes:
  bulwark-data:
  # bulwark-config:
```

- `SESSION_SECRET` must be at least 32 characters; generate one with `openssl rand -hex 32`. Leave it out and Bulwark generates one in the state directory.
- Docker fills a new named volume from the image, owned by the app's user (uid 1001). If you bind-mount a host directory instead, make it writable by uid 1001.
- `SETTINGS_DATA_DIR` defaults to `./data/settings` → `/app/data/settings` in the container.
- `ADMIN_CONFIG_DIR` defaults to `./data/admin` → `/app/data/admin`. After the setup wizard runs you may remount this `:ro` and set `ADMIN_CONFIG_READONLY=true`; that needs the separate volume shown commented out above.
- `ADMIN_STATE_DIR` defaults to `./data/admin-state` → `/app/data/admin-state`. Always read-write.
- `PLUGIN_SECRETS_DIR` defaults to `/app/data/plugin-secrets` and `VERSION_CHECK_DATA_DIR` to `/app/data/version-check`, both inside the one volume.
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

## Next step

Put a [reverse proxy](/docs/deployment/docker/reverse-proxy) in front of Bulwark so users reach it over HTTPS.
