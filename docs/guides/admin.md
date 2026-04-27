---
title: Admin Dashboard
description: Manage runtime configuration, plugins, themes, API keys, and policy from a single place.
order: 9
---

# Admin Dashboard

The admin dashboard is Bulwark's control plane. It runs alongside the user-facing app and gives administrators a single place to manage runtime configuration, plugins and themes, the extension marketplace, Stalwart API keys, app password IP allowlists, and audit logs.

## First-Time Setup

On first startup, Bulwark generates a random admin password and logs it to stdout. Set `ADMIN_PASSWORD` in your environment so you can pick a known password and ensure it survives restarts:

```env
ADMIN_PASSWORD=replace-with-a-strong-admin-password
ADMIN_DATA_DIR=/app/data/admin
```

Also mount `ADMIN_DATA_DIR` as a persistent volume so the password hash, plugin registry, runtime config overrides, and audit log survive container recreation. Without a persisted volume, every restart generates a new random admin password.

```yaml
volumes:
  - bulwark-admin:/app/data/admin
```

## Signing In

The admin dashboard lives at `/admin` (or `/<locale>/admin`). It uses a separate session from the user app, so you can be signed in as both a regular user and an admin in the same browser.

Admin sessions are protected with:

- Strict session secret length validation
- Configurable TTL via `ADMIN_SESSION_TTL`
- Configurable trusted-proxy depth via `TRUSTED_PROXY_DEPTH` for accurate client IP attribution
- All admin actions are written to the audit log

## Sections

### Overview

Health summary, version, last successful update check, plugin and theme counts, and recent audit log entries.

### Configuration

Override runtime config without redeploying. The admin dashboard writes to `data/admin/config.json`, which takes precedence over environment variables for these keys:

- `appName`
- `jmapServerUrl`
- `oauthEnabled`, `oauthOnly`, `oauthClientId`, `oauthIssuerUrl`
- `stalwartFeaturesEnabled`
- `settingsSyncEnabled`
- `allowedFrameAncestors`
- `parentOrigin`
- Branding (favicon, app and login logos, login company info)
- Demo mode
- `allowCustomJmapEndpoint`
- `autoSsoEnabled`

This means you can re-brand or flip a feature on without restarting the container. Changes take effect on the next user session.

### Plugins

- Browse the [marketplace](/docs/guides/marketplace) (when `EXTENSION_DIRECTORY_URL` is set) or upload ZIPs directly.
- Force-enable or force-disable plugins for all users.
- Lock plugin settings (admin locks) so users cannot override them.
- Apply managed policy across the whole deployment.
- Review each plugin's manifest, declared permissions, and `frameOrigins`.

See [Plugins](/docs/guides/plugins) for the full architecture.

### Themes

- Upload theme ZIP bundles.
- Force-enable or force-disable themes.
- Lock the theme (e.g., enforce a corporate dark theme).

### API Keys (Stalwart 0.16+)

- Create, list, and revoke Stalwart API keys.
- Each key is shown once at creation; revoke and recreate if you lose it.
- Useful for scripting, monitoring, and integrations against Stalwart.

### App Password Policy (Stalwart 0.16+)

- Manage IP allowlists per app password.
- Useful when you need to restrict an IMAP/SMTP credential to a specific datacenter or VPN.

### Audit Log

Every admin action — sign in, plugin enable/disable, config change, theme upload, API key creation — is recorded. The log shows actor, action, target, and IP (after `TRUSTED_PROXY_DEPTH` resolution).

### Policy Sections

Stalwart-specific policy areas surfaced in the dashboard, including authentication policy and OAuth client configuration. Available when `STALWART_FEATURES=true` and Stalwart 0.16+ is connected.

### OAuth Auto-Setup

If your Stalwart server supports it, the dashboard offers OAuth auto-setup: a wizard validates origin and issuer URLs and configures the OAuth client end-to-end. Useful for getting SSO working without hand-editing config.

## Behind a Reverse Proxy

If Bulwark sits behind multiple reverse proxies, set `TRUSTED_PROXY_DEPTH` so audit logs and rate-limiting see the real client IP:

```env
TRUSTED_PROXY_DEPTH=2   # CDN -> ingress -> app
```

## Disabling the Admin Dashboard

The admin dashboard is part of the running Bulwark process. To restrict access:

- Block `/admin` and `/api/admin` at your reverse proxy and only allow your management network.
- Use a strong `ADMIN_PASSWORD` and rotate periodically.
- Don't expose the admin dashboard on the public internet for production deployments — gate it behind a VPN or IP allowlist when possible.

## Troubleshooting

### "Admin password reset on restart"

You haven't mounted a persistent volume for `ADMIN_DATA_DIR`, so the password hash file is lost on container recreation. Mount the volume and (re)set `ADMIN_PASSWORD`.

### "Account security / API keys / app password panels missing"

These require Stalwart 0.16+. Older Stalwart versions do not expose the JMAP `x:` methods Bulwark uses for self-service management.

### "Admin login fails with correct password"

Check that `SESSION_SECRET` hasn't changed since you last signed in (which would invalidate stored sessions) and that the admin data directory is on a writable filesystem.
