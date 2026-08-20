---
title: Stalwart setup
description: Configure Stalwart Mail Server for use with Bulwark.
order: 1
---

# Stalwart setup

Bulwark requires a running Stalwart Mail Server with JMAP enabled.

## Version requirement

The self-service portal (account settings, app passwords, API keys, password change, vacation responder, Sieve management) requires **Stalwart 0.16 or newer**. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP `x:` methods, and Bulwark only talks to the new JMAP endpoint. The deprecated `STALWART_API_URL` environment variable has no effect from Bulwark 1.5.0 onward.

Older Stalwart versions still work for plain mail/calendar/contacts/files, but Stalwart-specific account and admin features will be unavailable.

## Installing Stalwart

Installing Stalwart itself is out of scope for these docs. Follow the [official Stalwart installation guide](https://stalw.art/docs/install/), which covers Docker, distribution packages, prebuilt binaries, and building from source. Come back here once the server is running.

## Enabling JMAP

JMAP is enabled by default in Stalwart. Ensure your Stalwart config includes a JMAP listener:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "http"
```

## CORS configuration

When Bulwark runs on a different domain than Stalwart, enable CORS:

```toml
[server.http]
permissive-cors = true
```

If CORS is wrong, Bulwark says so on the login screen and names the missing header rather than failing with a generic network error.

## Configuring with the setup wizard

With no `JMAP_SERVER_URL` set in the environment, the first-launch web setup wizard probes the JMAP server for you. Paste the URL, the wizard validates that `.well-known/jmap` returns a usable session, asks for explicit confirmation when no session is found, and offers an **OAuth auto-setup** dialog that validates origin and issuer URLs against your Stalwart instance end-to-end.

For env-driven deployments, set `JMAP_SERVER_URL` and the wizard is skipped.

## Stalwart-specific features

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

## Creating users

Use the Stalwart admin interface or CLI to create mail accounts:

```bash
stalwart-cli account create user@example.com --password yourpassword
```

## Testing the connection

Verify JMAP is working:

```bash
curl -s https://your-stalwart-server.com/.well-known/jmap | jq .
```

You should see a JMAP session resource with capabilities listed. The setup wizard performs the same probe and will require explicit confirmation if no session is returned.

## Multi-server deployments

One deployment can point at several JMAP servers, which is what you want if you shard accounts by domain. Set `JMAP_SERVER_URL` to a comma-separated list, or add servers from the **Server** step of the setup wizard. The login form auto-picks the server by email domain when possible; users can still pick manually.
