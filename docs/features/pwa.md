---
title: Progressive Web App
description: Install Bulwark to your home screen with a service worker and dynamic manifest.
order: 5
edition: both
---

# Progressive Web App

Bulwark ships as a Progressive Web App (PWA). Users can install it to their home screen on Android, iOS, and desktop.

## What you get

- **Installable:** browsers offer "Add to Home Screen" / "Install app" once the manifest is detected.
- **Standalone window:** launches without browser chrome on desktop and mobile.
- **Splash screen:** OS-rendered splash using your configured background color and icon.
- **App-name everywhere:** browser tab title, install dialog, home screen label, and PWA manifest all use `APP_NAME` (with `APP_SHORT_NAME` for tight contexts).
- **Install screenshots:** browsers that show a richer install dialog (e.g. Chrome on Android) display screenshots from the manifest. Bulwark ships default screenshots and lets you override them globally or per-domain.
- **Service worker:** registered automatically. It makes the app installable and shows push notifications. It caches nothing unless a user turns on [offline mode](/docs/features/email/offline) on that device; then it keeps the app's files so Bulwark also opens without a connection.
- **Install prompt:** an in-app prompt offers to install. Users can put it off for a week ("Not now") or turn it off for good ("Don't remind me again").
- **Web push notifications:** when the user grants permission, Bulwark subscribes to web push through a push relay and shows new-mail notifications even when the tab is closed. Clicking the notification opens the message (or the mail list when several are new). New-mail notifications fire on new deliveries only (not flag changes), grouped per account with a "+N more" line instead of one notification per message, and spam is excluded on servers that support the JMAP `emailPush` delivery filter (Stalwart 0.16.16 or newer).
- **Unread badge:** where the Badging API exists, the installed app's icon shows the unread count.
- **Update notice:** the server checks for new Bulwark releases shortly after start and then hourly. When one is out, admins see a dot on the admin button, and the version in the settings About card and on the sign-in page is marked, so admins know to upgrade.

## Configuration

Bulwark builds the whole manifest at request time from configuration, so you can rebrand the installed app without rebuilding the image. Set the values below as environment variables or in the admin console under Branding → Progressive web app; the admin console wins over environment variables, and per-domain branding wins over both.

```env
APP_NAME=Acme Mail                 # Used in the manifest, browser tab, and SoftwareApplication metadata
APP_SHORT_NAME=Acme                # Home screen label
APP_DESCRIPTION=Acme webmail       # Description in the install dialog

PWA_ICON_URL=/branding/acme.svg    # Source icon (resized to 192 and 512 px PNGs on the fly)
FAVICON_URL=/branding/acme.svg     # Browser tab icon (PWA_ICON_URL falls back to this)

PWA_THEME_COLOR=#0f172a            # Browser UI chrome (Android status bar)
PWA_BACKGROUND_COLOR=#ffffff       # Splash screen background
```

### Auto-generated icons

Bulwark serves the icon sizes the manifest needs from a single source: it resizes your icon to 192×192 and 512×512 PNGs at `/api/pwa-icon/192` and `/api/pwa-icon/512` and lists them for both regular and maskable use. Leave room around the artwork so a maskable crop doesn't clip it. Without a custom icon, the manifest uses the bundled Bulwark icons, which include light and dark maskable variants.

If `PWA_ICON_URL` is not set, the app falls back to `FAVICON_URL`, then to the bundled Bulwark icons.

### Install screenshots

Browsers with a richer install UI render screenshots from the manifest. Override the bundled defaults with your own (resized on the fly to the required sizes):

```env
PWA_SCREENSHOT_MOBILE_URL=/branding/install-mobile.png    # rendered at 540x720
PWA_SCREENSHOT_DESKTOP_URL=/branding/install-desktop.png  # rendered at 1280x720
```

Both can also be set from the admin console, and overridden **per-domain** through the per-domain branding editor, so each hostname can show its own install screenshots. When unset, Bulwark falls back to its built-in screenshots.

### Default colors

If you don't set `PWA_THEME_COLOR` and `PWA_BACKGROUND_COLOR`, both default to `#ffffff`. Match `PWA_BACKGROUND_COLOR` to your app's main background to avoid a visible color flash during launch.

## Install prompt

When the browser fires the `beforeinstallprompt` event, Bulwark shows an in-app prompt:

- **Install:** triggers the native install dialog
- **Not now:** hides the prompt for a week on this browser
- **Don't remind me again:** remembers the choice, so the prompt doesn't come back

The prompt also shows the app's name and logo so users see your branding (not "Bulwark") when you have customized it.

## Service worker

The service worker is served from `/sw.js` and registered on every load in production, as `/sw.js?v=<build id>`. Every build has its own id, so a deploy installs a new worker.

Without offline mode it caches nothing: every page and all mail come fresh from the server. When a user turns on **Keep mail on this device** ([offline mode](/docs/features/email/offline)), the worker keeps the files of the running build in a cache named after that build (`bulwark-shell-<build id>`): pages network first (the kept copy only when the network fails), the content-hashed files under `/_next/static/` from the cache. A tab of an older build still finds that build's files after a deploy, and a build's cache is deleted once no open tab uses it. The mail itself is kept by the page in IndexedDB, encrypted, not by the worker. Signing out deletes both. Admins can forbid offline mode: see [Offline mode](/docs/guides/organisation/offline-mode).

## Web push notifications

When the user grants notification permission, Bulwark subscribes the browser to web push through a push relay (the hosted Bulwark relay by default, or one your admin adds under User policy → Push relays) and registers a JMAP push subscription on Stalwart that points at it. With third-party traffic switched off, only a relay the admin added is offered. Notifications:

- Fire only on new deliveries, not on flag changes or moves. Spam, Junk and muted folders stay quiet; turn on **Inbox only** in the notification settings to skip mail that a filter files into other folders too.
- Click to open the message, or the account's mail list when several messages are waiting
- Survive the tab being closed: the service worker handles delivery in the background
- Wait up to 75 seconds for the mail server to verify a new subscription, longer than the 60 seconds Stalwart leaves between verifications by default, so setup still succeeds when older subscriptions are queued ahead of it; leftover subscriptions are cleaned up automatically
- Cover your own mailboxes: mailboxes that other people share with you don't send background notifications, and the notification settings say so

On start, the app re-syncs any push registrations it already holds, so a registration created before the spam filter existed, or one whose Junk mailbox id went stale, is repaired without the user re-enabling notifications. Each device's subscription can be revoked individually from settings.

Your organisation can keep sender and subject out of notifications ([device policies](/docs/guides/organisation/device-policies)): they then say only "New mail" or how many messages are unread, and Bulwark's server doesn't read the sender, subject or text for them at all. This covers the web app, not the Bulwark mobile app yet. It can also hold back the install prompt; the browser's menu can still install Bulwark.

Push needs two things: Stalwart must be able to reach the push relay over HTTPS, and the browser must reach the relay and Bulwark's `/api/push/preview` (the service worker calls it to fill in sender and subject). Keep `/sw.js` reachable and uncached.

<div class="bw-note"><b>Note.</b> Bulwark Lite ships a web app manifest, so it can be added to a home screen, but it registers no service worker, so there is no web push and no offline mode. Push previews and generated icons are server routes that a static host cannot serve.</div>

## Reverse proxy notes

If Bulwark sits behind a reverse proxy, make sure these paths are forwarded as-is:

- `/manifest.webmanifest` - dynamic manifest
- `/sw.js` - service worker (must NOT be cached aggressively at the proxy; the query string carries the build id)
- `/api/version` - the build the server runs, for the reload prompt after a deploy
- `/api/offline/shell` - the files of the running build, for offline mode
- `/api/pwa-icon/*` - auto-generated PWA icons
- `/api/pwa-screenshot/*` - custom install screenshots
- `/api/push/preview` - sender and subject for push notifications
- `/branding/*` - branding assets

The service worker lives at the site root by design. If you serve Bulwark from a subpath, the service worker scope is automatically adjusted to that subpath.

## Updates

When a new Bulwark version is deployed, users get it on their next page load. Tabs that stay open ask `/api/version` which build the server runs, when they get focus and every 15 minutes, and right away when one of their files fails to load. When it is another build, they show **A new version of Bulwark is ready** with a **Reload** button. Until then such a tab keeps working with its own build's files; with offline mode on they come from the worker's cache, so a deploy never mixes the files of two builds. Lite shows the same prompt, comparing with `lite-build.json`.

Separately, the server checks version.telemetry.bulwarkmail.org about 30 seconds after start and then every hour (turn it off with `BULWARK_UPDATE_CHECK=off`). When a newer release exists, it logs it, admins see a dot on the admin button in the navigation rail, the About card in settings tags the version, and the sign-in page's version line says "New version available" or, in red, "Security update available". Deploying the new version is up to the admin. Lite has no update check.

## Troubleshooting

### "Install" option doesn't appear

- Confirm the site is served over HTTPS (the only exception is `http://localhost`).
- Confirm `/manifest.webmanifest` returns a 200 with valid JSON.
- Confirm the service worker is registered (`/sw.js` returns 200, scope is correct).
- Some browsers (notably iOS Safari) only offer install via Share → Add to Home Screen.

### Wrong icon or name shows up after install

PWA installs are cached by the OS. Uninstall the existing app and reinstall after changing `APP_NAME`, `APP_SHORT_NAME`, `PWA_ICON_URL`, or related variables.

### Splash screen flashes the wrong color

Set `PWA_BACKGROUND_COLOR` to match your initial background and reinstall the PWA.

## Next step

For the native phone app instead of the PWA, see [Mobile apps and push](/docs/features/mobile).
