---
title: Environment reference
description: Every variable in Bulwark's .env.example, with defaults and when to set it.
order: 3
edition: full
---

# Environment reference

Every setting in Bulwark's `.env.example`, plus a few advanced variables the app reads but doesn't advertise there. Order and grouping follow the code's config map (`lib/admin/types.ts`) rather than the example file, so a variable you find in one is in the other.

Nearly all variables are evaluated at runtime, so Docker deployments can be reconfigured without rebuilding. Some are always available, some only affect optional features, and a few exist as compatibility fallbacks for older build-time deployments. The exceptions are the `NEXT_PUBLIC_*` variables, which Next.js bakes into the bundle at build time: `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_LOCALE_PREFIX`, `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_PUSH_RELAY_URL` and `NEXT_PUBLIC_PARENT_ORIGIN`. To change one of those with the published Docker image, build your own with the matching `--build-arg`.

<div class="lite-callout">None of this applies to Bulwark Lite, which has no server to read an environment. Lite is configured by the <code>LITE_*</code> build inputs and the shipped <code>config.json</code>; both are on the <a href="/docs/deployment/static">static hosting</a> page.</div>

> **First-launch tip**
> Most new installs no longer need to set environment variables by hand - launch the container without `JMAP_SERVER_URL` and the [web setup wizard](/docs/getting-started/installation#quickest-path-docker--setup-wizard) writes the equivalent values to `ADMIN_CONFIG_DIR`. Use env vars when you want env-driven, immutable, or read-only configuration.

## Server listen address

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

## Core settings

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

- **Purpose** - Points Bulwark to your JMAP-compatible mail server. Setting this also disables the first-launch setup wizard.
- **Required** - No - the setup wizard can write this value to admin config instead. Required only when you want env-driven configuration, when `ALLOW_CUSTOM_JMAP_ENDPOINT=true` is not set, or when you rely on the legacy `NEXT_PUBLIC_JMAP_SERVER_URL` fallback.
- **Example** - `https://mail.example.com`
- **When to set it** - For env-driven deployments. A server URL already saved by the wizard or the dashboard takes priority over this variable. For several servers, see `JMAP_SERVERS` below.

### `ALLOW_CUSTOM_JMAP_ENDPOINT`

- **Purpose** - Shows a "JMAP Server" field on the login form so users can connect to any JMAP-compatible server.
- **Required** - No.
- **Default** - `false`
- **CORS note** - External JMAP servers must include the webmail origin in their `Access-Control-Allow-Origin` response header, or browser requests will be blocked.
- **When to set it** - Set to `true` for multi-tenant deployments or testing setups where users connect to different servers.

### `JMAP_SERVERS`

- **Purpose** - Offers a fixed list of JMAP servers on the login form instead of a free-text field.
- **Required** - No.
- **Default** - Empty.
- **Format** - A JSON array. Each entry needs `id`, `label` and `url`, and may carry `domains` (a list of email domains it serves) and its own `oauth` block.
- **Example** - `[{"id":"eu","label":"Europe","url":"https://eu.example.com","domains":["example.com"]},{"id":"us","label":"US","url":"https://us.example.com"}]`
- **When to set it** - Deployments sharded across servers, and stateless installs that can't use the admin dashboard, which manages the same list.

### `JMAP_SERVER_AUTO_PICK_BY_DOMAIN`

- **Purpose** - Picks the server from `JMAP_SERVERS` whose `domains` list contains the domain of the address the user types.
- **Required** - No.
- **Default** - `false`
- **When to set it** - With `JMAP_SERVERS`, when every account's domain maps to exactly one server.

## Stalwart integration

### `STALWART_FEATURES`

- **Purpose** - Enables Stalwart-specific features such as password change, Sieve management, vacation responder controls, account security, API keys, and the admin dashboard.
- **Required** - No.
- **Default** - `true` unless explicitly set to `false`.
- **When to set it** - Set `STALWART_FEATURES=false` if you are using Bulwark with a non-Stalwart JMAP server and want to hide features that depend on Stalwart-specific JMAP `x:` methods.

### `STALWART_JMAP_PASSTHROUGH_ENABLED`

- **Purpose** - Server-side switch for the credential-bearing passthrough route that Stalwart-specific features use to reach the mail server through Bulwark.
- **Required** - No.
- **Default** - `true`
- **When to set it** - Set to `false` to keep the client-side Stalwart features but block the passthrough entirely. Independent of `STALWART_FEATURES`; also editable in the admin dashboard.

### `STALWART_VERSION`

- **Purpose** - Report a fixed Stalwart version in the telemetry heartbeat instead of probing the JMAP server's `Server` response header.
- **Required** - No.
- **When to set it** - When a proxy in front of Stalwart strips that header.

### `STALWART_API_URL` _(deprecated in 1.5.0)_

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

### `OAUTH_AUTHORIZE_URL`

- **Purpose** - Overrides only the user-facing authorize endpoint. Discovery, token exchange and refresh keep using `OAUTH_ISSUER_URL`.
- **Required** - No.
- **Default** - The `authorization_endpoint` from discovery.
- **When to set it** - A per-brand login host in front of a single canonical issuer.

### `OAUTH_ALLOW_PRIVATE_ENDPOINTS`

- **Purpose** - Lets OAuth discovery resolve to private (RFC 1918) or loopback addresses.
- **Required** - No.
- **Default** - `false`, as an SSRF guard.
- **When to set it** - Split-DNS deployments where the issuer's public hostname resolves to an internal IP from the Bulwark container.

### `OAUTH_END_SESSION`

- **Purpose** - Signing out of an SSO account also signs out of the identity provider, through the `end_session_endpoint` it advertises.
- **Required** - No.
- **Default** - `true`.
- **When to set it** - Set to `false` when the provider is shared with other apps that should stay signed in after a Bulwark sign-out.

### `OAUTH_POST_LOGOUT_REDIRECT_URI`

- **Purpose** - Where the identity provider sends the browser after signing the user out.
- **Required** - No.
- **Default** - None. The provider shows its own signed-out page.
- **When to set it** - To bring users back to Bulwark, for example `https://mail.example.com/en/login`. Register the same URI with the provider as a post-logout redirect URI first, or the provider refuses the logout.

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

## Session and security

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

## Settings sync

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

## Admin dashboard

### `ADMIN_PASSWORD`

- **Purpose** - Sets the initial admin password for the local admin dashboard. The dashboard manages plugins, themes, runtime config overrides, and policy.
- **Required** - No - the setup wizard prompts for an initial password instead.
- **Default** - On first startup with no password set and no wizard completion, a random password is generated and logged to stdout.
- **When to set it** - Env-driven deployments that skip the wizard. It is a bootstrap value: read only while `admin.json` does not exist, then hashed into it.

### `ADMIN_CONFIG_DIR`

- **Purpose** - Operator-authored admin state. Holds `config.json`, `policy.json`, `admin.json` (passwordHash only), `plugin-config/`, `plugins/`, `themes/`, and uploaded branding assets. Safe to mount **read-only** after the setup wizard finishes.
- **Required** - No.
- **Default** - `./data/admin` (resolves to `/app/data/admin` in Docker). Falls back to `ADMIN_DATA_DIR` for back-compat.
- **Docker note** - Mount a persistent volume - read/write during initial setup, optionally read-only afterwards:
  ```yaml
  volumes:
    - bulwark-config:/app/data/admin       # rw during setup
    # - bulwark-config:/app/data/admin:ro  # ro after setup completes
  ```

### `ADMIN_STATE_DIR`

- **Purpose** - Runtime admin state that must stay writable forever: `admin-state.json` (login timestamps), `audit.log`, and the bootstrap setup token.
- **Required** - No.
- **Default** - `./data/admin-state` (resolves to `/app/data/admin-state` in Docker). When `ADMIN_DATA_DIR` is set without the split vars, Bulwark uses `<ADMIN_DATA_DIR>/state` for back-compat.
- **Docker note** - Always read-write:
  ```yaml
  volumes:
    - bulwark-state:/app/data/admin-state
  ```

### `ADMIN_CONFIG_READONLY`

- **Purpose** - Enforce read-only mode at the application layer so attempts to mutate config produce a clean error rather than a mid-request EROFS from the filesystem.
- **Required** - No.
- **Default** - `false`
- **When to set it** - Pair with `:ro` on the `ADMIN_CONFIG_DIR` mount after the wizard completes. Useful for immutable infrastructure (Kubernetes / Talos / read-only root).

### `ADMIN_DATA_DIR` _(legacy)_

- **Purpose** - Single directory containing both config and state for pre-1.6.4 installs.
- **Required** - No.
- **Default** - Not set.
- **Behavior** - Honoured only when neither `ADMIN_CONFIG_DIR` nor `ADMIN_STATE_DIR` is set. New installs should use the split variables.

### `ADMIN_SESSION_TTL`

- **Purpose** - Admin session lifetime in seconds.
- **Required** - No.
- **Default** - `3600` (one hour).

### `STALWART_ADMIN_ACCESS`

- **Purpose** - What a Stalwart admin account grants in the Bulwark admin dashboard.
- **Allowed values** - `auto` (Stalwart admins see the admin shield and are signed into `/admin` without the Bulwark admin password), `password` (they see the shield but must enter the admin password), `off` (Stalwart admin status is ignored; `/admin` is reachable only via `/admin/login`).
- **Default** - `auto`
- **Dependency** - `password` and `off` need an admin password to exist, from the wizard or `ADMIN_PASSWORD`.
- **When to set it** - For env-driven deployments. Also editable in the dashboard under Authentication, and a value saved there wins.

### `SEARCH_ENGINE_INDEXING`

- **Purpose** - Allow search engines to index the app.
- **Required** - No.
- **Default** - `false`, which serves a disallowing `robots.txt` and emits `noindex`.
- **When to set it** - Only for a deliberately public deployment.

### `TRUSTED_PROXY_DEPTH`

- **Purpose** - Number of `X-Forwarded-For` hops to trust when resolving the client IP for admin sessions and audit logs.
- **Required** - No.
- **Default** - `1`
- **When to set it** - Increase if Bulwark sits behind multiple reverse proxies (e.g., CDN -> ingress -> app).

## Anonymous telemetry

### `BULWARK_TELEMETRY`

- **Purpose** - Master toggle for the anonymous daily heartbeat. Heartbeats contain no PII (version, platform, feature toggles, bucketed account counts).
- **Required** - No.
- **Default** - Off. Nothing is sent until an admin opts in through the admin UI, the installer, or this variable.
- **When to set it** - Set to `on` to opt in from the environment, or `off` to lock it off. Setting it to either value greys out the admin toggle.
- **See also** - [Anonymous Usage Stats](/docs/features/telemetry) and [Telemetry privacy](/docs/legal/privacy/telemetry).

### `BULWARK_TELEMETRY_DISABLED` _(legacy)_

- **Purpose** - Older kill switch, honoured only when `BULWARK_TELEMETRY` is unset.
- **When to set it** - Don't, in new configs; use `BULWARK_TELEMETRY=off`.

### `BULWARK_TELEMETRY_ALLOW_PRIVATE`

- **Purpose** - Let heartbeats reach a private or loopback collector address.
- **Default** - Off, as an SSRF guard.
- **When to set it** - Only while running a collector locally during development. The collector endpoint itself is changed in the admin UI, not by an environment variable.

### `TELEMETRY_DATA_DIR`

- **Purpose** - Directory for telemetry state: the random `instance_id`, the admin's consent choice, and HMAC'd login fingerprints used to compute the 7-day-active-accounts bucket.
- **Required** - No.
- **Default** - `./data/telemetry` (resolves to `/app/data/telemetry` in Docker).
- **Docker note** - Mount a persistent volume so the instance id and consent choice survive upgrades:
  ```yaml
  volumes:
    - bulwark-telemetry:/app/data/telemetry
  ```

## Update check

### `BULWARK_UPDATE_CHECK`

- **Purpose** - The app periodically checks for new releases and raises an in-app notice, red when the release fixes a security advisory.
- **Required** - No.
- **Default** - On.
- **When to set it** - Set to `off` (or `false`, `0`, `no`) to disable the check entirely, for instance on an air-gapped host.

### `BULWARK_UPDATE_CHECK_URL`

- **Purpose** - Override the endpoint the check reads. Takes priority over the on-disk state file.
- **Required** - No.
- **When to set it** - To point at your own feed. An explicit empty value also disables the check.

### `VERSION_CHECK_DATA_DIR`

- **Purpose** - Where the check stores its state.
- **Default** - `./data/version-check`

## Extension directory and plugins

### `EXTENSION_DIRECTORY_URL`

- **Purpose** - URL of the extension directory used by the admin marketplace for browsing and installing plugins and themes.
- **Required** - No.
- **Default** - `https://extensions.bulwarkmail.org`
- **When to set it** - Only when you run your own directory, or to clear it (`EXTENSION_DIRECTORY_URL=`) and hide the marketplace.

### `PLUGIN_DEV_DIR`

- **Purpose** - Load plugins from a folder on disk instead of uploaded ZIPs. Each immediate subfolder is one plugin with a `manifest.json`; an entrypoint under `src/` is bundled on demand with esbuild, so editing sources needs only a browser refresh.
- **Required** - No.
- **When to set it** - Plugin development only.

## Files and calendar

### `WOPI_CLIENT_URL`

- **Purpose** - Base URL of a WOPI-capable office editor (Collabora Online, OnlyOffice, EuroOffice). Bulwark fetches discovery from `<url>/hosting/discovery` unless the URL already carries a path.
- **Required** - No.
- **Default** - Empty, which turns office editing off.

### `WOPI_HOST_URL`

- **Purpose** - How the WOPI editor reaches this webmail (the `WOPISrc` base).
- **Default** - Derived from the request origin.
- **When to set it** - When the editor sees a different host than the browser does: Docker networks, split DNS.

### `ICAL_MAX_BYTES`

- **Purpose** - Response cap, in bytes, for fetched iCalendar subscription feeds. Read per request, so raising it needs no restart.
- **Required** - No.
- **When to set it** - When a legitimate feed is larger than the built-in limit and the calendar shows the size error.

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

## Branding: icons and favicon

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

### `PWA_SCREENSHOT_MOBILE_URL` / `PWA_SCREENSHOT_DESKTOP_URL`

- **Purpose** - Screenshots shown in the browser's richer install dialog (Chrome on Android, for instance). Resized on the fly to what the manifest needs.
- **Required** - No.
- **Default** - Bundled screenshots.
- **Accepted values** - Absolute URL or path relative to `public/`. Both can also be overridden per hostname through `DOMAIN_BRANDING`.

## Branding: logos

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

## Login page customization

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

### `LOGIN_LOGO_MAX_HEIGHT` / `LOGIN_LOGO_MAX_WIDTH`

- **Purpose** - Cap the rendered size of the login logo. Any CSS length (`96px`, `8rem`).
- **Default** - Unset; the logo renders at its natural size inside a 64×64 box.
- **When to set it** - A wide wordmark, which otherwise renders about 13px tall.

### `LOGIN_SHOW_HEADING` / `LOGIN_SHOW_SUBTITLE` / `LOGIN_SHOW_TOTP` / `LOGIN_SHOW_VERSION`

- **Purpose** - Hide parts of the login page: the heading (the app name), the subtitle, the optional "I have a 2FA code" toggle, and the version number.
- **Default** - All `true`.
- **When to set it** - Turn the heading and subtitle off when the logo already reads as the brand. Turn the TOTP toggle off when authentication lives in an external directory with no server-side TOTP; a server that requires TOTP still asks for it. Turn the version off so it isn't disclosed to unauthenticated visitors.

### `DOMAIN_BRANDING`

- **Purpose** - Per-hostname overrides for the branding fields above when one deployment serves several hostnames. Matched on the request `Host` (or `X-Forwarded-Host`); `*.example.com` matches any subdomain. Exact matches win over wildcards.
- **Format** - A JSON array of objects, each with `host` and any subset of `appName`, `appShortName`, `appDescription`, `faviconUrl`, `pwaIconUrl`, `pwaThemeColor`, `pwaBackgroundColor`, `appLogoLightUrl`, `appLogoDarkUrl`, `loginLogoLightUrl`, `loginLogoDarkUrl`, `loginCompanyName`, `loginImprintUrl`, `loginPrivacyPolicyUrl`, `loginWebsiteUrl`.
- **When to set it** - Stateless deployments; the admin dashboard manages the same list.

## Internationalization

### `NEXT_PUBLIC_DEFAULT_LOCALE` _(build-time)_

- **Purpose** - Fallback UI locale when the visitor's `Accept-Language` header matches no supported locale and no preference cookie is set.
- **Default** - `en`. An unsupported value falls back to `en`.
- **Supported** - `ar`, `ca`, `cs`, `da`, `de`, `en`, `es`, `fa`, `fr`, `he`, `hu`, `it`, `ja`, `ko`, `lv`, `mn`, `nb`, `nl`, `pl`, `pt`, `ro`, `ru`, `sk`, `tr`, `uk`, `zh`, `zh-TW`.
- **Docker note** - Build your own image with `--build-arg NEXT_PUBLIC_DEFAULT_LOCALE=de`.

### `NEXT_PUBLIC_LOCALE_PREFIX` _(build-time)_

- **Purpose** - Controls how the locale appears in URLs (e.g., `/en/inbox` vs `/inbox`).
- **Allowed values** - `always` (always prefix), `as-needed` (only for non-default locales), `never` (never prefix).
- **Default** - `never`
- **When to set it** - Set to `always` when using `NEXT_PUBLIC_BASE_PATH` to avoid `next-intl` rewrite loops. Bulwark Lite always builds with `always`.

## Subpath and reverse proxy mount

### `NEXT_PUBLIC_BASE_PATH` _(build-time)_

- **Purpose** - Mount Bulwark under a URL prefix (e.g. `https://example.com/webmail`).
- **Required** - No.
- **Default** - Empty (served from the root).
- **Build-time** - Unlike most other variables, this is read at **build time** because Next.js bakes it into emitted asset URLs.
- **When to set it** - Set this when fronting Bulwark with a reverse proxy that exposes it under a subpath. Pair with `NEXT_PUBLIC_LOCALE_PREFIX=always` and **do not** strip the prefix at the proxy - the app expects to receive requests under `/<base-path>/...` and serves all routes (`/<base-path>/api/...`, `/<base-path>/_next/static/...`, `/<base-path>/sw.js`, etc.) accordingly.
- **Docker note** - To use this with the published image, build your own with the build arg set:
  ```bash
  docker build --build-arg NEXT_PUBLIC_BASE_PATH=/webmail -t bulwark-webmail .
  ```

## Web push

### `NEXT_PUBLIC_PUSH_RELAY_URL` _(build-time)_

- **Purpose** - The relay that turns JMAP push into web push, so self-hosters need no VAPID keys or Firebase project of their own.
- **Default** - `https://notifications.relay.bulwarkmail.org`
- **When to set it** - Point at your own relay ([github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay)) to avoid the hosted one. The admin dashboard picks the relay from an admin-defined list at runtime; this variable sets the build-time default.

## Demo mode

### `DEMO_MODE`

- **Purpose** - Serve fixture data instead of talking to a mail server. Any credentials log in.
- **Default** - `false`
- **When to set it** - Demos and UI work. See [Demo mode](/docs/getting-started/demo-mode).

## Translation proxy

### `LIBRETRANSLATE_URL` / `LIBRETRANSLATE_API_KEY`

- **Purpose** - Point the in-app translate action at a LibreTranslate instance instead of the public MyMemory API it defaults to, so message text stays on infrastructure you control.
- **Required** - No.

## Master-user impersonation

### `BULWARK_JWT_AUTH_SECRET` / `BULWARK_STALWART_MASTER_USER` / `BULWARK_STALWART_MASTER_PASSWORD` / `BULWARK_JWT_AUTH_ISSUER`

- **Purpose** - Let a trusted platform mint a signed JWT that opens a user's mailbox through a Stalwart master account, without that user's password.
- **Default** - Unset. The endpoint returns 404 until the first three are all set, so the feature is fully off by default.
- **Security** - This grants sign-in as any mailbox on the server. Treat the secret and the master password as root credentials. The whole flow is on the [impersonation](/docs/guides/impersonation) page.

## Embedded SSO and iframe

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

## Legacy build-time fallbacks

These variables still work, but they exist for compatibility with older deployments where values were baked into the frontend bundle at build time.

### `NEXT_PUBLIC_APP_NAME`

- **Purpose** - Legacy fallback for `APP_NAME`.
- **Required** - No.
- **When to use it** - Only if you still depend on build-time configuration.

### `NEXT_PUBLIC_JMAP_SERVER_URL`

- **Purpose** - Legacy fallback for `JMAP_SERVER_URL`.
- **Required** - No.
- **When to use it** - Only if you still depend on build-time configuration.

## Recommended patterns

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

## Using `*_FILE` variables with Docker secrets

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
