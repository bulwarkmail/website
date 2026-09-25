---
title: Stalwart setup
description: Configure Stalwart Mail Server for use with Bulwark.
order: 1
edition: both
---

# Stalwart setup

Bulwark requires a running Stalwart Mail Server with JMAP enabled.

## Supported versions

Bulwark needs **Stalwart 0.16.6 or newer**. Stalwart 1.0 needs **Bulwark {{BULWARK_VERSION}} or newer**. Bulwark Lite has the same version numbers, so the same applies to it.

| Stalwart | What it means for Bulwark |
| --- | --- |
| 0.16.5 and older | Not supported |
| 0.16.6 and newer | Supported |
| 0.16.16 and newer | Web push leaves out spam, through the JMAP `emailPush` delivery filter |
| 0.16.19 and newer | Lite served by Stalwart can use its own OAuth client id (`oauthClientId`) |
| 0.16.23 | A Lite Application keeps its running bundle when an update fails to download |
| 1.0 | Supported from Bulwark {{BULWARK_VERSION}} on |

The self-service portal (account settings, app passwords, API keys, password change) and the admin features use Stalwart's JMAP `x:` methods, which replaced its REST self-service HTTP API in 0.16. Bulwark only talks to the JMAP endpoint, and the deprecated `STALWART_API_URL` environment variable has no effect from Bulwark 1.5.0 onward.

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

When Bulwark runs on a different domain than Stalwart, enable CORS. Bulwark Lite on a static host always needs this, because the browser talks to the mail server directly from whatever origin the static files are served on. Lite served by Stalwart itself as an [Application](/docs/deployment/stalwart-app) shares Stalwart's origin and needs no CORS:

```toml
[server.http]
permissive-cors = true
```

If CORS is wrong, Bulwark says so on the login screen and names the missing header rather than failing with a generic network error.

## Configuring with the setup wizard

With no `JMAP_SERVER_URL` set in the environment, the first-launch web setup wizard probes the JMAP server for you. Paste the URL, the wizard validates that `.well-known/jmap` returns a usable session, asks for explicit confirmation when no session is found, and offers an **OAuth auto-setup** dialog that validates origin and issuer URLs against your Stalwart instance end-to-end.

For env-driven deployments, set `JMAP_SERVER_URL` and the wizard is skipped.

## Stalwart-specific features

On Stalwart 0.16.6 and newer, 1.0 included, Bulwark enables additional features that depend on Stalwart's JMAP `x:` methods:

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

One deployment can point at several JMAP servers, which is what you want if you shard accounts by domain. Add servers from the **Server** step of the setup wizard or the admin dashboard, or set `JMAP_SERVERS` to a JSON list for stateless deployments. With `JMAP_SERVER_AUTO_PICK_BY_DOMAIN=true` the login form picks the server from the domain of the address the user types; users can still pick manually. Bulwark Lite reads the same list from `jmapServers` in `config.json`.
