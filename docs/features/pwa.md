---
title: Progressive Web App
description: Install Bulwark to your home screen with a service worker and dynamic manifest.
order: 5
---

# Progressive Web App

Bulwark ships as a Progressive Web App (PWA). Users can install it to their home screen on Android, iOS, and desktop, and the service worker keeps the app shell ready for fast subsequent loads.

## What you get

- **Installable** - Browsers offer "Add to Home Screen" / "Install app" once the manifest is detected.
- **Standalone window** - Launches without browser chrome on desktop and mobile.
- **Splash screen** - OS-rendered splash using your configured background color and icon.
- **App-name everywhere** - Browser tab title, install dialog, home screen label, and PWA manifest all use `APP_NAME` (with `APP_SHORT_NAME` for tight contexts).
- **Install screenshots** - Browsers that show a richer install dialog (e.g. Chrome on Android) display screenshots from the manifest. Bulwark ships default screenshots and lets you override them globally or per-domain.
- **Service worker** - Registered automatically; caches the app shell.
- **Install prompt** - An in-app prompt offers to install. Users can dismiss it for the session or choose "don't remind me again".
- **Web push notifications** - When the user grants permission, Bulwark subscribes to web push and surfaces new-inbox-mail notifications even when the tab is closed. Clicking the notification opens the message. New-mail notifications are scoped to genuine inbox deliveries (not flag changes).
- **Update detection** - The service worker detects the changed app shell on the next load and refreshes the cache. Bulwark additionally performs a server-side update check on startup and shows a non-dismissible in-app update notice when a new release is available.

## Configuration

The whole manifest comes from runtime environment variables, so rebranding the install experience doesn't mean rebuilding the image.

```env
APP_NAME=Acme Mail                 # Used in the manifest, browser tab, and SoftwareApplication metadata
APP_SHORT_NAME=Acme                # Home screen label
APP_DESCRIPTION=Acme webmail       # Description in the install dialog

PWA_ICON_URL=/branding/acme.svg    # Source icon (auto-generates 192/512 PNG + maskable variants)
FAVICON_URL=/branding/acme.svg     # Browser tab icon (PWA_ICON_URL falls back to this)

PWA_THEME_COLOR=#0f172a            # Browser UI chrome (Android status bar)
PWA_BACKGROUND_COLOR=#ffffff       # Splash screen background
```

### Auto-generated icons

Bulwark generates the required PWA icon sizes from a single source:

- `icon-192x192.png` and `icon-512x512.png` - regular
- `icon-maskable-light-192x192.png` / `icon-maskable-light-512x512.png` - maskable for light backgrounds
- `icon-maskable-dark-192x192.png` / `icon-maskable-dark-512x512.png` - maskable for dark backgrounds

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
- **Later** - dismisses the prompt for this session
- **Don't remind me again** - persists the dismissal so the prompt won't reappear

The prompt also shows the app's name and logo so users see your branding (not "Bulwark") when you have customized it.

## Service worker

The service worker is served from `/sw.js` and registered on first load. It precaches the app shell and serves it on subsequent visits, which makes navigation between pages fast even on slow networks. Mail data itself is always fetched fresh from the JMAP server.

## Web push notifications

When the user grants notification permission, Bulwark subscribes the browser to web push and uses the JMAP push verification handshake to receive real-time new-mail pings. Notifications:

- Fire only on **genuine inbox deliveries**, not on flag changes or moves
- Click to jump directly to the message
- Survive the tab being closed - the service worker handles delivery in the background
- Use the longer push verification timeout to avoid spurious unsubscriptions; leftover subscriptions are cleaned up automatically

If you self-host behind a reverse proxy, keep the `/api/push/*` and `/sw.js` paths reachable so the verification handshake can complete.

## Reverse proxy notes

If Bulwark sits behind a reverse proxy, make sure these paths are forwarded as-is:

- `/manifest.webmanifest` - dynamic manifest
- `/sw.js` - service worker (must NOT be cached aggressively at the proxy)
- `/api/pwa-icon/*` - auto-generated PWA icons
- `/branding/*` - branding assets

The service worker lives at the site root by design. If you serve Bulwark from a subpath, the service worker scope is automatically adjusted to that subpath.

## Updates

When a new Bulwark version is deployed, the service worker detects the changed app shell and refreshes the cache on the next load. No manual cache busting is needed.

Bulwark additionally performs a **server-side update check on startup** that logs to stderr and surfaces an **in-app, non-dismissible update notice** when a newer release is available. The notice provides a one-click refresh that picks up the new service worker; in dev it dynamically reloads without a full page navigation.

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
