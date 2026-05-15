---
title: Configuration
description: Configure Bulwark for your environment.
order: 3
---

# Configuration

Bulwark has two configuration surfaces that work together:

1. The **web setup wizard** and **admin dashboard** (recommended for new installs since 1.6.4). The wizard runs on first launch when no `JMAP_SERVER_URL` is set in the environment, and writes JSON config to `ADMIN_CONFIG_DIR`. The admin dashboard manages the same config after setup.
2. **Environment variables** in `.env.local` (or your container's env). Still fully supported, and the right choice for immutable / read-only / env-as-code deployments.

When an environment variable is set, it takes precedence over the corresponding admin-managed value, so setting `JMAP_SERVER_URL` will hide that field from the wizard and lock it in the admin UI.

## Configuration Model

Bulwark supports three configuration layers:

- **Admin-managed config** - Written by the setup wizard or the admin dashboard to `data/admin/config.json` (or `ADMIN_CONFIG_DIR/config.json`). Changes take effect on the next user session without a restart.
- **Runtime environment variables** - Read by the server at request time. Override admin-managed values. Work well for Docker and reverse-proxy deployments.
- **Legacy build-time variables** - `NEXT_PUBLIC_*` fallbacks still supported for older deployments, but new setups should prefer the wizard or runtime variables.

The order of precedence is **env var > admin config > build-time fallback > built-in default**.

## Minimal Setup

For a basic deployment, only one variable is truly required:

```env
JMAP_SERVER_URL=https://mail.example.com
```

Most deployments also set a display name:

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
```

## Environment Variables

| Variable                      | Required        | Default                                   | Description                                                                                |
| ----------------------------- | --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `HOSTNAME`                    | No              | `0.0.0.0`                                 | Address the server binds to - use `::` for IPv6                                            |
| `PORT`                        | No              | `3000`                                    | Port the server listens on                                                                 |
| `APP_NAME`                    | No              | `Webmail`                                 | Application name shown in the UI, browser tab, and PWA manifest                            |
| `APP_SHORT_NAME`              | No              | falls back to `APP_NAME`                  | Short name for the PWA install prompt and home screen                                      |
| `APP_DESCRIPTION`             | No              | generic Bulwark description               | Description shown in the PWA manifest                                                      |
| `JMAP_SERVER_URL`             | Yes¹            | -                                         | URL of your JMAP-compatible mail server                                                    |
| `ALLOW_CUSTOM_JMAP_ENDPOINT`  | No              | `false`                                   | Show a "JMAP Server" field on the login form so users can specify their own server         |
| `STALWART_FEATURES`           | No              | `true`                                    | Enables Stalwart-specific features (password change, Sieve, vacation, admin, API keys)     |
| `OAUTH_ENABLED`               | No              | `false`                                   | Enables OAuth2 / OpenID Connect login                                                      |
| `OAUTH_ONLY`                  | No              | `false`                                   | Hides the username/password login form and requires OAuth                                  |
| `OAUTH_CLIENT_ID`             | OAuth only      | -                                         | OAuth client ID                                                                            |
| `OAUTH_CLIENT_SECRET`         | No              | empty                                     | OAuth client secret for confidential clients                                               |
| `OAUTH_CLIENT_SECRET_FILE`    | No              | empty                                     | Path to a file containing the OAuth client secret (Docker / Kubernetes secrets)            |
| `OAUTH_ISSUER_URL`            | No              | falls back to `JMAP_SERVER_URL` discovery | Explicit issuer URL for external IdPs                                                      |
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
| `BULWARK_TELEMETRY`           | No              | `on`                                      | Set to `off` to disable the anonymous daily heartbeat                                       |
| `BULWARK_TELEMETRY_URL`       | No              | `https://telemetry.bulwarkmail.org/...`   | Point at your own collector, or clear to disable                                            |
| `TELEMETRY_DATA_DIR`          | No              | `./data/telemetry`                        | Where the instance id and consent live; mount a volume to survive upgrades                   |
| `TRUSTED_PROXY_DEPTH`         | No              | `1`                                       | Number of `X-Forwarded-For` hops to trust                                                  |
| `EXTENSION_DIRECTORY_URL`     | No              | empty                                     | Marketplace URL for browsing and installing plugins/themes                                 |
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
| `NEXT_PUBLIC_LOCALE_PREFIX`   | No              | safe default                              | Locale URL prefix mode: `always`, `as-needed`, or `never`                                  |
| `NEXT_PUBLIC_BASE_PATH`       | Build-time      | empty                                     | Mount Bulwark under a subpath (e.g. `/webmail`) - read at build time by Next.js             |
| `AUTO_SSO_ENABLED`            | No              | `false`                                   | Automatically start OAuth flow on login page (for embedded SSO)                            |
| `ALLOWED_FRAME_ANCESTORS`     | No              | `'none'`                                  | CSP `frame-ancestors` value for iframe embedding                                           |
| `NEXT_PUBLIC_PARENT_ORIGIN`   | No              | empty                                     | Origin of parent frame for postMessage validation                                          |
| `STALWART_API_URL`            | Deprecated      | -                                         | Removed in 1.5.0; Stalwart 0.16+ self-service goes through JMAP                            |
| `NEXT_PUBLIC_APP_NAME`        | Legacy fallback | -                                         | Legacy build-time fallback for `APP_NAME`                                                  |
| `NEXT_PUBLIC_JMAP_SERVER_URL` | Legacy fallback | -                                         | Legacy build-time fallback for `JMAP_SERVER_URL`                                           |

¹ `JMAP_SERVER_URL` is required unless `ALLOW_CUSTOM_JMAP_ENDPOINT=true`, in which case users supply the URL on the login form.

## Full Reference

For a complete explanation of every setting from `.env.example`, including defaults, dependencies, and implementation notes, see [Environment Reference](/docs/getting-started/configuration/environment-reference).

## Notes on Integration

All variables currently listed in the app's `.env.example` are implemented in the current Bulwark codebase.

- Some are **feature-gated** rather than always active.
- Some are **optional branding or operational settings**.
- The `NEXT_PUBLIC_*` variables are **legacy fallbacks**, kept for compatibility with older build-time deployments.

## Stalwart Server Setup

Bulwark requires a Stalwart Mail Server with JMAP enabled. Make sure your Stalwart configuration includes:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "http"
```

### CORS Configuration

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

## Custom JMAP Server Endpoints

Bulwark supports configuring custom JMAP server endpoints directly from the login page and settings. This allows users to connect to different JMAP servers without modifying environment variables, useful for multi-server environments or testing.

## Theming

Bulwark supports light and dark themes out of the box. The theme preference is stored in the browser's local storage and respects the system preference by default.

To set a default theme, you can customize the CSS variables in your deployment. See the [Customization](/docs/guides/customization) page for details.
