---
title: Install on Stalwart
description: Let Stalwart host Bulwark Lite itself as a web Application, on the same origin, with no web server and no CORS.
order: 1
edition: lite
---

# Install on Stalwart

Stalwart 0.16 can host web apps itself. An `Application` is a zip that Stalwart downloads, unpacks and serves under a path of its own HTTP listener, the same way it serves its web admin. Bulwark Lite ships a bundle for exactly that, `bulwark-lite-stalwart.zip`, so the webmail can live at `https://mail.example.com/webmail/` with nothing else to run.

Compared with putting the [static zip](/docs/deployment/static) on a web server:

- **No web server.** Stalwart serves the files.
- **No CORS.** The webmail and JMAP share an origin, so `permissive-cors` stays off.
- **No server URL.** The bundle talks to the Stalwart that serves it; the login page has no server field.
- **Updates are one action.** Stalwart downloads the zip again, and open tabs pick up the new build on their next navigation.

What works and what is off is the same as for any [Bulwark Lite](/docs/getting-started/lite) install.

<div class="lite-callout"><code>bulwark-lite-stalwart.zip</code> first shipped with the <a href="https://github.com/bulwarkmail/webmail/releases/tag/1.11.0-beta.1">1.11.0-beta.1 pre-release</a>. Until a stable release carries it, the <code>releases/latest/download/…</code> URL below returns 404, and a failed download unmounts the Application. Use the pinned pre-release URL for now: <code>https://github.com/bulwarkmail/webmail/releases/download/1.11.0-beta.1/bulwark-lite-stalwart.zip</code>.</div>

## Requirements

- Stalwart **0.16.0** or later. A custom OAuth client id (`oauthClientId`, see below) needs **0.16.19**.
- An administrator account with `sysApplicationCreate` and `actionUpdateApps`. Managing the Application later also needs `sysApplicationGet`, `sysApplicationQuery`, `sysApplicationUpdate` and `sysApplicationDestroy`.
- Stalwart must be able to fetch the zip from `resourceUrl` (GitHub, or wherever you host your own build).

## Install

Two steps: create the Application, then ask Stalwart to fetch it. **Creating it alone mounts nothing.** Stalwart only downloads bundles when the "update applications" action runs, or when it restarts.

### With stalwart-cli

```bash
stalwart-cli create Application \
  --field description='Bulwark Webmail' \
  --field resourceUrl='https://github.com/bulwarkmail/webmail/releases/latest/download/bulwark-lite-stalwart.zip' \
  --field 'urlPrefix={"/webmail":true}'

stalwart-cli create Action/UpdateApps
```

`urlPrefix` is a JSON map of prefixes to `true`. `{"/webmail"}` and `["/webmail"]` are rejected.

### In the web admin

Under **Settings > Web Applications**, create an entry with the description, the `resourceUrl` and the prefix `/webmail`. Then run the "update applications" action, or restart Stalwart.

### Over JMAP

As an administrator, in one request:

```json
{
  "using": ["urn:ietf:params:jmap:core", "urn:stalwart:jmap"],
  "methodCalls": [
    ["x:Application/set", { "create": { "webmail": {
      "description": "Bulwark Webmail",
      "resourceUrl": "https://github.com/bulwarkmail/webmail/releases/latest/download/bulwark-lite-stalwart.zip",
      "urlPrefix": { "/webmail": true }
    } } }, "0"],
    ["x:Action/set", { "create": { "u": { "@type": "UpdateApps" } } }, "1"]
  ]
}
```

Then open `https://<your stalwart host>/webmail/` and sign in with a mail account.

## Choosing the prefix

`urlPrefix` matches the **first path segment only**, so `/webmail` works and `/apps/webmail` does not. The bundle reads its prefix at runtime, so any free segment works without a rebuild, and one Application may be mounted under several prefixes at once.

Stalwart routes some segments itself, before it looks at Applications. A bundle mounted on one of them is never reached:

`jmap`, `dav`, `.well-known`, `auth`, `api`, `scim`, `mail`, `calendar`, `autodiscover`, `login`, `device`, `metrics`, `healthz`, `logo`, `form`, `robots.txt`, and the web admin's `admin` and `account`.

`/mail` and `/calendar` are on that list, so use `/webmail`, `/bulwark` or similar. A request for `/webmail` is redirected to `/webmail/`.

## Signing in and OAuth

Login goes through Stalwart's own token endpoints on the same origin (`/api/auth` and `/auth/token`), with the client id from the Application's `oauthClientId`, or `bulwark-webmail` when that is empty. "Remember me" keeps a Stalwart refresh token in the browser, exactly as on a static host.

If your Stalwart requires OAuth clients to be registered, register that client id with the redirect URI `https://<your stalwart host>/<prefix>/`, one per prefix you mount.

### Single sign-on

Accounts whose directory is an external OpenID provider cannot use the password form, because Stalwart has no password to check. The app asks Stalwart who signs an address in and shows **Sign in with SSO** for those accounts instead: an authorization code flow with PKCE, redeemed in the browser. At the provider:

- Register a public client with the same id (the `oauthClientId`, or `bulwark-webmail`).
- Add the redirect URI `https://<your stalwart host>/<prefix>/oauth/callback`. It carries no locale, so you need one per prefix.
- Allow CORS from the Stalwart host on the token endpoint, as Stalwart's own web admin requires.

Setting `oauthClientId` on the Application also offers SSO next to the password form for everyone.

## Updating

Stalwart caches the downloaded zip for the Application's `autoUpdateFrequency` (90 days by default). This is only an expiry, not a timer: nothing is fetched on a schedule. After the expiry, the next restart or "update applications" run downloads `resourceUrl` again.

To update right away, run the action again:

```bash
stalwart-cli create Action/UpdateApps
```

It always downloads every Application again. Open tabs switch to the new build on their next navigation, with one full page load. Files the app fetches without a content hash carry the build id, so Stalwart's year-long cache headers never pin an old build.

**Check every `resourceUrl` before running the action.** It unpacks all Applications again and mounts only the ones that downloaded and unpacked. A URL that points at an HTML page, a GitHub Actions artifact page or a release listing instead of a zip fails without a log line and unmounts that Application. This includes Stalwart's own web admin, whose URL is `https://github.com/stalwartlabs/webui/releases/latest/download/webui.zip`.

## Pinning a version

`releases/latest/download/…` follows every stable release. To stay on one version, point `resourceUrl` at that release's asset instead. Release tags have no `v` prefix:

```text
https://github.com/bulwarkmail/webmail/releases/download/<version>/bulwark-lite-stalwart.zip
```

To move to another version, change `resourceUrl` and run "update applications".

## Branding and configuration

The bundle is read-only: its `config.json` is inside the zip, so there is nothing to edit on the server. It defaults to the serving Stalwart and hides the server field on the login page.

To change the app name, logos or any other [`config.json` key](/docs/deployment/static#configjson), build your own bundle and host it where Stalwart can fetch it:

- Dispatch the **Build Static Lite** workflow in the repository with your inputs; the `stalwart` job produces `bulwark-lite-stalwart.zip`. Leave the server URL empty so it uses the serving Stalwart.
- Or build locally in a disposable checkout, as on the [static hosting](/docs/deployment/static#build-inputs) page, with the Stalwart target:

  ```bash
  LITE_APP_NAME="Example Mail" npm run build:lite -- --in-place --target=stalwart
  ```

  `NEXT_PUBLIC_BASE_PATH` must stay unset for this target; the prefix comes from `urlPrefix` at runtime.

Then set `resourceUrl` to your zip's URL (a private `http://` address or a `file://` path on the Stalwart host works too) and run "update applications". Stalwart refuses bundles over 100 MB; the release bundle with all 27 locales is about 57 MB, and `LITE_LOCALES` makes it smaller.

## Security notes

- The webmail shares its origin with Stalwart's JMAP endpoint and web admin. Lite's session storage and "remember me" token work as on a static host, but they are now readable by any script on the Stalwart origin, so only install bundles you trust.
- Stalwart serves Application files with a content type, length and cache headers only: no Content-Security-Policy and no `nosniff`. The `_headers` policy of the static zip does not apply here. If you want those headers, add them in the reverse proxy in front of Stalwart for the prefix you mounted.

## How it differs from the static zip

| | `bulwark-lite-<version>.zip` | `bulwark-lite-stalwart.zip` |
| --- | --- | --- |
| Served by | Any web host | Stalwart |
| Mount path | Site root, or a sub-path fixed at build time | Any free first segment, read at runtime |
| Server URL | `jmapServerUrl` in `config.json` | The serving Stalwart |
| CORS on Stalwart | Required | Not needed |
| Deep links | Host rewrite rules or `404.html` replay | One entry document boots every route |
| `config.json` | Edit on the host | Baked in; rebuild to change |
| Host files | `_redirects`, `_headers`, nginx and Caddy examples, `404.html` | None |
| Manifest | `manifest.webmanifest` | `manifest.json` |
| Updating | Download and re-upload | "Update applications" |

## Related pages

- [Bulwark Lite](/docs/getting-started/lite) - what it is and what it leaves out
- [Static hosting](/docs/deployment/static) - the other way to host Lite, and the build inputs
- [Stalwart setup](/docs/getting-started/configuration/stalwart-setup) - the mail server side
