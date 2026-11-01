---
title: Environment reference
description: Every environment variable Bulwark reads, with defaults and when to set it.
order: 2
edition: full
editionNote: "These variables configure Bulwark (not Lite). Lite reads config.json; see Bulwark Lite."
---

# Environment reference

Every environment variable the Bulwark server reads in this release: the ones in `.env.example`, and the ones the code reads without advertising them there. Order and grouping follow the code's config map (`lib/admin/types.ts`) rather than the example file. Variables that only the test and build tooling read are listed at the end.

Nearly all variables are evaluated at runtime, so Docker deployments can be reconfigured without rebuilding. The exceptions are `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_LOCALE_PREFIX`, `NEXT_PUBLIC_DEFAULT_LOCALE` and `NEXT_PUBLIC_PUSH_RELAY_URL`, which Next.js bakes in at build time. The Dockerfile takes the first three as `--build-arg`. For the push relay it has no build argument; add an `ARG`/`ENV` line for it before `next build`, or offer your relay under User policy > Push relays in the admin console instead.

A value saved by the setup wizard or the admin console (in `ADMIN_CONFIG_DIR/config.json`) wins over the environment, and the environment wins over the built-in default. Two exceptions: `SESSION_SECRET` and `SESSION_SECRET_FILE` win over a session secret saved in the admin config, and `NO_THIRD_PARTY_TRAFFIC=true` in the environment can't be switched off from the admin console.

<div class="bw-note"><b>Note.</b> None of this applies to Bulwark Lite, which has no server to read an environment. Lite is configured by the <code>LITE_*</code> build inputs and the shipped <code>config.json</code>; both are on the <a href="/docs/deployment/static">static hosting</a> page.</div>

> **First-launch tip**
> Most new installs don't need to set environment variables by hand. Launch the container without `JMAP_SERVER_URL` and the [web setup wizard](/docs/getting-started/installation#quickest-path-docker--setup-wizard) writes the equivalent values to `ADMIN_CONFIG_DIR`. Use env vars when you want env-driven, immutable, or read-only configuration.

## Server listen address

### `HOSTNAME`

- **Purpose:** sets the address the server binds to.
- **Required:** no.
- **Default:** `0.0.0.0`
- **When to set it:** set to `::` to listen on IPv6 (dual-stack), or to a specific interface address to restrict access.

### `PORT`

- **Purpose:** sets the port the server listens on.
- **Required:** no.
- **Default:** `3000`

## Core settings

### `APP_NAME`

- **Purpose:** sets the application name displayed in the UI, browser tab title, and PWA manifest.
- **Required:** no.
- **Default:** `Webmail` (built-in fallback when not set).
- **When to set it:** set this to show your own name instead of `Webmail`.

### `APP_SHORT_NAME`

- **Purpose:** short name for the app, used where space is limited (home screen label on mobile, PWA install prompt).
- **Required:** no.
- **Default:** falls back to `APP_NAME` if not set.

### `APP_DESCRIPTION`

- **Purpose:** description shown in the PWA manifest (displayed by the OS during install).
- **Required:** no.
- **Default:** generic Bulwark description.

### `JMAP_SERVER_URL`

- **Purpose:** points Bulwark to your JMAP-compatible mail server. Setting this also disables the first-launch setup wizard.
- **Required:** no. The setup wizard can write this value to admin config instead. Required only when you want env-driven configuration, when `ALLOW_CUSTOM_JMAP_ENDPOINT=true` is not set, or when you rely on the legacy `NEXT_PUBLIC_JMAP_SERVER_URL` fallback.
- **Example:** `https://mail.example.com`
- **When to set it:** for env-driven deployments. A server URL already saved by the wizard or the admin console takes priority over this variable. For several servers, see `JMAP_SERVERS` below.

### `ALLOW_CUSTOM_JMAP_ENDPOINT`

- **Purpose:** shows a "JMAP Server" field on the login form so users can connect to any JMAP-compatible server.
- **Required:** no.
- **Default:** `false`
- **CORS note:** external JMAP servers must include the webmail origin in their `Access-Control-Allow-Origin` response header, or browser requests will be blocked.
- **When to set it:** set to `true` for multi-tenant deployments or testing setups where users connect to different servers.

### `JMAP_SERVERS`

- **Purpose:** offers a fixed list of JMAP servers on the login form instead of a free-text field.
- **Required:** no.
- **Default:** empty.
- **Format:** a JSON array. Each entry needs `id`, `label` and `url`, and may carry `domains` (a list of email domains it serves) and its own `oauth` block.
- **Example:** `[{"id":"eu","label":"Europe","url":"https://eu.example.com","domains":["example.com"]},{"id":"us","label":"US","url":"https://us.example.com"}]`
- **When to set it:** deployments sharded across servers, and stateless installs that can't use the admin console, which manages the same list.

### `JMAP_SERVER_AUTO_PICK_BY_DOMAIN`

- **Purpose:** picks the server from `JMAP_SERVERS` whose `domains` list contains the domain of the address the user types.
- **Required:** no.
- **Default:** `false`
- **When to set it:** with `JMAP_SERVERS`, when every account's domain maps to exactly one server.

## Stalwart integration

### `STALWART_FEATURES`

- **Purpose:** shows the Stalwart-only parts of the app: the Security tab in settings (password, two-factor, app passwords, API keys) and deleted-mail recovery. Off also closes the Stalwart JMAP passthrough. Sieve filters, the vacation responder and the admin console don't depend on it.
- **Required:** no.
- **Default:** `true` unless explicitly set to `false`.
- **When to set it:** set `STALWART_FEATURES=false` if you are using Bulwark with a non-Stalwart JMAP server and want to hide features that depend on Stalwart-specific JMAP `x:` methods.

### `STALWART_JMAP_PASSTHROUGH_ENABLED`

- **Purpose:** server-side switch for the credential-bearing passthrough route that Stalwart-specific features use to reach the mail server through Bulwark.
- **Required:** no.
- **Default:** `true`
- **When to set it:** set to `false` to keep the client-side Stalwart features but block the passthrough entirely. Independent of `STALWART_FEATURES`; also editable in the admin console.

### `STALWART_VERSION`

- **Purpose:** the Stalwart version the anonymous telemetry heartbeat reports as `stalwart_version`.
- **Required:** no.
- **Default:** empty, and the heartbeat reports `null`: Stalwart doesn't publish its version, so Bulwark doesn't look it up. Before {{BULWARK_VERSION}}, Bulwark read the JMAP server's `Server` response header when this was unset. Stalwart sends no such header, so those releases reported `null` or the version of a reverse proxy in front of it.
- **When to set it:** when telemetry is on and you want the heartbeat to include your Stalwart version, for example `0.16.23`. Change it when you upgrade Stalwart.
- **See also:** [Telemetry privacy](/docs/legal/privacy/telemetry).

### `STALWART_API_URL` _(deprecated in 1.5.0)_

- **Status:** deprecated. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP. Bulwark now talks to the JMAP endpoint exclusively, so this variable has no effect.
- **Migration:** remove from your `.env.local`. The self-service portal (account settings, app passwords, API keys) requires Stalwart 0.16.6 or newer, or 1.0 with Bulwark {{BULWARK_VERSION}} or newer.

## OAuth / OpenID Connect

### `OAUTH_ENABLED`

- **Purpose:** turns on OAuth2 / OIDC login support.
- **Required:** no.
- **Default:** `false`
- **When to set it:** set to `true` when your deployment should show an SSO login flow.

### `OAUTH_ONLY`

- **Purpose:** makes OAuth the only login method and hides the username/password form.
- **Required:** no.
- **Dependency:** requires `OAUTH_ENABLED=true`.
- **When to set it:** use this when all users should authenticate through your identity provider only.

### `OAUTH_CLIENT_ID`

- **Purpose:** OAuth client ID registered with your identity provider.
- **Required:** required when OAuth is enabled.
- **When to set it:** always set this together with `OAUTH_ENABLED=true`.

### `OAUTH_CLIENT_SECRET`

- **Purpose:** OAuth client secret used for confidential clients.
- **Required:** no.
- **When to set it:** only needed if your IdP registration expects a confidential client instead of a public PKCE-only client.

### `OAUTH_CLIENT_SECRET_FILE`

- **Purpose:** path to a file containing the OAuth client secret.
- **Required:** no.
- **When to set it:** use this with Docker secrets, Kubernetes secrets, or any platform that mounts secrets as files. If both `OAUTH_CLIENT_SECRET` and `OAUTH_CLIENT_SECRET_FILE` are set, the env var takes precedence.

### `OAUTH_ISSUER_URL`

- **Purpose:** explicit issuer URL used for OIDC discovery.
- **Required:** no.
- **Default behavior:** if omitted, Bulwark falls back to discovery through `JMAP_SERVER_URL`.
- **When to set it:** set this when your mail server delegates auth to an external IdP such as Keycloak or Authentik.

### `OAUTH_AUTHORIZE_URL`

- **Purpose:** overrides only the user-facing authorize endpoint. Discovery, token exchange and refresh keep using `OAUTH_ISSUER_URL`.
- **Required:** no.
- **Default:** the `authorization_endpoint` from discovery.
- **When to set it:** a per-brand login host in front of a single canonical issuer.

### `OAUTH_ALLOW_PRIVATE_ENDPOINTS`

- **Purpose:** lets OAuth endpoints on other hosts than the issuer resolve to private (RFC 1918) or loopback addresses.
- **Required:** no.
- **Default:** `false`, as an SSRF guard. Endpoints on the issuer's own host are always allowed.
- **When to set it:** when the IdP advertises token or userinfo endpoints on a different internal host. Split DNS for the issuer itself works without it.

### `OAUTH_END_SESSION`

- **Purpose:** signing out of an SSO account also signs out of the identity provider, through the `end_session_endpoint` it advertises.
- **Required:** no.
- **Default:** `true`.
- **When to set it:** set to `false` when the provider is shared with other apps that should stay signed in after a Bulwark sign-out.

### `OAUTH_END_SESSION_URL`

- **Purpose:** the provider's logout URL, for providers whose discovery document has no `end_session_endpoint` (Stalwart's built-in provider, for example). When set, Bulwark uses it instead of the discovered endpoint and sends the same parameters: `client_id`, `id_token_hint` and `post_logout_redirect_uri`.
- **Required:** no.
- **Default:** empty (the discovered `end_session_endpoint`, if there is one).
- **Scope:** applies to the provider of `OAUTH_ISSUER_URL` only. `JMAP_SERVERS` entries set their own `endSessionUrl` in their `oauth` block.

### `OAUTH_REVOKE_ON_SIGN_OUT`

- **Purpose:** signing out revokes Bulwark's refresh token at the provider's revocation endpoint.
- **Required:** no.
- **Default:** `true`. Stalwart 1.0 then also removes Bulwark from the user's connected applications and asks for consent again on the next sign-in.
- **When to set it:** set to `false` to keep the consent. Bulwark then only drops the token from the browser, and it stays valid at the provider until it expires.

### `OAUTH_POST_LOGOUT_REDIRECT_URI`

- **Purpose:** where the identity provider sends the browser after signing the user out.
- **Required:** no.
- **Default:** none. The provider shows its own signed-out page.
- **When to set it:** to bring users back to Bulwark, for example `https://mail.example.com/en/login`. Register the same URI with the provider as a post-logout redirect URI first, or the provider refuses the logout.

### `OAUTH_SCOPES`

- **Purpose:** override the OAuth scope string requested at the authorization endpoint.
- **Required:** no.
- **Default:** `openid email profile`. For a provider that lists OAuth data scopes, such as Stalwart 1.0, Bulwark drops the scopes the provider doesn't list and adds its data scopes.
- **When to set it:** only when your IdP requires a specific scope set. Add `offline_access` if your IdP only issues refresh tokens for it (Authelia, for example); otherwise sessions end when the access token expires.

### `OAUTH_EXTRA_SCOPES`

- **Purpose:** append extra scopes to the default scope set without replacing it.
- **Required:** no.
- **Default:** empty.
- **When to set it:** when you need to add provider-specific scopes (e.g., a custom audience scope) on top of the defaults.

## Session and security

### `SESSION_SECRET`

- **Purpose:** secret used to encrypt persistent "Remember me" sessions, settings sync data, multi-account state, and server-side OAuth PKCE state.
- **Required:** no. Encrypted persistent sessions, settings sync, multi-account support, and embedded SSO need a secret, but when neither this nor `SESSION_SECRET_FILE` is set, Bulwark generates one on first start and stores it in the admin state directory (`.session-secret` in `data/admin-state`).
- **Generation:** `openssl rand -base64 32`
- **When to set it:** when the admin state directory isn't on a persistent volume, or when you run [several instances](/docs/deployment/multi-instance): set the same value on every replica. With `REDIS_URL` and no secret set, the first replica stores a generated one in the shared store and every replica uses it.
- **Validation:** at least 32 characters.
- **Precedence:** unlike other settings, this variable and `SESSION_SECRET_FILE` win over a session secret the setup wizard saved in the admin config.

### `SESSION_SECRET_FILE`

- **Purpose:** path to a file containing the session secret.
- **Required:** no.
- **When to set it:** use with Docker secrets or Kubernetes secrets. `SESSION_SECRET` takes precedence if both are set.

### `COOKIE_SAME_SITE`

- **Purpose:** sets the `SameSite` attribute on session cookies.
- **Allowed values:** `lax`, `none`, `strict`
- **Default:** `lax`
- **When to set it:** set to `none` when Bulwark is embedded cross-origin in an iframe. Requires HTTPS.

### `COOKIE_SECURE`

- **Purpose:** force cookies to be marked as `Secure`.
- **Required:** no.
- **Default:** `true` when `COOKIE_SAME_SITE=none` or `NODE_ENV=production`, otherwise `false`.
- **When to set it:** override when reverse-proxying terminates TLS in front of an `http://` Bulwark and you need explicit control.

## Settings sync

### `SETTINGS_SYNC_ENABLED`

- **Purpose:** enables encrypted server-side settings persistence across devices and accounts.
- **Required:** no.
- **Dependency:** requires `SESSION_SECRET`.
- **Default:** `false`
- **When to set it:** set to `true` when you want settings to follow users across browsers, devices, and accounts.

### `SETTINGS_DATA_DIR`

- **Purpose:** filesystem location where encrypted settings files are stored.
- **Required:** no.
- **Default:** `./data/settings` (resolves to `/app/data/settings` in Docker, since `WORKDIR` is `/app`)
- **When to set it:** set this when you want settings data stored on a specific persistent volume or host path.
- **Docker note:** mount a persistent volume at `/app/data/settings` (or at whatever absolute path you configure) so that settings survive container restarts:
  ```yaml
  volumes:
    - bulwark-settings:/app/data/settings
  ```

## Admin console

### `ADMIN_PASSWORD`

- **Purpose:** sets the initial admin password for the admin console. The admin console manages plugins, themes, runtime config overrides, and policy.
- **Required:** no. The setup wizard prompts for an initial password instead.
- **Default:** none. Without it, and without the setup wizard, the admin console stays disabled.
- **When to set it:** env-driven deployments that skip the wizard. It is a bootstrap value: read only while `admin.json` does not exist, then hashed into it.

### `ADMIN_CONFIG_DIR`

- **Purpose:** operator-authored admin state. Holds `config.json`, `policy.json`, `admin.json` (passwordHash only), `plugin-config/`, `plugins/`, `themes/`, and uploaded branding assets. Safe to mount **read-only** after the setup wizard finishes.
- **Required:** no.
- **Default:** `./data/admin` (resolves to `/app/data/admin` in Docker). Falls back to `ADMIN_DATA_DIR` for back-compat.
- **Docker note:** mount a persistent volume, read/write during initial setup and optionally read-only afterwards:
  ```yaml
  volumes:
    - bulwark-config:/app/data/admin       # rw during setup
    # - bulwark-config:/app/data/admin:ro  # ro after setup completes
  ```

### `ADMIN_STATE_DIR`

- **Purpose:** runtime admin state that must stay writable forever: `admin-state.json` (login timestamps), `audit.log`, and the bootstrap setup token.
- **Required:** no.
- **Default:** `./data/admin-state` (resolves to `/app/data/admin-state` in Docker). When `ADMIN_DATA_DIR` is set without the split vars, Bulwark uses `<ADMIN_DATA_DIR>/state` for back-compat.
- **Docker note:** always read-write:
  ```yaml
  volumes:
    - bulwark-state:/app/data/admin-state
  ```

### `ADMIN_CONFIG_READONLY`

- **Purpose:** enforce read-only mode at the application layer so attempts to mutate config produce a clean error rather than a mid-request EROFS from the filesystem.
- **Required:** no.
- **Default:** `false`
- **When to set it:** pair with `:ro` on the `ADMIN_CONFIG_DIR` mount after the wizard completes. Useful for immutable infrastructure (Kubernetes / Talos / read-only root).

### `ADMIN_DATA_DIR` _(legacy)_

- **Purpose:** single directory containing both config and state for pre-1.6.4 installs.
- **Required:** no.
- **Default:** not set.
- **Behavior:** honoured only when neither `ADMIN_CONFIG_DIR` nor `ADMIN_STATE_DIR` is set. New installs should use the split variables.

### `ADMIN_SESSION_TTL`

- **Purpose:** admin session lifetime in seconds.
- **Required:** no.
- **Default:** `3600` (one hour).

### `STALWART_ADMIN_ACCESS`

- **Purpose:** what a Stalwart admin account grants in the Bulwark admin console.
- **Allowed values:** `auto` (Stalwart admins see the admin shield and are signed into `/admin` without the Bulwark admin password), `password` (they see the shield but must enter the admin password), `off` (Stalwart admin status is ignored; `/admin` is reachable only via `/admin/login`).
- **Default:** `auto`
- **Dependency:** `password` and `off` need an admin password to exist, from the wizard or `ADMIN_PASSWORD`.
- **When to set it:** for env-driven deployments. Also editable in the admin console under Authentication, and a value saved there wins.

### `SEARCH_ENGINE_INDEXING`

- **Purpose:** allow search engines to index the app.
- **Required:** no.
- **Default:** `false`, which adds `noindex, nofollow` to every page.
- **When to set it:** only for a deliberately public deployment.

### `TRUSTED_PROXY_DEPTH`

- **Purpose:** number of `X-Forwarded-For` hops to trust when resolving the client IP for admin sessions and audit logs.
- **Required:** no.
- **Default:** `1`
- **When to set it:** increase if Bulwark sits behind multiple reverse proxies (e.g., CDN -> ingress -> app).

## Anonymous telemetry

### `BULWARK_TELEMETRY`

- **Purpose:** master toggle for the anonymous daily heartbeat. Heartbeats contain no PII (version, platform, feature toggles, bucketed account counts).
- **Required:** no.
- **Default:** off. Nothing is sent until an admin opts in through the admin console, the installer, or this variable.
- **When to set it:** set to `on` to opt in from the environment, or `off` to lock it off. Setting it to either value greys out the admin toggle.
- **See also:** [Anonymous Usage Stats](/docs/features/telemetry) and [Telemetry privacy](/docs/legal/privacy/telemetry).

### `BULWARK_TELEMETRY_DISABLED` _(legacy)_

- **Purpose:** older kill switch, honoured only when `BULWARK_TELEMETRY` is unset.
- **When to set it:** don't, in new configs; use `BULWARK_TELEMETRY=off`.

### `BULWARK_TELEMETRY_ALLOW_PRIVATE`

- **Purpose:** let heartbeats reach a private or loopback collector address.
- **Default:** off, as an SSRF guard.
- **When to set it:** only while running a collector locally during development. The collector endpoint itself is changed in the admin console, not by an environment variable.

### `TELEMETRY_DATA_DIR`

- **Purpose:** directory for telemetry state: the random `instance_id`, the admin's consent choice, and HMAC'd login fingerprints used to compute the 7-day-active-accounts bucket.
- **Required:** no.
- **Default:** `./data/telemetry` (resolves to `/app/data/telemetry` in Docker).
- **Docker note:** mount a persistent volume so the instance id and consent choice survive upgrades:
  ```yaml
  volumes:
    - bulwark-telemetry:/app/data/telemetry
  ```

## Outside services

### `NO_THIRD_PARTY_TRAFFIC`

- **Purpose:** fail-closed switch that turns off every built-in outside host: the telemetry heartbeat, the update check, the hosted push relay, the official extension directory, the connector, sender favicons, MyMemory translation, map links and WKD key lookup. Plugins that declare network access don't run.
- **Required:** no.
- **Default:** `false`. Accepts `true`, `1`, `yes` or `on`.
- **Precedence:** also a switch in the admin console (Security > Third-party traffic). When the environment turns it on, the admin console can't turn it off.
- **When to set it:** when the server and its users' browsers must not contact anything you don't run yourself. Self-hosted replacements, such as your own extension directory or push relay, keep working.

### `CONNECTOR_ENABLED`

- **Purpose:** answers the connector at connector.bulwarkmail.org, which resolves links in the docs and the extension directory to a reader's own instance. Off, the capabilities endpoint the connector asks (`/api/connector/capabilities`) answers 404.
- **Required:** no.
- **Default:** `true`
- **When to set it:** set to `false` when the instance shouldn't tell anyone what it is. `NO_THIRD_PARTY_TRAFFIC=true` turns it off too.

### `CONNECTOR_URL`

- **Purpose:** Connector address for white-label or self-hosted deployments.
- **Default:** `https://connector.bulwarkmail.org`
- **Note:** read into the config, but nothing in this release uses the value yet.

## Update check

### `BULWARK_UPDATE_CHECK`

- **Purpose:** the app periodically checks for new releases and raises an in-app notice, red when the release fixes a security advisory.
- **Required:** no.
- **Default:** on.
- **When to set it:** set to `off` (or `false`, `0`, `no`) to disable the check entirely, for instance on an air-gapped host.

### `BULWARK_UPDATE_CHECK_URL`

- **Purpose:** override the endpoint the check reads. Takes priority over the on-disk state file.
- **Required:** no.
- **When to set it:** to point at your own feed. An explicit empty value also disables the check.

### `VERSION_CHECK_DATA_DIR`

- **Purpose:** where the check stores its state.
- **Default:** `./data/version-check`

## Extension directory and plugins

### `EXTENSION_DIRECTORY_URL`

- **Purpose:** URL of the extension directory used by the admin marketplace for browsing and installing plugins and themes.
- **Required:** no.
- **Default:** `https://extensions.bulwarkmail.org`
- **When to set it:** only when you run your own directory. An empty value falls back to the official one. To stop contacting the official directory, set `NO_THIRD_PARTY_TRAFFIC=true`; a self-hosted directory stays usable then.

### `EXTENSION_DIRECTORY_ROOT_KEYS`

- **Purpose:** the root keys (base64 raw Ed25519, comma-separated) a self-hosted extension directory signs its keyring with. With root keys known, the marketplace refuses an unsigned or badly signed bundle.
- **Default:** empty. The official directory's root key is built in. A custom directory without root keys gets its bundles installed without a signature check.

### `EXTENSION_DIRECTORY_CHANNEL`

- **Purpose:** which releases the marketplace offers.
- **Allowed values:** `stable`, `beta` (also offers pre-release versions)
- **Default:** `stable`

### `EXTENSION_DIRECTORY_ALLOW_PRIVATE`

- **Purpose:** lets the admin console accept a directory URL on this host or on a private address. Without it, saving such a URL there is refused.
- **Default:** unset.
- **When to set it:** set to `true` for a directory on your own network.

### `PLUGIN_SIGNING_KEY_FILE`

- **Purpose:** path to an existing PEM PKCS#8 Ed25519 private key that signs managed plugin bundles. Bulwark reads the file and never changes it.
- **Default:** unset (Bulwark loads `ADMIN_CONFIG_DIR/plugin-signing.key`, or creates it on first start; with `REDIS_URL` the key lives in the shared store and every replica signs with it).
- **When to set it:** when the key should come from a secret mount (systemd credential, Docker secret, Kubernetes Secret), for example with a read-only config volume. With several replicas, set it on every replica or on none: a replica whose key differs from the others refuses to sign plugins and logs why.

### `PLUGIN_SECRETS_DIR`

- **Purpose:** where the credentials users connect for plugins are kept: one file per mail account, encrypted with the session secret.
- **Default:** `plugin-secrets` next to `SETTINGS_DATA_DIR` (`/app/data/plugin-secrets` in Docker).
- **Docker note:** persist it, or users have to reconnect their plugin accounts after the container is recreated. A volume on all of `/app/data` covers it.

### `PLUGIN_PROXY_PRIVATE_ORIGINS`

- **Purpose:** comma-separated origins on your own network that the plugin credential proxy may reach, although they resolve to private addresses (a Nextcloud on the LAN, for example). These may also be plain `http`.
- **Default:** empty (every other origin must be `https` and resolve to a public address).

### `PLUGIN_DEV_DIR`

- **Purpose:** load plugins from a folder on disk instead of uploaded ZIPs. Each immediate subfolder is one plugin with a `manifest.json`; an entrypoint under `src/` is bundled on demand with esbuild, so editing sources needs only a browser refresh.
- **Required:** no.
- **When to set it:** plugin development only.

## Files and calendar

### `WOPI_CLIENT_URL`

- **Purpose:** base URL of a WOPI-capable office editor (Collabora Online, OnlyOffice, EuroOffice). Bulwark fetches discovery from `<url>/hosting/discovery` unless the URL already carries a path.
- **Required:** no.
- **Default:** empty, which turns office editing off.

### `WOPI_HOST_URL`

- **Purpose:** how the WOPI editor reaches this webmail (the `WOPISrc` base).
- **Default:** derived from the request origin.
- **When to set it:** when the editor sees a different host than the browser does: Docker networks, split DNS.

### `WOPI_NEW_FILE_FORMATS`

- **Purpose:** which formats Files offers under "New file" besides `.txt`, as a comma-separated list of extensions (`docx,xlsx,odt`).
- **Default:** empty (every format the editor can edit and a blank template exists for). Bulwark ships blank templates for `docx`, `xlsx`, `pptx`, `odt`, `ods`, `odp` and `pdf`.

### `WOPI_TEMPLATE_DIR`

- **Purpose:** a server directory whose `new.<ext>` files replace the shipped blank templates or add formats. ONLYOFFICE's `document-templates/new/<locale>` folders use that naming.
- **Default:** empty (the shipped templates only).

### `ICAL_MAX_BYTES`

- **Purpose:** response cap, in bytes, for fetched iCalendar subscription feeds. Read per request, so raising it needs no restart.
- **Required:** no.
- **When to set it:** when a legitimate feed is larger than the built-in limit and the calendar shows the size error.

## Outbound proxy

### `NODE_USE_ENV_PROXY`

- **Purpose:** sends Bulwark's server-side requests through the proxy in `HTTPS_PROXY` / `HTTP_PROXY`: iCal subscriptions, the telemetry heartbeat, branding assets loaded from a URL, plugin requests and calls to the mail server. Hosts in `NO_PROXY` are reached directly. For URLs that come from users or feeds, such as an iCal subscription, Bulwark still resolves the address and checks it against its private-network guard itself, then asks the proxy to connect to exactly that address, so the proxy can't be used to reach an internal host.
- **Required:** no.
- **Default:** unset (the proxy variables are ignored and Bulwark connects directly).
- **When to set it:** when the server has no direct internet access and has to go through a proxy. Set it to `1`, together with the proxy:

  ```env
  NODE_USE_ENV_PROXY=1
  HTTPS_PROXY=http://proxy.internal:3128
  NO_PROXY=localhost,127.0.0.1,stalwart
  ```

  List Stalwart in `NO_PROXY` when Bulwark reaches it on an internal address, such as the `stalwart` service name in Docker Compose. `NODE_OPTIONS=--use-env-proxy` does the same as `NODE_USE_ENV_PROXY=1`.

### `NODE_EXTRA_CA_CERTS`

- **Purpose:** a Node.js variable: a PEM file of extra certificates to trust. The server checks every sign-in against the JMAP server itself, so it must trust the mail server's certificate from inside the container, not only from the browser.
- **Default:** unset (the system trust store only).
- **When to set it:** when Stalwart uses a self-signed or private-CA certificate. Point it at that certificate or its CA, for example `/certs/mail-ca.pem`. Without it, calendar subscriptions and other server-side features fail with "Not authenticated".

## Brand logos (BIMI)

### `BIMI_REQUIRE_CERTIFICATE`

- **Purpose:** senders that publish a BIMI record and enforce DMARC get their logo as the sender icon, looked up by this server.
- **Default:** `false` (a logo shows when only the DNS record backs it, as Yahoo does).
- **When to set it:** set to `true` to show only logos backed by a Verified Mark or Common Mark Certificate, as Gmail and Apple Mail do.

## Logging

### `LOG_FORMAT`

- **Purpose:** controls server log output format.
- **Allowed values:** `text` (colored, human-readable), `json` (structured)
- **Default:** `text`
- **When to set it:** use `json` for centralized log aggregation in containers and observability stacks.

### `LOG_LEVEL`

- **Purpose:** controls server log verbosity.
- **Allowed values:** `error`, `warn`, `info`, `debug`
- **Default:** `info`
- **When to set it:** increase to `debug` during troubleshooting; lower to `warn` or `error` in quieter production environments.

## Branding: icons and favicon

### `FAVICON_URL`

- **Purpose:** custom favicon shown in the browser tab.
- **Required:** no.
- **Default:** Bulwark favicon (`/branding/Bulwark_Favicon.svg`).
- **Accepted values:** absolute URL or path relative to `public/`.
- **Supported formats:** SVG (recommended), PNG, ICO.
- **Recommended size:** 32×32px minimum, 512×512px maximum. SVG is preferred for crisp scaling.

### `PWA_ICON_URL`

- **Purpose:** source image used to auto-generate the PWA install icons (192×192 and 512×512 PNG, plus maskable variants).
- **Required:** no.
- **Default:** falls back to `FAVICON_URL`, then to the default Bulwark icons.
- **Accepted values:** absolute URL or path relative to `public/`.
- **Supported formats:** SVG (recommended for best quality) or PNG (≥512×512px recommended).

### `PWA_THEME_COLOR`

- **Purpose:** color applied to the browser UI chrome when the app is installed as a PWA (address bar, Android status bar).
- **Required:** no.
- **Default:** `#ffffff`
- **Example:** `#3b82f6`

### `PWA_BACKGROUND_COLOR`

- **Purpose:** background color shown on the PWA splash screen while the app is loading.
- **Required:** no.
- **Default:** `#ffffff`
- **When to set it:** match your app's main background color.

### `PWA_SCREENSHOT_MOBILE_URL` / `PWA_SCREENSHOT_DESKTOP_URL`

- **Purpose:** screenshots shown in the browser's richer install dialog (Chrome on Android, for instance). Resized on the fly to what the manifest needs.
- **Required:** no.
- **Default:** bundled screenshots.
- **Accepted values:** absolute URL or path relative to `public/`. Both can also be overridden per hostname through `DOMAIN_BRANDING`.

## Branding: logos

### `APP_LOGO_LIGHT_URL`

- **Purpose:** logo shown in the sidebar on light backgrounds (main app, after login).
- **Required:** no.
- **Default:** empty (no sidebar logo).
- **Accepted values:** absolute URL or path relative to `public/`.
- **Supported formats:** SVG (recommended), PNG, WebP.
- **Recommended size:** 24×24px minimum, 128×128px maximum. Displayed at up to 32×32px.

### `APP_LOGO_DARK_URL`

- **Purpose:** logo shown in the sidebar on dark backgrounds (main app, after login).
- **Required:** no.
- **Default:** empty (falls back to `APP_LOGO_LIGHT_URL` if set, otherwise no logo).

## Login page customization

### `LOGIN_LOGO_LIGHT_URL`

- **Purpose:** logo shown on light backgrounds on the login page.
- **Required:** no.
- **Default:** Bulwark light logo.
- **Recommended size:** 32×32px minimum, 512×512px maximum. Displayed at 64×64px.

### `LOGIN_LOGO_DARK_URL`

- **Purpose:** logo shown on dark backgrounds on the login page.
- **Required:** no.
- **Default:** Bulwark dark logo.

### `LOGIN_COMPANY_NAME`

- **Purpose:** company or organization name shown above the version on the login page.

### `LOGIN_IMPRINT_URL`

- **Purpose:** adds an imprint / legal notice link to the login page.

### `LOGIN_PRIVACY_POLICY_URL`

- **Purpose:** adds a privacy policy link to the login page.

### `LOGIN_WEBSITE_URL`

- **Purpose:** adds a website link to the login page.

### `LOGIN_USERNAME_PLACEHOLDER`

- **Purpose:** the placeholder of the email field on the login page, such as `user@company.example`. It replaces the translated example in every language.
- **Default:** unset; each language shows its own translated example.
- **When to set it:** show users your own address format instead of a generic example domain.

### `SOURCE_CODE_URL`

- **Purpose:** where users get the source code of this build, linked from Settings > About.
- **Default:** unset (the upstream repository).
- **When to set it:** Bulwark is AGPL-3.0-only. If you run a modified build, point this at the source of exactly what you deploy (your fork, at the deployed commit). Only http(s) URLs are used.

### `ACCESSIBILITY_STATEMENT_URL` / `ACCESSIBILITY_FEEDBACK_URL` / `HELP_URL` / `EASY_READ_URL` / `SIGN_LANGUAGE_URL`

- **Purpose:** accessibility and help links. Each shows on the login page, in the settings sidebar and in the account menu, in the same place on every page (WCAG 3.2.6).
- **Default:** unset hides the link.
- **Accepted values:** http(s) URLs. The feedback link may also be an email address.
- **When to set it:** public bodies in Germany need the statement and a way to report barriers on every page (BITV 2.0 §7). Easy-read and sign-language pages are for the same audience.

### `LOGIN_LOGO_MAX_HEIGHT` / `LOGIN_LOGO_MAX_WIDTH`

- **Purpose:** cap the rendered size of the login logo. Any CSS length (`96px`, `8rem`).
- **Default:** unset; the logo renders at its natural size inside a 64×64 box.
- **When to set it:** a wide wordmark, which otherwise renders about 13px tall.

### `LOGIN_SHOW_HEADING` / `LOGIN_SHOW_SUBTITLE` / `LOGIN_SHOW_TOTP` / `LOGIN_SHOW_VERSION`

- **Purpose:** hide parts of the login page: the heading (the app name), the subtitle, the optional "I have a 2FA code" toggle, and the version number.
- **Default:** all `true`.
- **When to set it:** turn the heading and subtitle off when the logo already reads as the brand. Turn the TOTP toggle off when authentication lives in an external directory with no server-side TOTP; a server that requires TOTP still asks for it. Turn the version off so it isn't disclosed to unauthenticated visitors.

### `LOGIN_SHOW_TOKEN_LOGIN`

- **Purpose:** offers "Sign in with an access token" on the login form, which signs in with Bearer auth instead of a password.
- **Default:** `false`
- **When to set it:** for JMAP servers that authenticate API tokens instead of passwords, such as Fastmail (`JMAP_SERVER_URL=https://api.fastmail.com`).

### `LOGIN_SHOW_REMEMBER_ME`

- **Purpose:** show the "Remember me" checkbox on the login form.
- **Default:** `false` (every sign-in is remembered without asking).
- **When to set it:** set to `true` when users should choose, for example on shared computers. Sessions then end with the browser unless the box is ticked.

### `DOMAIN_BRANDING`

- **Purpose:** per-hostname overrides for the branding fields above when one deployment serves several hostnames. Matched on the request `Host` (or `X-Forwarded-Host`); `*.example.com` matches any subdomain. Exact matches win over wildcards.
- **Format:** a JSON array of objects, each with `host` and any subset of `appName`, `appShortName`, `appDescription`, `faviconUrl`, `pwaIconUrl`, `pwaThemeColor`, `pwaBackgroundColor`, `appLogoLightUrl`, `appLogoDarkUrl`, `loginLogoLightUrl`, `loginLogoDarkUrl`, `loginCompanyName`, `loginImprintUrl`, `loginPrivacyPolicyUrl`, `loginWebsiteUrl`, `loginUsernamePlaceholder`, `pwaScreenshotMobileUrl`, `pwaScreenshotDesktopUrl`, `accessibilityStatementUrl`, `accessibilityFeedbackUrl`, `helpUrl`, `easyReadUrl`, `signLanguageUrl`.
- **When to set it:** stateless deployments; the admin console manages the same list.

## Several instances

See [Running several instances](/docs/deployment/multi-instance) for the setup.

### `REDIS_URL`

- **Purpose:** a Redis-protocol server (Valkey, Redis 5+, KeyDB, Dragonfly) that every replica shares: admin config and policy, plugins, themes, branding, synced settings, plugin credentials, sign-in limits, pairing and hand-off codes, admin sessions and the audit log.
- **Required:** no. Without it Bulwark runs as one instance with its files under `/app/data`, as always.
- **Format:** `redis://:password@host:6379/0`, or `rediss://` for TLS.
- **When to set it:** to run two or more replicas behind a load balancer. The server needs `maxmemory-policy noeviction` and persistence (AOF or RDB).

### `REDIS_URL_FILE`

- **Purpose:** path to a file holding the URL, for Docker or Kubernetes secrets. `REDIS_URL` wins if both are set.

### `REDIS_KEY_PREFIX`

- **Purpose:** prefix of every key Bulwark writes.
- **Default:** `bulwark:`
- **When to set it:** when several deployments share one store server.

### `SHARED_STORE_EXPORT`

- **Purpose:** set to `1` together with `REDIS_URL` to write everything in the shared store back into the data directories in the usual file layout, then exit. The way back from several instances to one.
- **Required:** no.

### Readiness check

`GET /api/ready` answers 200 when the instance can serve and 503 while it starts or can't reach the shared store. Use it as the Kubernetes readiness probe and keep `/api/health` as the liveness probe.

## Internationalization

### `NEXT_PUBLIC_DEFAULT_LOCALE` _(build-time)_

- **Purpose:** fallback UI locale when the visitor's `Accept-Language` header matches no supported locale and no preference cookie is set.
- **Default:** `en`. An unsupported value falls back to `en`.
- **Supported:** `ar`, `ca`, `cs`, `da`, `de`, `en`, `es`, `et`, `fa`, `fr`, `he`, `hu`, `it`, `ja`, `ko`, `lv`, `mn`, `nb`, `nl`, `pl`, `pt`, `ro`, `ru`, `sk`, `th`, `tr`, `uk`, `zh`, `zh-TW`.
- **Docker note:** build your own image with `--build-arg NEXT_PUBLIC_DEFAULT_LOCALE=de`.

### `NEXT_PUBLIC_LOCALE_PREFIX` _(build-time)_

- **Purpose:** controls how the locale appears in URLs (e.g., `/en/inbox` vs `/inbox`).
- **Allowed values:** `always` (always prefix), `as-needed` (only for non-default locales), `never` (never prefix).
- **Default:** `never`
- **When to set it:** set to `always` when using `NEXT_PUBLIC_BASE_PATH` to avoid `next-intl` rewrite loops. Bulwark Lite always builds with `always`.

## Subpath and reverse proxy mount

### `NEXT_PUBLIC_BASE_PATH` _(build-time)_

- **Purpose:** mount Bulwark under a URL prefix (e.g. `https://example.com/webmail`).
- **Required:** no.
- **Default:** empty (served from the root).
- **Build-time:** unlike most other variables, this is read at **build time** because Next.js bakes it into emitted asset URLs.
- **When to set it:** set this when fronting Bulwark with a reverse proxy that exposes it under a subpath. Pair with `NEXT_PUBLIC_LOCALE_PREFIX=always` and **do not** strip the prefix at the proxy. The app expects to receive requests under `/<base-path>/...` and serves all routes (`/<base-path>/api/...`, `/<base-path>/_next/static/...`, `/<base-path>/sw.js`, etc.) accordingly.
- **Docker note:** to use this with the published image, build your own with the build arg set:
  ```bash
  docker build --build-arg NEXT_PUBLIC_BASE_PATH=/webmail -t bulwark-webmail .
  ```

## Web push

### `NEXT_PUBLIC_PUSH_RELAY_URL` _(build-time)_

- **Purpose:** the relay that turns JMAP push into web push, so self-hosters need no VAPID keys or Firebase project of their own.
- **Default:** `https://notifications.relay.bulwarkmail.org`
- **When to set it:** point at your own relay ([github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay)) to avoid the hosted one. The admin console picks the relay from an admin-defined list at runtime; this variable sets the build-time default.
- **Docker note:** setting it with `-e` on the published image does nothing for browsers, which use the relay the bundle was built with, and the Dockerfile has no build argument for it. Add your relay under User policy > Push relays in the admin console, or add an `ARG`/`ENV` line for this variable before `next build` and build your own image.

## Demo mode

### `DEMO_MODE`

- **Purpose:** serve fixture data instead of talking to a mail server. Any credentials log in.
- **Default:** `false`
- **Note:** without `JMAP_SERVER_URL` or a finished setup wizard, the wizard still comes first. Set `JMAP_SERVER_URL` to any address; demo mode doesn't use it.
- **When to set it:** demos and UI work. See [Demo mode](/docs/getting-started/demo-mode).

### `DEV_MOCK_JMAP` / `DEV_MOCK_JMAP_BULK` _(development only)_

- **Purpose:** `DEV_MOCK_JMAP=true` starts a mock JMAP server at `/api/dev-jmap` that accepts any username and password, with its own test data. `.env.dev.example` turns it on and points `JMAP_SERVER_URL` at it. `DEV_MOCK_JMAP_BULK=<n>` replaces the mock's messages with `n` generated ones, for performance work.
- **Default:** off.
- **Build-time:** the mock also needs `DEV_MOCK_JMAP` at build time, so it works under `npm run dev` or a build of your own. Release images and tarballs can't switch it on.

## Translation proxy

### `LIBRETRANSLATE_URL` / `LIBRETRANSLATE_API_KEY` / `LIBRETRANSLATE_API_KEY_FILE`

- **Purpose:** point the in-app translate action at a LibreTranslate instance instead of the public MyMemory API it defaults to, so message text stays on infrastructure you control. The API key can come from a file instead.
- **Required:** no.

## Master-user impersonation

### `BULWARK_JWT_AUTH_SECRET` / `BULWARK_STALWART_MASTER_USER` / `BULWARK_STALWART_MASTER_PASSWORD` / `BULWARK_JWT_AUTH_ISSUER`

- **Purpose:** let a trusted platform mint a signed JWT that opens a user's mailbox through a Stalwart master account, without that user's password.
- **Default:** unset. The endpoint returns 404 until the first three are all set, so the feature is fully off by default. `BULWARK_JWT_AUTH_ISSUER` defaults to `platform-api/webmail`.
- **Files:** the first three also take `_FILE` variants: `BULWARK_JWT_AUTH_SECRET_FILE`, `BULWARK_STALWART_MASTER_USER_FILE` and `BULWARK_STALWART_MASTER_PASSWORD_FILE`.
- **Security:** this grants sign-in as any mailbox on the server. Treat the secret and the master password as root credentials. The whole flow is on the [impersonation](/docs/guides/impersonation) page.

## Embedded SSO and iframe

### `AUTO_SSO_ENABLED`

- **Purpose:** automatically start the OAuth flow on the login page without user interaction.
- **Required:** no.
- **Default:** `false`
- **Dependency:** requires `OAUTH_ENABLED=true` and `OAUTH_ONLY=true`.
- **When to set it:** set to `true` when embedding Bulwark in an iframe with automatic SSO managed by a parent portal.

### `ALLOWED_FRAME_ANCESTORS`

- **Purpose:** sets the CSP `frame-ancestors` directive to allow embedding in an iframe.
- **Required:** no.
- **Default:** `'self'` only: no other site can frame the app. Bulwark always adds `'self'` (the PDF preview frames itself), and `'none'` in this variable means "no other site". The admin console and the setup wizard always send `'none'`.
- **When to set it:** set to the origin of the parent portal (e.g., `https://portal.example.com`).

### `NEXT_PUBLIC_PARENT_ORIGIN`

- **Purpose:** origin of the parent frame for validating incoming `postMessage` events.
- **Required:** no.
- **Default:** empty (the postMessage bridge stays off). It neither sends to the parent nor listens for it.
- **When to set it:** set to the origin of the parent portal when using the postMessage bridge. It is read at runtime. Set it in the environment: the Parent origin field in the admin console is saved, but in this release it doesn't reach the bridge.

## Legacy build-time fallbacks

These variables still work, but they exist for compatibility with older deployments where values were baked into the frontend bundle at build time.

### `NEXT_PUBLIC_APP_NAME`

- **Purpose:** legacy fallback for `APP_NAME`.
- **Required:** no.
- **When to use it:** only if you still depend on build-time configuration.

### `NEXT_PUBLIC_JMAP_SERVER_URL`

- **Purpose:** legacy fallback for `JMAP_SERVER_URL`.
- **Required:** no.
- **When to use it:** only if you still depend on build-time configuration.

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

Several variables that hold secrets accept a corresponding `*_FILE` variant pointing at a file containing the value: `SESSION_SECRET_FILE`, `OAUTH_CLIENT_SECRET_FILE`, `LIBRETRANSLATE_API_KEY_FILE`, `BULWARK_JWT_AUTH_SECRET_FILE`, `BULWARK_STALWART_MASTER_USER_FILE` and `BULWARK_STALWART_MASTER_PASSWORD_FILE`. `PLUGIN_SIGNING_KEY_FILE` works the same way for the plugin signing key, which has no plain variant. This is the recommended pattern when running under Docker Swarm, Kubernetes, or any orchestration platform that mounts secrets as files:

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

## Build and platform variables

These aren't configuration, but the code reads them:

- `GIT_COMMIT` - Read at build time (a Docker build argument). The commit shown in the login footer and Settings > About; without it, the build asks `git`.
- `BULWARK_BUILD` - Build label in the telemetry heartbeat. Default `release`.
- `KUBERNETES_SERVICE_HOST` - Set by Kubernetes. The telemetry heartbeat reports the platform as `k8s` when it's present.
- `NODE_ENV` - `production` in the image. Decides the `COOKIE_SECURE` default.
- `NEXT_TURBOPACK_ROOT` - Overrides the Turbopack root folder for `next build` and `next dev`. Default: the project folder.
- `NEXT_PUBLIC_APP_VERSION`, `NEXT_PUBLIC_GIT_COMMIT`, `NEXT_PUBLIC_DEV_MOCK_JMAP`, `NEXT_PUBLIC_BULWARK_LITE`, `NEXT_PUBLIC_LITE_BUILD_ID` and `NEXT_PUBLIC_LITE_TARGET` - Filled in by the build itself (the version from the `VERSION` file, the others from the variables above and the Lite build). Don't set them.
- `NEXT_RUNTIME` and `NEXT_TELEMETRY_DISABLED` - Belong to Next.js. The image turns Next.js telemetry off.

The test and tooling scripts read their own variables (`IT_*`, `A11Y_GUARD_*`, `PERF_GUARD_*`, `LITE_SMOKE_*`, `CI` and a few more). They have no effect on a running server. The Lite build reads its `LITE_*` inputs, which the [static hosting](/docs/deployment/static) page covers.
