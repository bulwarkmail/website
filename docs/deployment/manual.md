---
title: Manual deployment
description: Deploy Bulwark manually on a server.
order: 2
---

# Manual deployment

Deploy Bulwark directly on a Linux server without Docker.

## Prerequisites

- Node.js 20 or later
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

The build produces a standalone output in `.next/standalone` that includes all dependencies.

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
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=0.0.0.0
# Admin dirs - point at a writable, service-owned location
Environment=ADMIN_CONFIG_DIR=/var/lib/bulwark/admin
Environment=ADMIN_STATE_DIR=/var/lib/bulwark/admin-state
Environment=TELEMETRY_DATA_DIR=/var/lib/bulwark/telemetry
EnvironmentFile=/opt/bulwark/.env.local

[Install]
WantedBy=multi-user.target
```

Make sure the `www-data` user (or whichever user runs the service) owns the directories listed in `ADMIN_CONFIG_DIR`, `ADMIN_STATE_DIR`, and `TELEMETRY_DATA_DIR` so the setup wizard can write to them.

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
# or: sudo systemctl restart bulwark
```

[Updating](/docs/deployment/updating) covers release channels and which directories have to persist.
