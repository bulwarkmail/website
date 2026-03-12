---
title: Manual Deployment
description: Deploy Bulwark manually on a server.
order: 2
---

# Manual Deployment

Deploy Bulwark directly on a Linux server without Docker.

## Prerequisites

- Node.js 20+ installed
- A process manager like **PM2** or **systemd**
- A reverse proxy (Nginx, Caddy, etc.)

## Steps

### 1. Clone and Build

```bash
git clone https://github.com/root-fr/jmap-webmail.git
cd jmap-webmail
npm install
npm run build
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Set your JMAP endpoint and any other configuration.

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
ExecStart=/usr/bin/node node_modules/.bin/next start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

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
