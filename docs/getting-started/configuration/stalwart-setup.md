---
title: Stalwart Setup
description: Configure Stalwart Mail Server for use with Bulwark.
order: 1
---

# Stalwart Setup

Bulwark requires a running Stalwart Mail Server with JMAP enabled.

## Installing Stalwart

### Docker

```bash
docker run -d \
  --name stalwart \
  -p 443:443 -p 25:25 -p 587:587 -p 993:993 -p 8080:8080 \
  -v stalwart-data:/opt/stalwart-mail \
  stalwartlabs/mail-server:latest
```

### Binary

Download the latest release from [Stalwart's GitHub](https://github.com/stalwartlabs/mail-server/releases) and follow the installation instructions for your platform.

## Enabling JMAP

Ensure your Stalwart config includes a JMAP listener:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "jmap"
```

## CORS Configuration

When Bulwark runs on a different domain than Stalwart, enable CORS:

```toml
[server.http]
allowed-origins = ["https://your-bulwark-domain.com"]
```

## Creating Users

Use the Stalwart admin interface or CLI to create mail accounts:

```bash
stalwart-cli account create user@example.com --password yourpassword
```

## Testing the Connection

Verify JMAP is working:

```bash
curl -s https://your-stalwart-server.com/.well-known/jmap | jq .
```

You should see a JMAP session resource with capabilities listed.
