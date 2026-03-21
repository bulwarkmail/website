---
title: Stalwart Setup
description: Configure Stalwart Mail Server for use with Bulwark.
order: 1
---

# Stalwart Setup

Bulwark requires a running Stalwart Mail Server with JMAP enabled.

## Installing Stalwart

Stalwart offers multiple installation methods depending on your platform and preferences. For the full list of options (Docker, packages, binaries, and building from source), see the [official Stalwart installation guide](https://stalw.art/docs/category/installation).

Below is a quick-start summary:

### Docker

```bash
docker run -d \
  --name stalwart \
  -p 443:443 -p 25:25 -p 587:587 -p 993:993 -p 8080:8080 \
  -v stalwart-data:/opt/stalwart \
  stalwartlabs/mail-server:latest
```

### Binary

Download the latest release from [Stalwart's GitHub](https://github.com/stalwartlabs/mail-server/releases) and follow the installation instructions for your platform.

## Enabling JMAP

JMAP is enabled by default in Stalwart. Ensure your Stalwart config includes a JMAP listener:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "http"
```

## CORS Configuration

When Bulwark runs on a different domain than Stalwart, enable CORS:

```toml
[server.http]
permissive-cors = true
```

Bulwark automatically detects CORS misconfiguration and displays detailed error messages to help with setup.

## Stalwart-Specific Features

When connected to Stalwart, Bulwark enables additional features that require Stalwart's API:

- **Password change** - Users can change their password from account settings
- **TOTP 2FA** - Enable/disable two-factor authentication
- **Sieve filters** - Server-side email filtering via Sieve scripts
- **Vacation responder** - JMAP VacationResponse management
- **Display name management** - Update display name from settings
- **Storage quota display** - Show account storage usage

To explicitly disable these features (e.g., when using a non-Stalwart JMAP server), set:

```env
STALWART_FEATURES=false
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
