---
title: Configuration
description: Configure Bulwark for your environment.
order: 3
---

# Configuration

Bulwark has two configuration surfaces that work together:

1. The **web setup wizard** and **admin dashboard**, which is what new installs should use. The wizard runs on first launch when no `JMAP_SERVER_URL` is set in the environment and writes JSON config to `ADMIN_CONFIG_DIR`. The admin dashboard manages the same file afterwards.
2. **Environment variables** in `.env.local` (or your container's env). Still fully supported, and the right choice for immutable / read-only / env-as-code deployments.

When an environment variable is set, it takes precedence over the corresponding admin-managed value, so setting `JMAP_SERVER_URL` will hide that field from the wizard and lock it in the admin UI.

## Configuration model

Bulwark supports three configuration layers:

- **Admin-managed config** - Written by the setup wizard or the admin dashboard to `data/admin/config.json` (or `ADMIN_CONFIG_DIR/config.json`). Changes take effect on the next user session without a restart.
- **Runtime environment variables** - Read by the server at request time. Override admin-managed values. Work well for Docker and reverse-proxy deployments.
- **Legacy build-time variables** - `NEXT_PUBLIC_*` fallbacks still supported for older deployments, but new setups should prefer the wizard or runtime variables.

The order of precedence is **env var > admin config > build-time fallback > built-in default**.

## Minimal setup

A basic deployment needs one variable:

```env
JMAP_SERVER_URL=https://mail.example.com
```

Most deployments also set a display name:

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
```

## Environment variables

| Variable                      | Required        | Default                                   | Description                                                                                |
| ----------------------------- | --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `HOSTNAME`                    | No              | `0.0.0.0`                                 | Address the server binds to - use `::` for IPv6                                            |
| `PORT`                        | No              | `3000`                                    | Port the server listens on                                                                 |
| `APP_NAME`                    | No              | `Webmail`                                 | Application name shown in the UI, browser tab, and PWA manifest                            |
| `APP_SHORT_NAME`              | No              | falls back to `APP_NAME`                  | Short name for the PWA install prompt and home screen                                      |
| `APP_DESCRIPTION`             | No              | generic Bulwark description               | Description shown in the PWA manifest                                                      |
| `JMAP_SERVER_URL`             | Yes¹            | -                                         | URL of your JMAP-compatible mail server                                                    |
| `JMAP_SERVERS`                | No              | empty                                     | JSON array of servers to offer on the login form (`id`, `label`, `url`, optional `domains` and `oauth`) |
| `JMAP_SERVER_AUTO_PICK_BY_DOMAIN` | No          | `false`                                   | Pick a server from `JMAP_SERVERS` by the domain the user types                             |
| `ALLOW_CUSTOM_JMAP_ENDPOINT`  | No              | `false`                                   | Show a "JMAP Server" field on the login form so users can specify their own server         |
| `STALWART_FEATURES`           | No              | `true`                                    | Enables Stalwart-specific features (password change, Sieve, vacation, admin, API keys)     |
| `OAUTH_ENABLED`               | No              | `false`                                   | Enables OAuth2 / OpenID Connect login                                                      |
| `OAUTH_ONLY`                  | No              | `false`                                   | Hides the username/password login form and requires OAuth                                  |
| `OAUTH_CLIENT_ID`             | OAuth only      | -                                         | OAuth client ID                                                                            |
| `OAUTH_CLIENT_SECRET`         | No              | empty                                     | OAuth client secret for confidential clients                                               |
| `OAUTH_CLIENT_SECRET_FILE`    | No              | empty                                     | Path to a file containing the OAuth client secret (Docker / Kubernetes secrets)            |
| `OAUTH_ISSUER_URL`            | No              | falls back to `JMAP_SERVER_URL` discovery | Explicit issuer URL for external IdPs                                                      |
| `OAUTH_AUTHORIZE_URL`         | No              | from discovery                            | Override only the user-facing authorize endpoint (per-brand login hosts)                   |
| `OAUTH_ALLOW_PRIVATE_ENDPOINTS` | No            | `false`                                   | Let OAuth discovery resolve to RFC 1918 / loopback addresses (split-DNS setups)            |
| `OAUTH_SCOPES`                | No              | built-in default                          | Override OAuth scope string                                                                |
| `OAUTH_EXTRA_SCOPES`          | No              | empty                                     | Additional scopes appended to defaults                                                     |
| `SESSION_SECRET`              | Feature-gated   | -                                         | Enables encrypted Remember-me, settings sync, multi-account, and embedded SSO              |
| `SESSION_SECRET_FILE`         | No              | empty                                     | Path to a file containing the session secret                                               |
| `COOKIE_SAME_SITE`            | No              | `lax`                                     | Cookie `SameSite` attribute (`lax`, `none`, `strict`)                                      |
| `COOKIE_SECURE`               | No              | derived from env                          | Force `Secure` flag on cookies                                                             |
| `SETTINGS_SYNC_ENABLED`       | No              | `false`                                   | Enables encrypted server-side settings sync across devices and accounts                    |
| `SETTINGS_DATA_DIR`           | No              | `./data/settings`                         | Directory for encrypted settings storage (resolves to `/app/data/settings` in Docker)      |
| `ADMIN_PASSWORD`              | No              | set via wizard or random on first start   | Initial admin dashboard password (overrides whatever the wizard wrote)                     |
| `ADMIN_CONFIG_DIR`            | No              | `./data/admin`                            | Operator-authored: `config.json`, `policy.json`, `admin.json` (passwordHash), plugins, themes, branding uploads. Safe to mount read-only after setup |
| `ADMIN_STATE_DIR`             | No              | `./data/admin-state`                      | Runtime: `admin-state.json` (login timestamps), `audit.log`, setup token. Always read-write |
| `ADMIN_CONFIG_READONLY`       | No              | `false`                                   | Enforce read-only mode at the app layer (pair with `:ro` mount of the config volume)        |
| `ADMIN_DATA_DIR`              | No              | -                                         | Legacy single dir used by pre-1.6.4 installs. Honoured when neither split var is set        |
| `ADMIN_SESSION_TTL`           | No              | safe default                              | Admin session lifetime in seconds                                                          |
| `BULWARK_TELEMETRY`           | No              | `off`                                     | Set to `on` to enable the anonymous daily heartbeat. Setting it either way locks the admin toggle |
| `BULWARK_TELEMETRY_URL`       | No              | `https://telemetry.bulwarkmail.org/...`   | Point at your own collector, or clear to disable                                            |
| `TELEMETRY_DATA_DIR`          | No              | `./data/telemetry`                        | Where the instance id and consent live; mount a volume to survive upgrades                   |
| `BULWARK_UPDATE_CHECK`        | No              | `on`                                      | Set to `off` to stop the startup release check and the in-app update notice                 |
| `BULWARK_UPDATE_CHECK_URL`    | No              | project release feed                      | Point the check at your own feed; an empty value disables it                                |
| `VERSION_CHECK_DATA_DIR`      | No              | `./data/version-check`                    | Where the update check stores its state                                                     |
| `TRUSTED_PROXY_DEPTH`         | No              | `1`                                       | Number of `X-Forwarded-For` hops to trust                                                  |
| `SEARCH_ENGINE_INDEXING`      | No              | `false`                                   | Allow search engines to index the app; off emits `noindex`/`nofollow`                      |
| `EXTENSION_DIRECTORY_URL`     | No              | `https://extensions.bulwarkmail.org`      | Marketplace URL for browsing and installing plugins/themes; clear it to hide the marketplace |
| `DEMO_MODE`                   | No              | `false`                                   | Serve fixture data instead of talking to a mail server                                      |
| `PLUGIN_DEV_DIR`              | No              | empty                                     | Load plugins from a source folder with hot reload during development                        |
| `LOG_FORMAT`                  | No              | `text`                                    | Log output format: `text` or `json`                                                        |
| `LOG_LEVEL`                   | No              | `info`                                    | Log verbosity: `error`, `warn`, `info`, or `debug`                                         |
| `FAVICON_URL`                 | No              | Bulwark favicon                           | Custom browser tab favicon (SVG, PNG, or ICO; 32-512px)                                    |
| `PWA_ICON_URL`                | No              | falls back to `FAVICON_URL`               | Source image used to generate PWA install icons                                            |
| `PWA_THEME_COLOR`             | No              | `#ffffff`                                 | PWA browser UI chrome color                                                                |
| `PWA_BACKGROUND_COLOR`        | No              | `#ffffff`                                 | PWA splash screen background                                                               |
| `APP_LOGO_LIGHT_URL`          | No              | empty                                     | Sidebar logo for light mode (SVG, PNG, or WebP; 24-128px)                                  |
| `APP_LOGO_DARK_URL`           | No              | empty                                     | Sidebar logo for dark mode (SVG, PNG, or WebP; 24-128px)                                   |
| `LOGIN_LOGO_LIGHT_URL`        | No              | Bulwark light logo                        | Login page logo for light backgrounds (SVG, PNG, or WebP; 32-512px)                        |
| `LOGIN_LOGO_DARK_URL`         | No              | Bulwark dark logo                         | Login page logo for dark backgrounds (SVG, PNG, or WebP; 32-512px)                         |
| `LOGIN_COMPANY_NAME`          | No              | empty                                     | Company name shown on the login page                                                       |
| `LOGIN_IMPRINT_URL`           | No              | empty                                     | Login page imprint / legal notice link                                                     |
| `LOGIN_PRIVACY_POLICY_URL`    | No              | empty                                     | Login page privacy policy link                                                             |
| `LOGIN_WEBSITE_URL`           | No              | empty                                     | Login page website link                                                                    |
| `LOGIN_LOGO_MAX_HEIGHT` / `_WIDTH` | No         | natural size                              | Cap the rendered login logo; any CSS length                                                |
| `LOGIN_SHOW_HEADING` / `_SUBTITLE` / `_TOTP` / `_VERSION` | No | `true`             | Hide individual login page elements                                                        |
| `DOMAIN_BRANDING`             | No              | empty                                     | JSON array of per-hostname branding overrides, matched on `Host`; `*.` wildcards allowed   |
| `NEXT_PUBLIC_DEFAULT_LOCALE`  | Build-time      | `en`                                      | Fallback UI locale when `Accept-Language` matches nothing supported                        |
| `NEXT_PUBLIC_LOCALE_PREFIX`   | Build-time      | `never`                                   | Locale URL prefix mode: `always`, `as-needed`, or `never`                                  |
| `NEXT_PUBLIC_BASE_PATH`       | Build-time      | empty                                     | Mount Bulwark under a subpath (e.g. `/webmail`) - read at build time by Next.js             |
| `NEXT_PUBLIC_PUSH_RELAY_URL`  | Build-time      | `https://notifications.relay.bulwarkmail.org` | Push relay used for web push; point at your own to avoid the hosted one                |
| `AUTO_SSO_ENABLED`            | No              | `false`                                   | Automatically start OAuth flow on login page (for embedded SSO)                            |
| `ALLOWED_FRAME_ANCESTORS`     | No              | `'none'`                                  | CSP `frame-ancestors` value for iframe embedding                                           |
| `NEXT_PUBLIC_PARENT_ORIGIN`   | No              | empty                                     | Origin of parent frame for postMessage validation                                          |
| `BULWARK_JWT_AUTH_SECRET`     | No              | empty                                     | HS256 key enabling [master-user impersonation](/docs/guides/impersonation); the route 404s while unset |
| `BULWARK_STALWART_MASTER_USER` / `_PASSWORD` | No | empty                                    | Stalwart `Admin`-role account used for impersonation                                       |
| `LIBRETRANSLATE_URL` / `_API_KEY` | No          | public MyMemory API                       | Point `/api/translate` at a LibreTranslate instance you control                            |
| `STALWART_VERSION`            | No              | probed from the `Server` header           | Report a fixed Stalwart version when a proxy strips that header                            |
| `NEXT_PUBLIC_APP_NAME`        | Legacy fallback | -                                         | Legacy build-time fallback for `APP_NAME`                                                  |
| `NEXT_PUBLIC_JMAP_SERVER_URL` | Legacy fallback | -                                         | Legacy build-time fallback for `JMAP_SERVER_URL`                                           |

¹ `JMAP_SERVER_URL` is required unless `ALLOW_CUSTOM_JMAP_ENDPOINT=true`, in which case users supply the URL on the login form.

## Full reference

The table above is the short version. Every setting in `.env.example` is written up individually, with defaults, dependencies, and the reasoning behind each one, on the [environment reference](/docs/getting-started/configuration/environment-reference) page.

`STALWART_API_URL` is the one variable you may still find in old guides. Stalwart 0.16 dropped the REST self-service API it pointed at, Bulwark stopped reading it in 1.5.0, and it has since been removed from `.env.example` entirely. Delete it from your config.

## Stalwart server setup

Bulwark requires a Stalwart Mail Server with JMAP enabled. Make sure your Stalwart configuration includes:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "http"
```

### CORS configuration

If Bulwark and Stalwart are on different domains, configure CORS in Stalwart:

```toml
[server.http]
permissive-cors = true
```

## Authentication

Bulwark uses JMAP's built-in authentication. Users log in with their email credentials configured in Stalwart. Supported authentication methods:

- **Basic Auth** - Username and password
- **OAuth 2.0** - If configured in Stalwart
- **OAuth App Passwords** - For environments using OAuth as primary auth

## Custom JMAP server endpoints

Users can enter a JMAP server URL on the login page and in settings, so they can connect to a different server without an environment variable change. This is useful for multi-server deployments and for testing.

## Theming

Light and dark themes both ship with Bulwark. The preference is stored in the browser's local storage and follows the system setting by default.

To set a default theme, you can customize the CSS variables in your deployment. See the [Customization](/docs/guides/customization) page for details.
