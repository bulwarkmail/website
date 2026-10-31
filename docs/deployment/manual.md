---
title: Manual deployment
description: Deploy Bulwark manually on a server.
order: 3
edition: full
---

# Manual deployment

Deploy Bulwark directly on a Linux server without Docker.

There are two ways to get the build: clone and build it yourself as below, or download the prebuilt standalone tarball attached to every [release](https://github.com/bulwarkmail/webmail/releases) (`bulwark-standalone-<version>-linux-amd64.tar.gz` or `-arm64`). The tarball unpacks to a `bulwark-standalone/` folder with `server.js` at its top and the static files already copied in:

```bash
tar -xzf bulwark-standalone-*.tar.gz -C /opt
mv /opt/bulwark-standalone /opt/bulwark
```

With the tarball, skip step 1 and use `ExecStart=/usr/bin/node /opt/bulwark/server.js` in the service file.

## Prerequisites

- Node.js 20.9 or later (the Docker image uses Node 24, the release tarballs are built with Node 22)
- A process manager, PM2 or systemd
- A reverse proxy: Nginx, Caddy, or whatever you already run

## Steps

### 1. Clone and build

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
npm install
npm run build
```

The build produces a standalone output in `.next/standalone` with the server and its dependencies. Next leaves the static files and `public` out of it, so copy them in before you run `server.js` directly (the systemd unit below does); without them pages load without styles or scripts:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

`npm start` (the PM2 route) runs `next start` from the checkout and doesn't need the copy.

### 2. Configure the environment (optional)

The web setup wizard handles JMAP, OAuth, branding, and the admin password on first launch, so `.env.local` is only worth writing when you want env-driven, immutable configuration. To pre-seed it:

```bash
cp .env.example .env.local
```

Set your JMAP endpoint and any other configuration:

```env
JMAP_SERVER_URL=https://mail.example.com
APP_NAME=Bulwark
```

Setting `JMAP_SERVER_URL` in the environment skips the wizard.

### 3. Run with PM2

```bash
npm install -g pm2
pm2 start npm --name bulwark -- start
pm2 save
pm2 startup
```

### 4. Run with systemd

Create `/etc/systemd/system/bulwark.service`:

```ini
[Unit]
Description=Bulwark Webmail
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/bulwark
ExecStart=/usr/bin/node .next/standalone/server.js
# From the release tarball: ExecStart=/usr/bin/node /opt/bulwark/server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=0.0.0.0
# Data dirs - point at a writable, service-owned location
Environment=ADMIN_CONFIG_DIR=/var/lib/bulwark/admin
Environment=ADMIN_STATE_DIR=/var/lib/bulwark/admin-state
Environment=TELEMETRY_DATA_DIR=/var/lib/bulwark/telemetry
Environment=SETTINGS_DATA_DIR=/var/lib/bulwark/settings
Environment=PLUGIN_SECRETS_DIR=/var/lib/bulwark/plugin-secrets
Environment=VERSION_CHECK_DATA_DIR=/var/lib/bulwark/version-check
EnvironmentFile=-/opt/bulwark/.env.local

[Install]
WantedBy=multi-user.target
```

`server.js` changes into its own folder when it starts, so any data directory you don't set lands under `.next/standalone/data/`, which the next `npm run build` deletes. Make sure the `www-data` user (or whichever user runs the service) owns `/var/lib/bulwark` and everything below it, so the setup wizard and the app can write there. The `-` in front of the `EnvironmentFile` path lets the unit start when there is no `.env.local`.

Enable and start:

```bash
sudo systemctl enable bulwark
sudo systemctl start bulwark
```

## Updating

```bash
cd /opt/bulwark
git pull origin main
npm install
npm run build
pm2 restart bulwark
# or, for systemd, copy the static files in again and restart:
# cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public
# sudo systemctl restart bulwark
```

With the tarball, unpack the new release to a fresh `/opt/bulwark`, copy your `.env.local` across if you have one, and restart the service. The data stays in `/var/lib/bulwark`.

[Updating](/docs/deployment/updating) covers release channels and which directories have to persist.
