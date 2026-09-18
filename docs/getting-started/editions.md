---
title: Editions
description: Bulwark and Bulwark Lite side by side, and how to choose.
order: 2
edition: both
---

# Editions

There is one client and two ways to ship it. **Bulwark** runs as a Node.js service, usually in a container, and its server does the things a browser cannot do on its own. **Bulwark Lite** is the same client exported as static files, served by whatever already serves your HTML, with the browser talking JMAP to Stalwart directly.

The toggle at the top of every page on this site switches the documentation between the two. Pages that apply to one edition only are hidden in the other, and say so if you land on one.

## Side by side

| | Bulwark | Bulwark Lite |
| --- | --- | --- |
| Runs as | Node.js process (Docker image, standalone tarball, or `npm start`) | Static files on any web host |
| Install | `docker run`, then a web setup wizard | Unzip, edit `config.json`, upload |
| Configuration | Wizard and admin dashboard, or environment variables | `config.json`, plus `LITE_*` build inputs for baked-in defaults |
| Mail, calendar, contacts, files | Yes | Yes |
| Global search, threads, filters, S/MIME, templates | Yes | Yes |
| Several accounts at once | Yes | Yes |
| Login | Password + TOTP, OAuth / OIDC, SSO, embedded SSO | Password + TOTP |
| "Remember me" | Encrypted server-side cookie | Stalwart refresh token in the browser |
| Themes | Yes, including uploaded ZIP bundles | Yes |
| Plugins and sidebar apps | Yes | No |
| Admin console and setup wizard | Yes | No |
| Settings sync across devices | Yes | No (export / import by hand) |
| Account security tab (password change, TOTP enrolment, app passwords) | Yes | No |
| iCal / webcal URL subscriptions, CalDAV discovery | Yes | No (`.ics` import still works) |
| Office document editing (WOPI) | Yes | No |
| Sender favicons as avatars | Yes | No (initials) |
| Register as the default mail app (`mailto:` handler) | Yes | No |
| PWA install | Yes, with service worker, web push and unread badge | Manifest only; no service worker, no push |
| Update notice | Yes, red for security releases | No; re-download the zip |
| Anonymous telemetry | Opt-in | None (nothing to send it) |
| Deep links | Yes | Yes, via host rewrite rules or the `404.html` replay |
| Mail server requirement | Stalwart with JMAP | Stalwart with JMAP and `http.permissive-cors = true` |
| Release artifact | `ghcr.io/bulwarkmail/webmail`, `bulwark-standalone-<v>-linux-<arch>.tar.gz` | `bulwark-lite-<v>.zip` |

## How to choose

Pick **Lite** if the row that matters to you is the first one: you don't want another process to run. A static folder is easier to host, back up and roll back than a service, and for a password-login deployment nothing is lost.

Pick **Bulwark** the moment you want something from the "No" column. OAuth and SSO, plugins, and settings sync are the usual reasons. The admin console is another: it is where per-hostname branding, the extension marketplace and the settings policy live.

Both editions build from the same repository and the same commit, so a feature that is browser-side in one is browser-side in the other. Switching later means swapping the deployment, not the data: mail, calendars and contacts live on Stalwart either way, and the only thing you'd carry over is the branding.

## Where each is documented

- Bulwark: [Installation](/docs/getting-started/installation), [Configuration](/docs/getting-started/configuration), [Docker](/docs/deployment/docker)
- Bulwark Lite: [Bulwark Lite](/docs/getting-started/lite), [Static hosting](/docs/deployment/static)
- Both: everything under Features, and the Stalwart, demo mode and troubleshooting pages
