---
title: Environment Reference
description: Complete reference for every variable in Bulwark's .env.example.
order: 3
---

# Environment Reference

This page documents every setting currently present in Bulwark's `.env.example`.

All of the variables below are implemented in the current app. Some are always available, some only affect optional features, and some exist as compatibility fallbacks for older build-time deployments.

## Server Listen Address

### `HOSTNAME`

- **Purpose** - Sets the address the server binds to.
- **Required** - No.
- **Default** - `0.0.0.0`
- **When to set it** - Set to `::` to listen on IPv6 (dual-stack), or to a specific interface address to restrict access.

### `PORT`

- **Purpose** - Sets the port the server listens on.
- **Required** - No.
- **Default** - `3000`
- **When to set it** - Set this when you need the server to listen on a non-default port.

## Core Settings

### `APP_NAME`

- **Purpose** - Sets the application name displayed in the UI.
- **Required** - No.
- **Default behavior** - Falls back to a built-in app name when not set.
- **When to set it** - Set this if you want your deployment to be branded differently from the default Bulwark name.

### `JMAP_SERVER_URL`

- **Purpose** - Points Bulwark to your JMAP-compatible mail server.
- **Required** - Yes, unless you rely on the legacy `NEXT_PUBLIC_JMAP_SERVER_URL` fallback.
- **Example** - `https://mail.example.com`
- **When to set it** - Always for a normal runtime deployment.

## Stalwart Integration

### `STALWART_FEATURES`

- **Purpose** - Enables Stalwart-specific features such as password change, Sieve management, vacation responder controls, and similar account-management flows.
- **Required** - No.
- **Default** - Enabled unless explicitly set to `false`.
- **When to set it** - Set `STALWART_FEATURES=false` if you are using Bulwark with a non-Stalwart JMAP server and want to hide features that depend on Stalwart APIs.

### `STALWART_API_URL`

- **Purpose** - Overrides the URL used for Stalwart management API requests.
- **Required** - No.
- **Default** - Falls back to `JMAP_SERVER_URL`.
- **When to set it** - Use this when your reverse proxy forwards JMAP but does not expose Stalwart management paths such as `/api/account/*` or `/api/principal/*`.

## OAuth / OpenID Connect

### `OAUTH_ENABLED`

- **Purpose** - Turns on OAuth2 / OIDC login support.
- **Required** - No.
- **Default** - `false`
- **When to set it** - Set to `true` when your deployment should show an SSO login flow.

### `OAUTH_ONLY`

- **Purpose** - Makes OAuth the only login method and hides the username/password form.
- **Required** - No.
- **Dependency** - Requires `OAUTH_ENABLED=true`.
- **When to set it** - Use this when all users should authenticate through your identity provider only.

### `OAUTH_CLIENT_ID`

- **Purpose** - OAuth client ID registered with your identity provider.
- **Required** - Required when OAuth is enabled.
- **When to set it** - Always set this together with `OAUTH_ENABLED=true`.

### `OAUTH_CLIENT_SECRET`

- **Purpose** - OAuth client secret used for confidential clients.
- **Required** - No.
- **When to set it** - Only needed if your IdP registration expects a confidential client instead of a public PKCE-only client.

### `OAUTH_ISSUER_URL`

- **Purpose** - Explicit issuer URL used for OIDC discovery.
- **Required** - No.
- **Default behavior** - If omitted, Bulwark falls back to discovery through `JMAP_SERVER_URL`.
- **When to set it** - Set this when your mail server delegates auth to an external IdP such as Keycloak or Authentik.

## Session & Security

### `SESSION_SECRET`

- **Purpose** - Secret used to encrypt persistent "Remember me" sessions and settings sync data.
- **Required** - No for basic login, required for encrypted persistent sessions and settings sync.
- **When to set it** - Set this if you want users to keep signed in across browser restarts or if you enable settings sync.
- **Generation** - `openssl rand -base64 32`

## Settings Sync

### `SETTINGS_SYNC_ENABLED`

- **Purpose** - Enables encrypted server-side settings persistence.
- **Required** - No.
- **Dependency** - Requires `SESSION_SECRET`.
- **Default** - `false`
- **When to set it** - Set to `true` when you want settings to follow users across browsers and devices.

### `SETTINGS_DATA_DIR`

- **Purpose** - Filesystem location where encrypted settings files are stored.
- **Required** - No.
- **Default** - `./data/settings`
- **When to set it** - Set this when you want settings data stored on a specific persistent volume or host path.

## Logging

### `LOG_FORMAT`

- **Purpose** - Controls server log output format.
- **Allowed values** - `text`, `json`
- **Default** - `text`
- **When to set it** - Use `json` for structured log collection in platforms such as containers, centralized logging, or observability stacks.

### `LOG_LEVEL`

- **Purpose** - Controls server log verbosity.
- **Allowed values** - `error`, `warn`, `info`, `debug`
- **Default** - `info`
- **When to set it** - Increase to `debug` during troubleshooting; lower to `warn` or `error` in quieter production environments.

## Login Page Customization

### `LOGIN_LOGO_LIGHT_URL`

- **Purpose** - Logo shown on light backgrounds on the login page.
- **Required** - No.
- **Default** - Bulwark light logo.
- **Accepted values** - Absolute URL or path relative to `public/`.

### `LOGIN_LOGO_DARK_URL`

- **Purpose** - Logo shown on dark backgrounds on the login page.
- **Required** - No.
- **Default** - Bulwark dark logo.
- **Accepted values** - Absolute URL or path relative to `public/`.

### `LOGIN_COMPANY_NAME`

- **Purpose** - Company or organization name shown above the version on the login page.
- **Required** - No.
- **Default** - Empty.

### `LOGIN_IMPRINT_URL`

- **Purpose** - Adds an imprint / legal notice link to the login page.
- **Required** - No.
- **Default** - Empty.

### `LOGIN_PRIVACY_POLICY_URL`

- **Purpose** - Adds a privacy policy link to the login page.
- **Required** - No.
- **Default** - Empty.

### `LOGIN_WEBSITE_URL`

- **Purpose** - Adds a website link to the login page.
- **Required** - No.
- **Default** - Empty.

## Legacy Build-time Fallbacks

These variables still work, but they exist for compatibility with older deployments where values were baked into the frontend bundle at build time.

### `NEXT_PUBLIC_APP_NAME`

- **Purpose** - Legacy fallback for `APP_NAME`.
- **Required** - No.
- **When to use it** - Only if you still depend on build-time configuration.

### `NEXT_PUBLIC_JMAP_SERVER_URL`

- **Purpose** - Legacy fallback for `JMAP_SERVER_URL`.
- **Required** - No.
- **When to use it** - Only if you still depend on build-time configuration.

## Recommended Patterns

### Small self-hosted setup

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
```

### Stalwart with encrypted persistent sessions

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
SESSION_SECRET=replace-with-a-random-secret
```

### Stalwart with cross-device settings sync

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
SESSION_SECRET=replace-with-a-random-secret
SETTINGS_SYNC_ENABLED=true
SETTINGS_DATA_DIR=/data/settings
```

### OAuth-only deployment

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
OAUTH_ENABLED=true
OAUTH_ONLY=true
OAUTH_CLIENT_ID=webmail
OAUTH_ISSUER_URL=https://id.example.com/realms/mail
```

### Non-Stalwart JMAP server

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
STALWART_FEATURES=false
```

## Integration Status

At the time of writing, every variable listed in Bulwark's `.env.example` is integrated in the app.

- `APP_NAME` and `JMAP_SERVER_URL` are core runtime settings.
- OAuth variables are used by the auth and config API routes.
- `SESSION_SECRET`, `SETTINGS_SYNC_ENABLED`, and `SETTINGS_DATA_DIR` are used by encrypted session and settings-sync code paths.
- `STALWART_FEATURES` and `STALWART_API_URL` control Stalwart-specific behavior.
- `LOG_FORMAT` and `LOG_LEVEL` are used by the server logger.
- Login branding variables are exposed through the runtime config endpoint and used by the login page.
- `NEXT_PUBLIC_*` values remain as fallback support for older build-time setups.
