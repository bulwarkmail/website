---
title: Admin dashboard
description: Manage runtime configuration, sign-in, branding, the user policy, plugins and themes in the admin console.
order: 9
edition: full
---

# Admin dashboard

The admin dashboard runs inside the same process as the user-facing app, and it is where an operator does everything that isn't reading mail. It holds the server and sign-in settings, branding, the user policy, the Organisation pages, plugins, themes, the marketplace, updates, usage stats and the audit log. Each page has its own address under `/admin`.

API keys and app passwords are not here. Each user manages their own under **Settings > Security**; see [Account security](/docs/guides/account-security).

<div class="lite-callout">Bulwark Lite has no admin dashboard and no setup wizard. Its configuration is a <code>config.json</code> file next to <code>index.html</code>, and an optional <code>policy.json</code> for the settings policy. See <a href="/docs/deployment/static">static hosting</a>.</div>

## First-time setup

The web setup wizard runs on first launch and sets the initial admin password along with JMAP, OAuth, branding, and the session secret. Point a browser at the running container and follow the steps; nothing needs to be in `.env.local` beforehand.

`ADMIN_PASSWORD` in the environment is a bootstrap value for env-driven deployments: it is read only while `admin.json` does not exist yet, then hashed and written there. Once a password exists, change it from the dashboard.

### File-based secrets

For Docker / Kubernetes secret mounts, the JSON config supports pointing at a file instead of inlining the secret. Set these keys to the path of a file holding the value: `passwordHashFile` in `admin.json`, the other two in `config.json`. Both files are in `ADMIN_CONFIG_DIR`.

- `passwordHashFile` - admin password hash (alternative to inline `passwordHash`)
- `sessionSecretFile` - session secret (alternative to `SESSION_SECRET` / `SESSION_SECRET_FILE`)
- `oauthClientSecretFile` - OAuth client secret (alternative to `OAUTH_CLIENT_SECRET` / `OAUTH_CLIENT_SECRET_FILE`)

## Admin storage split

Admin data lives in two directories, so the operator-authored config volume can be remounted read-only once the wizard has finished:

```env
ADMIN_CONFIG_DIR=/app/data/admin        # config.json, policy.json, plugins, themes, branding uploads
ADMIN_STATE_DIR=/app/data/admin-state   # audit log, login timestamps, setup token
ADMIN_CONFIG_READONLY=true              # optional: produce clean errors instead of EROFS
```

Unset, they are `./data/admin` and `./data/admin-state`. If you set only `ADMIN_CONFIG_DIR`, state goes to `ADMIN_CONFIG_DIR/state`, so set `ADMIN_STATE_DIR` as well before you mount the config dir read-only. Existing pre-1.6.4 installs using the legacy single `ADMIN_DATA_DIR` continue to work without migration.

```yaml
volumes:
  - bulwark-config:/app/data/admin            # rw during setup
  # - bulwark-config:/app/data/admin:ro       # ro after the wizard completes
  - bulwark-state:/app/data/admin-state       # always rw
```

Without a persistent volume a restart loses `admin.json` and `config.json`. Bulwark then takes the password from `ADMIN_PASSWORD` again. Without that variable there is no admin password, and only a Stalwart administrator can get in, through `STALWART_ADMIN_ACCESS=auto` (see below). If `JMAP_SERVER_URL` isn't set either, the setup wizard runs again with a new token in the logs. Losing the state dir also loses a session secret Bulwark generated, which signs everyone out.

## Signing in

The admin dashboard lives at `/admin` (below the base path if you set one). It uses a separate session from the user app, so you can be signed in as both a regular user and an admin in the same browser.

What a Stalwart administrator account is worth here is configurable, under **Authentication** in the dashboard or with `STALWART_ADMIN_ACCESS`:

| Value | Effect |
| --- | --- |
| `auto` (default) | Stalwart admins see the admin shield in the app and are signed into `/admin` without the Bulwark admin password |
| `password` | Stalwart admins see the shield but must enter the Bulwark admin password like everyone else |
| `off` | Stalwart admin status is ignored; `/admin` is reachable only through `/admin/login` with the admin password |

`password` and `off` need an admin password to exist, from the wizard or `ADMIN_PASSWORD`, or the dashboard would have no way in.

Admin sessions are protected with:

- Strict session secret length validation
- Configurable TTL via `ADMIN_SESSION_TTL`
- Configurable trusted-proxy depth via `TRUSTED_PROXY_DEPTH` for accurate client IP attribution
- All admin actions are written to the audit log

## Sections

<img class="theme-light-only" src="/screenshots/light-admin-overview.webp" alt="The admin dashboard: server details and enabled features, with the section list on the left" width="2560" height="1440" />
<img class="theme-dark-only" src="/screenshots/dark-admin-overview.webp" alt="The admin dashboard: server details and enabled features, with the section list on the left" width="2560" height="1440" />

The sidebar starts with Overview, Server, Authentication, Branding and User policy. Under **Organisation** are Domains and groups, Signatures, Templates, Security and Sharing; under **Extensions**, Plugins, Themes and Marketplace; under **System**, Updates, Usage stats and Audit log.

### Overview

Warnings that need attention, the number of accounts, plugins and themes, the running version, the server details (application, JMAP server, last admin login, whether settings sync, OAuth and the Stalwart integration are on) and the latest admin actions.

### Server, Authentication and Branding

Override runtime config without redeploying. These pages write to `ADMIN_CONFIG_DIR/config.json` (same file the setup wizard populates). Most of the keys below are on **Server**; the OAuth, SSO, admin access and framing keys are on **Authentication**, and the images and company details on **Branding**. Admin-managed values fill these keys:

- `appName`
- `jmapServerUrl`, plus the `jmapServers` list for multi-server deployments
- `oauthEnabled`, `oauthOnly`, `oauthClientId`, `oauthIssuerUrl`
- `stalwartFeaturesEnabled`, and separately `stalwartJmapPassthroughEnabled`, the server-side switch for the credential-bearing Stalwart JMAP passthrough. Turn it off to keep the client features but block the passthrough route entirely (env: `STALWART_JMAP_PASSTHROUGH_ENABLED`)
- `stalwartAdminAccess` (see above)
- `settingsSyncEnabled`
- `allowedFrameAncestors`
- `parentOrigin`
- Branding (favicon, app and login logos, login company info)
- Demo mode
- `allowCustomJmapEndpoint`
- `autoSsoEnabled`
- `searchEngineIndexing` - allow search engines to index the webmail. Off by default (emits `noindex`/`nofollow` in the page head); recommended off for private deployments. Env override: `SEARCH_ENGINE_INDEXING`.

Order of precedence: **admin config > env var > legacy build-time fallback > built-in default**. A value saved here wins over the same key in `.env.local`; the dashboard shows where each value currently comes from (admin, environment, or default). Changes from the admin UI take effect on the next user session without a restart.

### User policy

Which features users get, the push relays they may pick (from your list, rather than typed as a free URL), the default sidebar apps every user gets in addition to the ones they pin themselves, and the settings to lock, hide or preset. These are stored in `policy.json`, not `config.json`. The Organisation pages add per-domain and per-group settings; see [Organisation settings](/docs/guides/organisation).

### Plugins

<img class="theme-light-only" src="/screenshots/light-admin-plugins.webp" alt="The Plugins section of the admin dashboard" width="2560" height="1440" />
<img class="theme-dark-only" src="/screenshots/dark-admin-plugins.webp" alt="The Plugins section of the admin dashboard" width="2560" height="1440" />

- Install plugins from the [marketplace](/docs/guides/marketplace) (the official directory unless `EXTENSION_DIRECTORY_URL` points elsewhere) or upload a ZIP. Plugins installed here are for every user.
- Plugins as a whole are off until you turn on **Plugins** under **Plugin policy**.
- Users can also upload plugins for their own account while **Users may upload plugins** is on (the default). With **Require approval** (also the default) each upload stays off until an admin approves it under **Approval requests**.
- Turn an installed plugin on or off, or open it and turn on **Force on for everyone** so users can't turn it off.
- Settings you save on a plugin's page apply to every user.
- Review each plugin's manifest, declared permissions, `frameOrigins`, and `httpOrigins`.
- Inline plugin config panel - configure without leaving the page.
- Hot-reload and `PLUGIN_DEV_DIR` dev-folder loading for live plugin development (esbuild bundles `src/` on demand).

See [Plugins](/docs/guides/plugins) for the full architecture.

### Themes

- Upload theme ZIP bundles, or install them from the marketplace, for every user. Users can upload their own themes while **Users may upload themes** is on (the default).
- Turn installed themes on or off, or force one on for everyone.
- Set the default theme and colour mode, lock the colour mode, and hide the themes you don't want users to pick under **Offered to users**.
- Theme API v2, with a token compiler and a skin slot.

### Audit log

Every admin action (sign-in, config and policy changes, plugin and theme changes) is recorded. **Audit log** shows the time, the action, its details (old and new values for config changes) and the client IP (after `TRUSTED_PROXY_DEPTH` resolution).

### OAuth auto-setup

Where the Stalwart server supports it, a dialog validates the origin and issuer URLs and configures the OAuth client end to end, which gets SSO working without hand-editing config. It is under **Authentication**, **OAuth / OpenID Connect**, as **Set up automagically**, and needs you signed in to the webmail with a Stalwart account that has admin permissions.

On Stalwart 1.0, run it once even if you don't use SSO. It registers Bulwark as a first-party client, which 1.0 requires before users who sign in with a two-factor code can reach their account security settings. Turn **Enabled** off afterwards if you don't want the SSO button. See [Upgrading to Stalwart 1.0](/docs/deployment/updating/stalwart-1-0#register-bulwark-with-stalwart).

On Stalwart 1.0 the setup also registers a client for Bulwark Mobile: `bulwark-mobile`, first-party, with no secret and the redirect URI `org.bulwarkmail.mobile:/auth/callback`. The app signs in through it and can then show the account security settings. Without it the app registers a client of its own, which reaches mail, contacts, calendars and files but not those settings. Don't add the app's redirect URI to the `bulwark-webmail` client instead: that client has a secret the app can't send, so its sign-in fails.

### Usage stats

**Usage stats** (under System) shows the exact JSON the next heartbeat would send, turns heartbeats on or off, sends one now while they are on (**Send now**), changes the collector URL and shows when the last one went out. Setting `BULWARK_TELEMETRY` in the environment, to either value, locks the choice and greys out the toggle; no-third-party mode locks it off. See [Anonymous usage stats](/docs/features/telemetry) for the full schema.

## Behind a reverse proxy

If Bulwark sits behind multiple reverse proxies, set `TRUSTED_PROXY_DEPTH` so audit logs and rate-limiting see the real client IP:

```env
TRUSTED_PROXY_DEPTH=2   # CDN -> ingress -> app
```

## Restricting access

The dashboard is part of the running Bulwark process, so it cannot be turned off. Restrict it instead:

- Block `/admin` and `/api/admin` at your reverse proxy and only allow your management network.
- Use a strong admin password and change it from time to time with **Change password** in the console. Changing `ADMIN_PASSWORD` later has no effect once `admin.json` exists.
- Keep it off the public internet in production. A VPN or an IP allowlist is the right gate.

## Troubleshooting

### "Admin password reset on restart"

You haven't mounted a persistent volume for `ADMIN_CONFIG_DIR` (or `ADMIN_DATA_DIR` on legacy installs), so the password hash file is lost on container recreation. Mount the volume and either rerun the setup wizard or (re)set `ADMIN_PASSWORD`.

### "Settings > Security missing"

Account security, API keys and app passwords are user settings, not admin pages. They need Stalwart 0.16 or newer, `STALWART_FEATURES` and the JMAP passthrough (`STALWART_JMAP_PASSTHROUGH_ENABLED`) left on (both are on by default), and on Stalwart 1.0 Bulwark {{BULWARK_VERSION}} or newer with [OAuth auto-setup](#oauth-auto-setup) run once. Stalwart versions before 0.16 do not expose the JMAP `x:` methods Bulwark uses for self-service management.

### "Admin login fails with correct password"

Check that `SESSION_SECRET` hasn't changed since you last signed in (which would invalidate stored sessions) and that the admin data directory is on a writable filesystem.
