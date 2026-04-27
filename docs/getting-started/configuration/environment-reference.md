---
title: Environment Reference
description: Complete reference for every variable in Bulwark's .env.example.
order: 3
---

# Environment Reference

This page documents every setting currently present in Bulwark's `.env.example` and a handful of additional advanced variables read by the app.

All variables are evaluated at runtime, so Docker deployments can be reconfigured without rebuilding. Some are always available, some only affect optional features, and a few exist as compatibility fallbacks for older build-time deployments.

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

- **Purpose** - Sets the application name displayed in the UI, browser tab title, and PWA manifest.
- **Required** - No.
- **Default** - `Webmail` (built-in fallback when not set).
- **When to set it** - Set this if you want your deployment to be branded differently from the default Bulwark name.

### `APP_SHORT_NAME`

- **Purpose** - Short name for the app, used where space is limited (home screen label on mobile, PWA install prompt).
- **Required** - No.
- **Default** - Falls back to `APP_NAME` if not set.

### `APP_DESCRIPTION`

- **Purpose** - Description shown in the PWA manifest (displayed by the OS during install).
- **Required** - No.
- **Default** - Generic Bulwark description.

### `JMAP_SERVER_URL`

- **Purpose** - Points Bulwark to your JMAP-compatible mail server.
- **Required** - Yes, unless `ALLOW_CUSTOM_JMAP_ENDPOINT=true` (in which case users supply the URL on the login form) or you rely on the legacy `NEXT_PUBLIC_JMAP_SERVER_URL` fallback.
- **Example** - `https://mail.example.com`
- **When to set it** - Always for a normal runtime deployment.

### `ALLOW_CUSTOM_JMAP_ENDPOINT`

- **Purpose** - Shows a "JMAP Server" field on the login form so users can connect to any JMAP-compatible server.
- **Required** - No.
- **Default** - `false`
- **CORS note** - External JMAP servers must include the webmail origin in their `Access-Control-Allow-Origin` response header, or browser requests will be blocked.
- **When to set it** - Set to `true` for multi-tenant deployments or testing setups where users connect to different servers.

## Stalwart Integration

### `STALWART_FEATURES`

- **Purpose** - Enables Stalwart-specific features such as password change, Sieve management, vacation responder controls, account security, API keys, and the admin dashboard.
- **Required** - No.
- **Default** - `true` unless explicitly set to `false`.
- **When to set it** - Set `STALWART_FEATURES=false` if you are using Bulwark with a non-Stalwart JMAP server and want to hide features that depend on Stalwart-specific JMAP `x:` methods.

### `STALWART_API_URL` *(deprecated in 1.5.0)*

- **Status** - Deprecated. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP. Bulwark now talks to the JMAP endpoint exclusively, so this variable has no effect.
- **Migration** - Remove from your `.env.local`. The self-service portal (account settings, app passwords, API keys) requires Stalwart 0.16 or newer.

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

### `OAUTH_CLIENT_SECRET_FILE`

- **Purpose** - Path to a file containing the OAuth client secret.
- **Required** - No.
- **When to set it** - Use this with Docker secrets, Kubernetes secrets, or any platform that mounts secrets as files. If both `OAUTH_CLIENT_SECRET` and `OAUTH_CLIENT_SECRET_FILE` are set, the env var takes precedence.

### `OAUTH_ISSUER_URL`

- **Purpose** - Explicit issuer URL used for OIDC discovery.
- **Required** - No.
- **Default behavior** - If omitted, Bulwark falls back to discovery through `JMAP_SERVER_URL`.
- **When to set it** - Set this when your mail server delegates auth to an external IdP such as Keycloak or Authentik.

### `OAUTH_SCOPES`

- **Purpose** - Override the OAuth scope string requested at the authorization endpoint.
- **Required** - No.
- **Default** - Built-in default scopes appropriate for JMAP and OIDC.
- **When to set it** - Only when your IdP requires a specific scope set.

### `OAUTH_EXTRA_SCOPES`

- **Purpose** - Append extra scopes to the default scope set without replacing it.
- **Required** - No.
- **Default** - Empty.
- **When to set it** - When you need to add provider-specific scopes (e.g., a custom audience scope) on top of the defaults.

## Session & Security

### `SESSION_SECRET`

- **Purpose** - Secret used to encrypt persistent "Remember me" sessions, settings sync data, multi-account state, and server-side OAuth PKCE state.
- **Required** - Optional for basic login. Required for: encrypted persistent sessions, settings sync, multi-account support, and embedded SSO.
- **Generation** - `openssl rand -base64 32`
- **Validation** - Strict minimum length is enforced.

### `SESSION_SECRET_FILE`

- **Purpose** - Path to a file containing the session secret.
- **Required** - No.
- **When to set it** - Use with Docker secrets or Kubernetes secrets. `SESSION_SECRET` takes precedence if both are set.

### `COOKIE_SAME_SITE`

- **Purpose** - Sets the `SameSite` attribute on session cookies.
- **Allowed values** - `lax`, `none`, `strict`
- **Default** - `lax`
- **When to set it** - Set to `none` when Bulwark is embedded cross-origin in an iframe. Requires HTTPS.

### `COOKIE_SECURE`

- **Purpose** - Force cookies to be marked as `Secure`.
- **Required** - No.
- **Default** - `true` when `COOKIE_SAME_SITE=none` or `NODE_ENV=production`, otherwise `false`.
- **When to set it** - Override when reverse-proxying terminates TLS in front of an `http://` Bulwark and you need explicit control.

## Settings Sync

### `SETTINGS_SYNC_ENABLED`

- **Purpose** - Enables encrypted server-side settings persistence across devices and accounts.
- **Required** - No.
- **Dependency** - Requires `SESSION_SECRET`.
- **Default** - `false`
- **When to set it** - Set to `true` when you want settings to follow users across browsers, devices, and accounts.

### `SETTINGS_DATA_DIR`

- **Purpose** - Filesystem location where encrypted settings files are stored.
- **Required** - No.
- **Default** - `./data/settings` (resolves to `/app/data/settings` in Docker, since `WORKDIR` is `/app`)
- **When to set it** - Set this when you want settings data stored on a specific persistent volume or host path.
- **Docker note** - Mount a persistent volume at `/app/data/settings` (or at whatever absolute path you configure) so that settings survive container restarts:
  ```yaml
  volumes:
    - bulwark-settings:/app/data/settings
  ```

## Admin Dashboard

### `ADMIN_PASSWORD`

- **Purpose** - Sets the initial admin password for the local admin dashboard. The dashboard manages plugins, themes, runtime config overrides, and policy.
- **Required** - No.
- **Default** - On first startup with no password set, a random password is generated and logged to stdout.
- **When to set it** - Set this in production so you have a known password and so it survives restarts.

### `ADMIN_DATA_DIR`

- **Purpose** - Directory for admin data (config overrides, plugin registry, plugin configs, audit log, password hash).
- **Required** - No.
- **Default** - `./data/admin` (resolves to `/app/data/admin` in Docker).
- **Docker note** - Mount a persistent volume to keep admin state across container restarts:
  ```yaml
  volumes:
    - bulwark-admin:/app/data/admin
  ```

### `ADMIN_SESSION_TTL`

- **Purpose** - Admin session lifetime in seconds.
- **Required** - No.
- **Default** - Built-in safe default.

### `TRUSTED_PROXY_DEPTH`

- **Purpose** - Number of `X-Forwarded-For` hops to trust when resolving the client IP for admin sessions and audit logs.
- **Required** - No.
- **Default** - `1`
- **When to set it** - Increase if Bulwark sits behind multiple reverse proxies (e.g., CDN -> ingress -> app).

## Extension Directory / Marketplace

### `EXTENSION_DIRECTORY_URL`

- **Purpose** - URL of the BulwarkMail extension directory used by the admin marketplace for browsing and installing plugins and themes.
- **Required** - No.
- **Default** - Empty (marketplace disabled).
- **Example** - `https://extensions.bulwarkmail.org`
- **When to set it** - Set this to enable the marketplace browse-and-install UI in the admin dashboard.

## Logging

### `LOG_FORMAT`

- **Purpose** - Controls server log output format.
- **Allowed values** - `text` (colored, human-readable), `json` (structured)
- **Default** - `text`
- **When to set it** - Use `json` for centralized log aggregation in containers and observability stacks.

### `LOG_LEVEL`

- **Purpose** - Controls server log verbosity.
- **Allowed values** - `error`, `warn`, `info`, `debug`
- **Default** - `info`
- **When to set it** - Increase to `debug` during troubleshooting; lower to `warn` or `error` in quieter production environments.

## Branding — Icons & Favicon

### `FAVICON_URL`

- **Purpose** - Custom favicon shown in the browser tab.
- **Required** - No.
- **Default** - Bulwark favicon (`/branding/Bulwark_Favicon.svg`).
- **Accepted values** - Absolute URL or path relative to `public/`.
- **Supported formats** - SVG (recommended), PNG, ICO.
- **Recommended size** - 32×32px minimum, 512×512px maximum. SVG is preferred for crisp scaling.

### `PWA_ICON_URL`

- **Purpose** - Source image used to auto-generate the PWA install icons (192×192 and 512×512 PNG, plus maskable variants).
- **Required** - No.
- **Default** - Falls back to `FAVICON_URL`, then to the default Bulwark icons.
- **Accepted values** - Absolute URL or path relative to `public/`.
- **Supported formats** - SVG (recommended for best quality) or PNG (≥512×512px recommended).

### `PWA_THEME_COLOR`

- **Purpose** - Color applied to the browser UI chrome when the app is installed as a PWA (address bar, Android status bar).
- **Required** - No.
- **Default** - `#ffffff`
- **Example** - `#3b82f6`

### `PWA_BACKGROUND_COLOR`

- **Purpose** - Background color shown on the PWA splash screen while the app is loading.
- **Required** - No.
- **Default** - `#ffffff`
- **When to set it** - Match your app's main background color.

## Branding — Logos

### `APP_LOGO_LIGHT_URL`

- **Purpose** - Logo shown in the sidebar on light backgrounds (main app, after login).
- **Required** - No.
- **Default** - Empty (no sidebar logo).
- **Accepted values** - Absolute URL or path relative to `public/`.
- **Supported formats** - SVG (recommended), PNG, WebP.
- **Recommended size** - 24×24px minimum, 128×128px maximum. Displayed at 24×24px.

### `APP_LOGO_DARK_URL`

- **Purpose** - Logo shown in the sidebar on dark backgrounds (main app, after login).
- **Required** - No.
- **Default** - Empty (falls back to `APP_LOGO_LIGHT_URL` if set, otherwise no logo).

## Login Page Customization

### `LOGIN_LOGO_LIGHT_URL`

- **Purpose** - Logo shown on light backgrounds on the login page.
- **Required** - No.
- **Default** - Bulwark light logo.
- **Recommended size** - 32×32px minimum, 512×512px maximum. Displayed at 64×64px.

### `LOGIN_LOGO_DARK_URL`

- **Purpose** - Logo shown on dark backgrounds on the login page.
- **Required** - No.
- **Default** - Bulwark dark logo.

### `LOGIN_COMPANY_NAME`

- **Purpose** - Company or organization name shown above the version on the login page.

### `LOGIN_IMPRINT_URL`

- **Purpose** - Adds an imprint / legal notice link to the login page.

### `LOGIN_PRIVACY_POLICY_URL`

- **Purpose** - Adds a privacy policy link to the login page.

### `LOGIN_WEBSITE_URL`

- **Purpose** - Adds a website link to the login page.

## Internationalization

### `NEXT_PUBLIC_LOCALE_PREFIX`

- **Purpose** - Controls how the locale appears in URLs (e.g., `/en/inbox` vs `/inbox`).
- **Allowed values** - `always` (always prefix), `as-needed` (only for non-default locales), `never` (never prefix).
- **Default** - Built-in safe default.
- **When to set it** - Match the routing strategy you want for SEO, redirects from older deployments, or middleware compatibility.

## Embedded SSO & iframe

### `AUTO_SSO_ENABLED`

- **Purpose** - Automatically start the OAuth flow on the login page without user interaction.
- **Required** - No.
- **Default** - `false`
- **Dependency** - Requires `OAUTH_ENABLED=true` and `OAUTH_ONLY=true`.
- **When to set it** - Set to `true` when embedding Bulwark in an iframe with automatic SSO managed by a parent portal.

### `ALLOWED_FRAME_ANCESTORS`

- **Purpose** - Sets the CSP `frame-ancestors` directive to allow embedding in an iframe.
- **Required** - No.
- **Default** - `'none'` (iframe embedding disabled).
- **When to set it** - Set to the origin of the parent portal (e.g., `https://portal.example.com`).

### `NEXT_PUBLIC_PARENT_ORIGIN`

- **Purpose** - Origin of the parent frame for validating incoming `postMessage` events.
- **Required** - No.
- **Default** - Empty (accepts messages from any origin).
- **When to set it** - Set to the origin of the parent portal for security when using the postMessage bridge.

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

### Multi-account with extension marketplace

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
SESSION_SECRET=replace-with-a-random-secret
SETTINGS_SYNC_ENABLED=true
EXTENSION_DIRECTORY_URL=https://extensions.bulwarkmail.org
ADMIN_PASSWORD=replace-with-a-strong-admin-password
```

### Custom PWA branding

```env
APP_NAME=Acme Mail
APP_SHORT_NAME=Acme
APP_DESCRIPTION=Acme Corporation webmail
JMAP_SERVER_URL=https://mail.acme.com
FAVICON_URL=/branding/acme-favicon.svg
PWA_ICON_URL=/branding/acme-icon.svg
PWA_THEME_COLOR=#0f172a
PWA_BACKGROUND_COLOR=#ffffff
APP_LOGO_LIGHT_URL=/branding/acme-logo-color.svg
APP_LOGO_DARK_URL=/branding/acme-logo-white.svg
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

### Embedded SSO in an iframe

```env
APP_NAME=Bulwark Webmail
JMAP_SERVER_URL=https://mail.example.com
OAUTH_ENABLED=true
OAUTH_ONLY=true
OAUTH_CLIENT_ID=webmail
OAUTH_ISSUER_URL=https://auth.example.com
SESSION_SECRET=replace-with-a-random-secret
AUTO_SSO_ENABLED=true
ALLOWED_FRAME_ANCESTORS=https://portal.example.com
COOKIE_SAME_SITE=none
NEXT_PUBLIC_PARENT_ORIGIN=https://portal.example.com
```

### Behind multiple reverse proxies

```env
JMAP_SERVER_URL=https://mail.example.com
SESSION_SECRET=replace-with-a-random-secret
TRUSTED_PROXY_DEPTH=2
```

## Using `*_FILE` Variables With Docker Secrets

Several variables that hold secrets accept a corresponding `*_FILE` variant pointing at a file containing the value. This is the recommended pattern when running under Docker Swarm, Kubernetes, or any orchestration platform that mounts secrets as files:

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      JMAP_SERVER_URL: https://mail.example.com
      SESSION_SECRET_FILE: /run/secrets/session_secret
      OAUTH_CLIENT_SECRET_FILE: /run/secrets/oauth_secret
    secrets:
      - session_secret
      - oauth_secret

secrets:
  session_secret:
    external: true
  oauth_secret:
    external: true
```

If both the env var (e.g., `SESSION_SECRET`) and the `_FILE` variant (e.g., `SESSION_SECRET_FILE`) are set, the env var takes precedence.
