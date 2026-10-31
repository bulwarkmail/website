---
title: Troubleshooting
description: The failures people actually hit, and what each one means.
order: 11
edition: both
---

# Troubleshooting

Start with the health endpoint, which tells you whether the process is up:

```bash
curl -s http://localhost:3000/api/health | jq .
```

Without sign-in it answers `healthy` while the process runs; HTTP 503 with `unhealthy` means the check itself failed. Signed in to Bulwark or the admin console, `/api/health?detailed=true` adds uptime, version, Node version and heap usage against V8's own limit, and reports `degraded` with a warning once the heap passes 85%. That is the first thing to check when a container is being OOM-killed rather than crashing outright.

## Login fails

**"CORS" or a network error on the login screen.** Bulwark tells a CORS block apart from an unreachable server: the login says the server is reachable but blocking cross-origin requests. The fix is on the Stalwart side when the two are on different origins: turn on **Permissive CORS policy** under **Settings > Network > HTTP > Security** in the web admin, or run

```bash
stalwart-cli update Http --field usePermissiveCors=true
stalwart-cli create Action/ReloadSettings
```

A `permissive-cors` line in a TOML file does nothing, because Stalwart has not read TOML configuration since 0.16.

**Bulwark Lite shows a CORS error on every login.** Lite has no server in between, so the mail server itself must allow the Lite origin: the same Permissive CORS policy in Stalwart, or a reverse-proxy rule that allows the origin with the `Authorization` and `Content-Type` headers on `/.well-known/jmap`, `/jmap/*`, `/api/auth` and `/auth/token`. Or let Stalwart serve Lite [as an Application](/docs/deployment/stalwart-app), which avoids CORS entirely.

**The Stalwart Application answers 404.** Creating the Application mounts nothing: run "update applications" (`stalwart-cli create Action/UpdateApps`) or restart Stalwart. If it still answers 404, check that `resourceUrl` downloads a zip (not an HTML page or a `releases/latest/download` URL of a release without the asset), and that the prefix is not one Stalwart routes itself, such as `/mail` or `/calendar`. The [install page](/docs/deployment/stalwart-app#choosing-the-prefix) lists them. On Stalwart 1.0 the zip must be Lite {{BULWARK_VERSION}} or newer: 1.0 refuses a bundle without a `stalwart-app.json` manifest and logs "Application bundle does not contain a manifest".

**Two-factor or SSO sign-in fails after moving to Stalwart 1.0.** Stalwart 1.0 only signs in OAuth clients it knows, and its migration tool drops 0.16's setting that let any client id through. Run **Auto-configure OAuth** on Bulwark's admin **Authentication** page, as [Upgrading to Stalwart 1.0](/docs/deployment/updating/stalwart-1-0#register-bulwark-with-stalwart) describes. Accounts that signed in with SSO or with a password and a two-factor code before the move have to sign in again in any case, because their tokens aren't migrated.

**Correct password rejected.** If OAuth is involved, check that the issuer is reachable from the Bulwark container specifically, not just from your laptop. Where the issuer's public hostname resolves to an internal address, discovery is blocked by the SSRF guard until you set `OAUTH_ALLOW_PRIVATE_ENDPOINTS=true`.

**Everyone gets logged out after a deploy.** The session secret changed. Every encrypted cookie became unreadable at once. Without `SESSION_SECRET`, Bulwark generates one in the admin state directory, so that directory needs a persistent volume. Otherwise pin the secret and mount it, ideally through `SESSION_SECRET_FILE`.

**Two-factor prompt loops.** TOTP is enforced by Stalwart, not by Bulwark. Confirm the account's TOTP state on the server.

## The mailbox tree is empty

On a brand-new account, Stalwart provisions mailboxes lazily and Bulwark retries the fetch to cover it. If the tree is still empty after that, the account is missing JMAP permissions; the Stalwart logs will say which.

## Account security panels are missing

The self-service panels (password change, TOTP, app passwords, API keys) need **Stalwart 0.16.6 or newer**, or 1.0 with Bulwark {{BULWARK_VERSION}} or newer, because they go through JMAP `x:` methods that versions before 0.16 don't expose. With Stalwart's default roles nothing else is needed; an account with a custom role needs the account password, app password, API key and public key permissions (see [Account security](/docs/guides/account-security#stalwart-permissions)).

On Stalwart 1.0 the panels say "Account security management is not available for this mail server" for users who signed in with a two-factor code or SSO until Bulwark is registered as a first-party client. Run **Auto-configure OAuth** on the admin **Authentication** page once ([details](/docs/deployment/updating/stalwart-1-0#register-bulwark-with-stalwart)).

If you still have `STALWART_API_URL` set anywhere, delete it. It pointed at a REST API that no longer exists.

## Sharing finds nobody, or free/busy is missing

**The share dialog finds nobody, and free/busy is missing.** The dialog says "No other users or groups found", or that your server doesn't allow browsing its user directory, and the event editor says "Free/busy isn't available on this server". Stalwart 1.0 answers directory lookups only when the administrator allows directory queries, and that setting is off by default. Without it, the share dialog and recipient autocomplete can only offer your groups and the people who have shared something with you. On 0.16 the setting only matters for accounts whose role lacks the principal permissions.

Turn on **Allow Directory Queries** under **Settings > Files & Sharing > Sharing** in Stalwart's web admin, or with the CLI:

```bash
stalwart-cli update Sharing --field allowDirectoryQueries=true
stalwart-cli create Action/ReloadSettings
```

If the reload reports an error, restart Stalwart instead. With the setting on, every signed-in user can list the accounts on the server.

## Sending fails with "There are too many email submissions"

**Sending fails with "There are too many email submissions, please delete some before adding a new one."** Stalwart 1.0 keeps a submission record for every message sent over JMAP and refuses new ones once an account holds 500 (the default limit). Bulwark releases before {{BULWARK_VERSION}} never delete their records, so an account stops sending after about 500 messages. Other JMAP clients can fill the limit the same way.

Upgrade Bulwark to {{BULWARK_VERSION}} or newer: it deletes the records of sent and cancelled messages, and only says "The server has too many sent-message records for this account" when that isn't enough. If an account still reaches the limit, raise it or remove it: **Submissions** under **Settings > Email > Defaults** for every account, or **Maximum number of email submissions** in an account's **Quotas** under **Management > Directory > Accounts** for one. With the CLI (`null` removes the limit):

```bash
stalwart-cli update Email --field maxSubmissions=5000
stalwart-cli create Action/ReloadSettings
```

## The calendar is empty or contact photos are missing

**On Stalwart 1.0 the calendar shows no events, or contacts have lost their photos.** Bulwark releases before {{BULWARK_VERSION}} ask Stalwart 1.0 for calendar events in a way it refuses: the calendar, tasks and reminders stay empty without an error, and creating an event reports a failure although the event was saved, so trying again makes a duplicate. Stalwart 1.0 also returns contact photos in a form those releases can't read, and saving a contact in them removes its photo on the server.

Upgrade Bulwark, or Lite, to {{BULWARK_VERSION}} or newer. Photos an older release has already removed don't come back: restore them from a backup or add them again.

## Push and notifications

**Nothing updates without a refresh.** JMAP push rides an EventSource connection, which a proxy will happily break by buffering. The connection has to stay open and unbuffered; on Nginx that means `proxy_http_version 1.1` and not buffering the response.

**Web push never arrives.** Keep `/api/push/*` and `/sw.js` reachable through the proxy, and don't let the proxy cache `/sw.js` aggressively. Notifications fire for new mail that isn't junk (or only for the Inbox when **Inbox only** is on under Settings > Notifications), so a flag change or a move produces nothing, and mailboxes other people share with you never send one.

## The setup wizard comes back after every restart

`ADMIN_CONFIG_DIR` isn't on a persistent volume, so the saved configuration and the admin password are lost with the container. Bulwark never generates an admin password: without a saved one and without `ADMIN_PASSWORD` the admin console stays off. If `JMAP_SERVER_URL` isn't set either, the setup wizard comes back and Bulwark prints a new setup token in the log. Mount the directory, then run the wizard once more or set `ADMIN_PASSWORD`.

## A Lite deep link lands on the wrong page

A URL like `/en/mail/thread/abc` is served by the shell at `/en/mail/index.html`, and the host has to be told so. Netlify and Cloudflare Pages read the shipped `_redirects`; nginx and Caddy have example configs in the zip. On a host with no rewrite rules the shipped `404.html` replays the link in the browser, with one extra page load. Details on the [static hosting](/docs/deployment/static) page.

## The Lite Application disappears after an update

**Lite served by Stalwart answers 404 after "update applications" or a restart.** "Update applications" downloads and unpacks every Application's `resourceUrl` again. If that fails, Stalwart 0.16.23 and later and 1.0 keep serving the previous bundle, but older 0.16 releases unmount the Application until a later update succeeds. After a restart, once the cached zip has expired (`autoUpdateFrequency`, on 1.0 `autoUpdateInterval`, 90 days by default), an unreachable URL leaves it unmounted on every version. The action still reports success; the failure shows only in Stalwart's log, as a resource error "Failed to unpack application for prefixes: …".

Check that `resourceUrl` downloads a zip, for example with `curl -fsSLo bundle.zip <url> && unzip -tq bundle.zip`, correct or [pin](/docs/deployment/stalwart-app#tagged-release-or-latest) it, and run "update applications" again.

## Assets 404 under a subpath

`NEXT_PUBLIC_BASE_PATH` is a build-time variable, so the published image cannot be reconfigured to a subpath at runtime; build your own with the build arg. Then leave the prefix alone at the proxy. Bulwark expects requests to arrive under `/webmail/...` and serves every route that way, so stripping the prefix breaks all of them at once. Pair it with `NEXT_PUBLIC_LOCALE_PREFIX=always` to avoid `next-intl` rewrite loops.

## A plugin does nothing after installing it

Check that plugins are switched on under Admin > Plugins > Plugin policy; they are off by default. An installed plugin is then offered to users, who turn it on in Settings > Add-ons; choose **Force on for everyone** on the plugin's page to skip that. A plugin that fails the checks is refused at install, with the reason shown.

## Dark mode mangles a message

Bulwark recolors HTML mail by luminance in dark mode, and some senders produce something unreadable through that transform. Turn on "Always show emails in light mode" globally, or flip the individual message.

## Getting help

Set `LOG_LEVEL=debug` (and `LOG_FORMAT=json` for a log collector) as environment variables while you reproduce the problem, then set it back:

```env
LOG_LEVEL=debug
LOG_FORMAT=json
```

The level applies to the whole server. In 1.19.1 the log settings in the admin console have no effect, so use the environment variables.

Then open an issue on the [tracker](https://github.com/bulwarkmail/webmail/issues) with your Bulwark version, your Stalwart version, the browser, and what you expected instead. The version numbers matter more than anything else in the report.
