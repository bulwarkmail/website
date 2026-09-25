---
title: Bulwark Lite
description: The same webmail as static files, with no Node.js process to run.
order: 3
edition: lite
---

# Bulwark Lite

Bulwark Lite is Bulwark Webmail exported as static files. Same mail, calendar, contacts and files client, same themes, same keyboard shortcuts, minus the Node.js server. You upload a folder to any web host, tell it where your Stalwart is, and the browser does the rest. Or you skip the web host too, and let Stalwart serve it [as an Application](/docs/deployment/stalwart-app).

It exists because the full edition's server does two different jobs. One is brokering things the browser cannot do alone: OAuth, the admin console, plugins, settings sync. The other is just serving files. If you don't need the first job, Lite lets you skip the process entirely and put the second one on the static host you already have.

## When to choose it

Lite is the right pick when:

- You already run a web server and would rather not add a Node.js process, a container, or anything with a health check to it.
- Your users sign in with a password, optionally with TOTP, and nobody needs OAuth or single sign-on.
- You don't need the admin console, plugins, or settings that follow a user between devices.
- You want the deployment to be a folder you can diff, back up, and roll back by re-uploading.

The full edition is the right pick when you want any of: the setup wizard and admin dashboard, plugins and sidebar apps, OAuth / OIDC, settings sync, office document editing, web push notifications, or the in-app update notice. The [editions page](/docs/getting-started/editions) lays the two out side by side.

## What works

Everything that runs in the browser, which is most of the client:

- Mail, threads, search, compose, drafts, scheduled send, filters and the vacation responder, S/MIME
- Calendar, contacts and files, including sharing over JMAP
- Several accounts at once, each with its own session
- Password login, with a TOTP code where the server asks for one
- "Remember me", implemented with Stalwart's own refresh tokens rather than a server-side cookie
- Themes, the settings pages, settings export and import
- Deep links: `/en/mail/thread/<id>`, `/en/calendar/day/2026-08-06` and the rest all open directly
- Demo mode, with a built-in demo account and no server at all

## What is off

These need the Node.js server, so the static build hides or disables them:

- The setup wizard and the admin console. Configuration is a `config.json` file instead.
- Plugins and sidebar apps. Themes still work.
- Settings sync across devices. Settings stay in the browser, and can be exported and imported by hand.
- OAuth / OIDC and single sign-on, including embedded SSO.
- The account security tab: changing the password, enrolling TOTP, app passwords, API keys.
- iCal / webcal URL subscriptions and CalDAV discovery. Importing an `.ics` file still works.
- Sender favicons as avatars. Lite shows initials.
- Office document editing (WOPI).
- Web push notifications, and with them the unread badge on an installed icon. There is no service worker at all.
- The in-app update notice, and the anonymous telemetry heartbeat.
- Device pairing, and registering Bulwark as the system's default mail app (the "Default apps" protocol handler).

`scripts/lite/lib.mjs` in the repository is the list the build is checked against: any client code that references a server endpoint not documented there fails the export.

## How it gets its configuration

The zip ships with `config.json` next to `index.html`. It is read at runtime, so a text editor and a re-upload are the whole change process:

```json
{
  "appName": "Bulwark Webmail",
  "jmapServerUrl": "https://mail.example.com",
  "allowCustomJmapEndpoint": false,
  "rememberMeEnabled": true,
  "demoMode": false
}
```

Branding keys (`loginLogoLightUrl`, `loginCompanyName`, the `loginShow*` toggles and so on) use the same names as the full edition's environment variables, camel-cased. The full list, and the `LITE_*` inputs that bake defaults into a build, are on the [static hosting](/docs/deployment/static) page.

## The one server-side requirement

The browser talks to Stalwart directly, from the origin your static host serves. Stalwart has to allow that (unless Stalwart serves Lite itself as an [Application](/docs/deployment/stalwart-app): then it is the same origin and nothing needs allowing):

```toml
[http]
permissive-cors = true
```

Or the equivalent reverse-proxy rule that allows your Lite origin with the `Authorization` and `Content-Type` headers on `/.well-known/jmap`, `/jmap/*`, `/api/auth` and `/auth/token`. Without it every login fails with a CORS error, and Bulwark names the missing header on the login screen rather than failing generically.

## Where to get it

- Every [release](https://github.com/bulwarkmail/webmail/releases) attaches `bulwark-lite-<version>.zip`, built for the site root with no server URL baked in. Edit `config.json` and upload.
- Releases from 1.11 on also attach `bulwark-lite-stalwart.zip`, a bundle that Stalwart 0.16.6 or newer downloads and serves itself (Stalwart 1.0 from Lite {{BULWARK_VERSION}} on). See [Install on Stalwart](/docs/deployment/stalwart-app).
- The **Build Static Lite** workflow in the repository can be dispatched by hand with a fixed server URL, an app name, a sub-path mount, a locale subset, or the demo flag, and produces a zip tailored to one deployment.
- Or build it locally with `npm run build:lite` in a disposable checkout; the [static hosting](/docs/deployment/static) page has the exact commands.

## Security notes

- There are no cookies and no server session. Requests to the mail server carry the token or credentials of the signed-in account only.
- "Remember me" keeps a Stalwart refresh token in the browser's `localStorage` (a token, never the password). Without it the token lives in `sessionStorage` and the session ends with the tab. Both are readable by any script on your Lite origin, so serve Lite from an origin you control and keep the Content-Security-Policy the zip ships in `_headers`.
- Servers without Stalwart's token login fall back to Basic auth. "Remember me" is then hidden, and the credentials stay in `sessionStorage` for the lifetime of the tab so a reload does not sign you out.
- The export contains inline hydration scripts, so `script-src` has to allow `'unsafe-inline'`. Email HTML is still sanitised and rendered in a sandboxed frame, exactly as in the full build.

## Related pages

- [Static hosting](/docs/deployment/static) - build inputs, `config.json`, host snippets
- [Install on Stalwart](/docs/deployment/stalwart-app) - let Stalwart serve Lite itself, no CORS
- [Editions](/docs/getting-started/editions) - the comparison table
- [Stalwart setup](/docs/getting-started/configuration/stalwart-setup) - the mail server side
