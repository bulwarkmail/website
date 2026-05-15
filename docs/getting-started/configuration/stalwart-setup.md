---
title: Stalwart Setup
description: Configure Stalwart Mail Server for use with Bulwark.
order: 1
---

# Stalwart Setup

Bulwark requires a running Stalwart Mail Server with JMAP enabled.

## Version Requirement

The self-service portal (account settings, app passwords, API keys, password change, vacation responder, Sieve management) requires **Stalwart 0.16 or newer**. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP `x:` methods, and Bulwark only talks to the new JMAP endpoint. The deprecated `STALWART_API_URL` environment variable has no effect from Bulwark 1.5.0 onward.

Older Stalwart versions still work for plain mail/calendar/contacts/files, but Stalwart-specific account and admin features will be unavailable.

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

## Configuring with the Setup Wizard

If you are running Bulwark 1.6.4 or newer and don't have `JMAP_SERVER_URL` set in the environment, the first-launch web setup wizard probes the JMAP server for you. Paste the URL, the wizard validates that `.well-known/jmap` returns a usable session, asks for explicit confirmation when no session is found, and offers an **OAuth auto-setup** dialog that validates origin and issuer URLs against your Stalwart instance end-to-end.

For env-driven deployments, set `JMAP_SERVER_URL` and the wizard is skipped.

## Stalwart-Specific Features

When connected to Stalwart 0.16+, Bulwark enables additional features that depend on Stalwart's JMAP `x:` methods:

- **Password change** - Users can change their password from account settings
- **TOTP 2FA** - Enable/disable two-factor authentication and generate recovery codes
- **App passwords** - Generate per-app credentials (e.g., for IMAP/SMTP clients), with optional IP allowlist per password
- **API keys** - Generate, list, and revoke Stalwart API keys from the admin panel
- **Sieve filters** - Server-side email filtering via Sieve scripts (RFC 9661)
- **Vacation responder** - JMAP `VacationResponse` management with Sieve generation and parsing
- **Display name management** - Update display name from settings
- **Storage quota display** - Show account storage usage
- **Identity sync** - Identities are kept in sync with the server via JMAP
- **Admin panel** - Single tabbed page with dedicated policy sections, plugin and theme management with forced enable/disable controls, IP allowlists, OAuth auto-setup, and audit logs

The corresponding Stalwart permissions to enable for these features are documented in [Account Security](/docs/guides/account-security).

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

You should see a JMAP session resource with capabilities listed. The setup wizard performs the same probe and will require explicit confirmation if no session is returned.

## Multi-Server Deployments

Bulwark supports pointing a single deployment at multiple JMAP servers - useful for organisations running shards by domain. Set `JMAP_SERVER_URL` to a comma-separated list, or add servers from the **Server** step of the setup wizard. The login form auto-picks the server by email domain when possible; users can still pick manually.
