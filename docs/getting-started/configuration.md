---
title: Configuration
description: Configure Bulwark for your environment.
order: 3
---

# Configuration

Bulwark is configured through runtime environment variables.

The current app reads configuration from `.env.local` at runtime. In production, the recommended starting point is the app's `.env.example`, copied to `.env.local` and then customized for your deployment.

## Configuration Model

Bulwark supports two configuration layers:

- **Runtime variables** — The preferred approach. These are read by the server at request time and work well for Docker and reverse-proxy deployments.
- **Legacy build-time variables** — Still supported as a fallback for older deployments, but new setups should prefer runtime variables.

Runtime variables take precedence when both are set.

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

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `APP_NAME` | No | `Webmail` fallback in app config | Application name shown in the UI |
| `JMAP_SERVER_URL` | Yes | — | URL of your JMAP-compatible mail server |
| `STALWART_FEATURES` | No | `true` | Enables Stalwart-specific account and management features |
| `STALWART_API_URL` | No | `JMAP_SERVER_URL` | Direct URL for Stalwart management API calls when your proxy does not forward admin paths |
| `OAUTH_ENABLED` | No | `false` | Enables OAuth2 / OpenID Connect login |
| `OAUTH_ONLY` | No | `false` | Hides the username/password login form and requires OAuth |
| `OAUTH_CLIENT_ID` | OAuth only | — | OAuth client ID |
| `OAUTH_CLIENT_SECRET` | No | empty | OAuth client secret for confidential clients |
| `OAUTH_ISSUER_URL` | No | falls back to `JMAP_SERVER_URL` discovery | Explicit issuer URL for external IdPs |
| `SESSION_SECRET` | Feature-gated | — | Enables encrypted persistent sessions and settings sync encryption |
| `SETTINGS_SYNC_ENABLED` | No | `false` | Enables encrypted server-side settings sync |
| `SETTINGS_DATA_DIR` | No | `./data/settings` | Directory used for encrypted settings storage |
| `LOG_FORMAT` | No | `text` | Log output format: `text` or `json` |
| `LOG_LEVEL` | No | `info` | Log verbosity: `error`, `warn`, `info`, or `debug` |
| `LOGIN_LOGO_LIGHT_URL` | No | Bulwark light logo | Login page logo for light backgrounds |
| `LOGIN_LOGO_DARK_URL` | No | Bulwark dark logo | Login page logo for dark backgrounds |
| `LOGIN_COMPANY_NAME` | No | empty | Company name shown on the login page |
| `LOGIN_IMPRINT_URL` | No | empty | Login page imprint / legal notice link |
| `LOGIN_PRIVACY_POLICY_URL` | No | empty | Login page privacy policy link |
| `LOGIN_WEBSITE_URL` | No | empty | Login page website link |
| `NEXT_PUBLIC_APP_NAME` | Legacy fallback | — | Legacy build-time fallback for `APP_NAME` |
| `NEXT_PUBLIC_JMAP_SERVER_URL` | Legacy fallback | — | Legacy build-time fallback for `JMAP_SERVER_URL` |

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
protocol = "jmap"
```

### CORS Configuration

If Bulwark and Stalwart are on different domains, configure CORS in Stalwart:

```toml
[server.http]
allowed-origins = ["https://your-bulwark-domain.com"]
```

## Authentication

Bulwark uses JMAP's built-in authentication. Users log in with their email credentials configured in Stalwart. Supported authentication methods:

- **Basic Auth** — Username and password
- **OAuth 2.0** — If configured in Stalwart

## Theming

Bulwark supports light and dark themes out of the box. The theme preference is stored in the browser's local storage and respects the system preference by default.

To set a default theme, you can customize the CSS variables in your deployment. See the [Customization](/docs/guides/customization) page for details.
