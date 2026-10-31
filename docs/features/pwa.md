---
title: Progressive Web App
description: Install Bulwark to your home screen with a service worker and dynamic manifest.
order: 5
edition: both
---

# Progressive Web App

Bulwark ships as a Progressive Web App (PWA). Users can install it to their home screen on Android, iOS, and desktop.

## What you get

- **Installable** - Browsers offer "Add to Home Screen" / "Install app" once the manifest is detected.
- **Standalone window** - Launches without browser chrome on desktop and mobile.
- **Splash screen** - OS-rendered splash using your configured background color and icon.
- **App-name everywhere** - Browser tab title, install dialog, home screen label, and PWA manifest all use `APP_NAME` (with `APP_SHORT_NAME` for tight contexts).
- **Install screenshots** - Browsers that show a richer install dialog (e.g. Chrome on Android) display screenshots from the manifest. Bulwark ships default screenshots and lets you override them globally or per-domain.
- **Service worker** - Registered automatically. It makes the app installable and shows push notifications; it does not cache pages, so there is no offline mode.
- **Install prompt** - An in-app prompt offers to install. Users can put it off for a week ("Not now") or turn it off for good ("Don't remind me again").
- **Web push notifications** - When the user grants permission, Bulwark subscribes to web push through a push relay and surfaces new-mail notifications even when the tab is closed. Clicking the notification opens the message (or the mail list when several are new). New-mail notifications fire on new deliveries only (not flag changes), grouped per account with a "+N more" line instead of one notification per message, and spam is excluded on servers that support the JMAP `emailPush` delivery filter (Stalwart 0.16.16 or newer).
- **Unread badge** - Where the Badging API exists, the installed app's icon shows the unread count.
- **Update notice** - The server checks for new Bulwark releases shortly after start and then hourly. When one is out, admins see a dot on the admin button, and the version in the settings About card and on the sign-in page is marked, so admins know to upgrade.

## Configuration

The whole manifest is built at request time from configuration, so rebranding the install experience doesn't mean rebuilding the image. Set the values below as environment variables or in the admin console under Branding → Progressive web app; the admin console wins over environment variables, and per-domain branding wins over both.

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

Both can also be set from the admin dashboard, and overridden **per-domain** through the per-domain branding editor, so each hostname can present its own install screenshots. When unset, Bulwark falls back to its built-in screenshots.

### Default colors

If you don't set `PWA_THEME_COLOR` and `PWA_BACKGROUND_COLOR`, both default to `#ffffff`. Match `PWA_BACKGROUND_COLOR` to your app's main background to avoid a visible color flash during launch.

## Install prompt

When the browser fires the `beforeinstallprompt` event, Bulwark shows an in-app prompt:

- **Install** - triggers the native install dialog
- **Not now** - hides the prompt for a week on this browser
- **Don't remind me again** - persists the dismissal so the prompt won't reappear

The prompt also shows the app's name and logo so users see your branding (not "Bulwark") when you have customized it.

## Service worker

The service worker is served from `/sw.js` and registered on every load in production. It caches nothing: every page and all mail data come fresh from the server, so a deploy never leaves users on stale code.

## Web push notifications

When the user grants notification permission, Bulwark subscribes the browser to web push through a push relay (the hosted Bulwark relay by default, or one your admin adds under User policy → Push relays) and registers a JMAP push subscription on Stalwart that points at it. With third-party traffic switched off, only a relay the admin added is offered. Notifications:

- Fire only on new deliveries, not on flag changes or moves. Spam, Junk and muted folders stay quiet; turn on **Inbox only** in the notification settings to skip mail that a filter files into other folders too.
- Click to open the message, or the account's mail list when several messages are waiting
- Survive the tab being closed - the service worker handles delivery in the background
- Use the longer push verification timeout to avoid spurious unsubscriptions; leftover subscriptions are cleaned up automatically
- Cover your own mailboxes: mailboxes that other people share with you don't send background notifications, and the notification settings say so

On start, the app re-syncs any push registrations it already holds, so a registration created before the spam filter existed, or one whose Junk mailbox id went stale, is repaired without the user re-enabling notifications. Each device's subscription can be revoked individually from settings.

Push needs two things: Stalwart must be able to reach the push relay over HTTPS, and the browser must reach the relay and Bulwark's `/api/push/preview` (the service worker calls it to fill in sender and subject). Keep `/sw.js` reachable and uncached.

<div class="bw-note"><b>Note.</b> Bulwark Lite ships a web app manifest, so it can be added to a home screen, but it registers no service worker, so there is no web push. Push previews and generated icons are server routes that a static host cannot serve.</div>

## Reverse proxy notes

If Bulwark sits behind a reverse proxy, make sure these paths are forwarded as-is:

- `/manifest.webmanifest` - dynamic manifest
- `/sw.js` - service worker (must NOT be cached aggressively at the proxy)
- `/api/pwa-icon/*` - auto-generated PWA icons
- `/api/pwa-screenshot/*` - custom install screenshots
- `/api/push/preview` - sender and subject for push notifications
- `/branding/*` - branding assets

The service worker lives at the site root by design. If you serve Bulwark from a subpath, the service worker scope is automatically adjusted to that subpath.

## Updates

When a new Bulwark version is deployed, users get it on their next page load: the service worker caches nothing and takes over at once, so no cache busting is needed.

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
