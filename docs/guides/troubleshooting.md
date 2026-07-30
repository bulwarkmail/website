---
title: Troubleshooting
description: The failures people actually hit, and what each one means.
order: 11
---

# Troubleshooting

Start with the health endpoint, which answers without authentication and tells you whether the process itself is in trouble:

```bash
curl -s http://localhost:3000/api/health | jq .
```

It reports `healthy`, `degraded`, or `unhealthy`, along with uptime, version, Node version, and heap usage against V8's own limit. Heap above 85% degrades the status and above 95% marks it unhealthy, which is the first thing to check when a container is being OOM-killed rather than crashing outright.

## Login fails

**"CORS" or a network error on the login screen.** Bulwark detects a CORS misconfiguration and names the missing header rather than failing generically, so read the message before changing anything. The fix is on the Stalwart side when the two are on different origins:

```toml
[server.http]
permissive-cors = true
```

**Correct password rejected.** If OAuth is involved, check that the issuer is reachable from the Bulwark container specifically, not just from your laptop. Where the issuer's public hostname resolves to an internal address, discovery is blocked by the SSRF guard until you set `OAUTH_ALLOW_PRIVATE_ENDPOINTS=true`.

**Everyone gets logged out after a deploy.** `SESSION_SECRET` changed. Every encrypted cookie became unreadable at once. Pin the secret and mount it, ideally through `SESSION_SECRET_FILE`.

**Two-factor prompt loops.** TOTP is enforced by Stalwart, not by Bulwark. Confirm the account's TOTP state on the server.

## The mailbox tree is empty

On a brand-new account, Stalwart provisions mailboxes lazily and Bulwark retries the fetch to cover it. If the tree is still empty after that, the account is missing JMAP permissions; the Stalwart logs will say which.

## Account security panels are missing

The self-service panels (password change, TOTP, app passwords, API keys) need **Stalwart 0.16 or newer**, because they go through JMAP `x:` methods that older versions don't expose. They also need principal permissions enabled per account. [Account security](/docs/guides/account-security) has the permission table.

If you still have `STALWART_API_URL` set anywhere, delete it. It pointed at a REST API that no longer exists.

## Push and notifications

**Nothing updates without a refresh.** JMAP push rides an EventSource connection, which a proxy will happily break by buffering. The connection has to stay open and unbuffered; on Nginx that means `proxy_http_version 1.1` and not buffering the response.

**Web push never arrives.** Keep `/api/push/*` and `/sw.js` reachable through the proxy, and don't let the proxy cache `/sw.js` aggressively. Notifications also only fire on genuine inbox deliveries, so a flag change or a move deliberately produces nothing.

## The admin password resets on every restart

`ADMIN_CONFIG_DIR` isn't on a persistent volume, so the password hash goes with the container and a fresh random one is generated and logged. Mount it, then rerun the wizard or set `ADMIN_PASSWORD`.

## Assets 404 under a subpath

`NEXT_PUBLIC_BASE_PATH` is a build-time variable, so the published image cannot be reconfigured to a subpath at runtime; build your own with the build arg. Then leave the prefix alone at the proxy. Bulwark expects requests to arrive under `/webmail/...` and serves every route that way, so stripping the prefix breaks all of them at once. Pair it with `NEXT_PUBLIC_LOCALE_PREFIX=always` to avoid `next-intl` rewrite loops.

## A plugin does nothing after installing it

Plugins install disabled. That is deliberate: it means write access to the plugin directory isn't enough to get code running. Enable it from the admin dashboard. If enabling fails, the audit log records the validation failure and its reason.

## Dark mode mangles a message

Bulwark recolors HTML mail by luminance in dark mode, and some senders produce something unreadable through that transform. Turn on "Always show emails in light mode" globally, or flip the individual message.

## Getting help

Turn up the logs for the subsystem you're chasing rather than everything at once:

```env
LOG_LEVEL=debug
LOG_FORMAT=json
```

Levels can be set per category (JMAP, auth, OAuth, calendar, plugin proxy, settings sync, admin), so the rest of the app stays quiet.

Then open an issue on the [tracker](https://github.com/bulwarkmail/webmail/issues) with your Bulwark version, your Stalwart version, the browser, and what you expected instead. The version numbers matter more than anything else in the report.
