---
title: Static hosting
description: Build inputs, config.json, the CORS setting on Stalwart, and host snippets for Bulwark Lite.
order: 0
edition: lite
---

# Static hosting

Bulwark Lite is a folder. This page is about getting that folder built the way you want it, putting it on a host, and making deep links work there. If you haven't read [what Lite is](/docs/getting-started/lite), start there. If your mail server is Stalwart 0.16.6 or later, 1.0 included, you can also skip the web host and let Stalwart serve Lite: see [Install on Stalwart](/docs/deployment/stalwart-app). If you run containers anyway, there is a ready-made [Lite image](#container-image).

## Three steps

1. Get the zip. Every [release](https://github.com/bulwarkmail/webmail/releases) attaches `bulwark-lite-<version>.zip`. Unzip it and upload the whole folder so that `/index.html` and `/config.json` are served from your site root (or from the sub-path you built it for, see below).
2. Edit `config.json`: set `jmapServerUrl` to your mail server, and `appName` to what the tab should say.
3. Allow the browser to talk to the mail server. In Stalwart:

   ```toml
   [http]
   permissive-cors = true
   ```

   Or an equivalent reverse-proxy rule that allows your Lite origin with the `Authorization` and `Content-Type` headers on `/.well-known/jmap`, `/jmap/*`, `/api/auth` and `/auth/token`.

That is the whole install. The rest of this page is for the cases where the defaults aren't right.

## config.json

The file is read by the browser at runtime, so edits take effect on the next page load and never need a rebuild. Keys the app reads; anything else is ignored:

| Key | Default | Meaning |
| --- | --- | --- |
| `appName` | `Bulwark Webmail` | Name in the tab, the login page and the manifest |
| `jmapServerUrl` | empty | Your mail server, e.g. `https://mail.example.com` |
| `allowCustomJmapEndpoint` | `true` when no server is configured, else `false` | Show a server field on the login page |
| `jmapServers` | `[]` | A fixed list of servers to offer instead; entries need `id`, `label`, `url` and may carry `domains` |
| `jmapServerAutoPickByDomain` | `false` | Pick from `jmapServers` by the domain of the typed address |
| `rememberMeEnabled` | `true` | Offer "remember me" (hidden anyway on servers without Stalwart's token login) |
| `demoMode` | `false` | Built-in demo account, no server needed |
| `faviconUrl`, `appLogoLightUrl`, `appLogoDarkUrl`, `loginLogoLightUrl`, `loginLogoDarkUrl` | Bulwark's | Branding images, as URLs or paths under the folder |
| `loginCompanyName`, `loginImprintUrl`, `loginPrivacyPolicyUrl`, `loginWebsiteUrl` | empty | Login page footer |
| `loginLogoMaxHeight`, `loginLogoMaxWidth` | natural size | Any CSS length |
| `loginShowHeading`, `loginShowSubtitle`, `loginShowTotp`, `loginShowVersion` | `true` | Hide parts of the login page |
| `embeddedMode`, `parentOrigin` | `false`, empty | Framing a password login inside another page |

These are the full edition's branding variables, camel-cased. Whatever the file says, the flags that only work with a server behind them are pinned off: OAuth, auto-SSO, settings sync, the Stalwart account features, the JMAP passthrough, dev mode.

An optional `policy.json` next to it carries the same settings policy the admin dashboard would write in the full edition (default settings, restrictions, theme policy). Plugins and sidebar apps stay off regardless of what it says.

## Build inputs

The release zip is built for the site root with no server URL. To bake in different defaults, dispatch the **Build Static Lite** workflow in the repository with its inputs, or build locally. Either way the knobs are environment variables read at build time:

| Variable | Effect |
| --- | --- |
| `LITE_JMAP_SERVER_URL` | Default `jmapServerUrl` written into `config.json` (still editable afterwards) |
| `LITE_APP_NAME` | Default `appName` |
| `LITE_ALLOW_CUSTOM_ENDPOINT` | Default `allowCustomJmapEndpoint`; on by default when no server URL is given |
| `LITE_REMEMBER_ME` | Default `rememberMeEnabled` |
| `LITE_DEMO_MODE` | `true` builds the static demo, which needs no server |
| `LITE_LOCALES` | Comma-separated subset of locales to export, e.g. `en,de`. Default: all 27 |
| `NEXT_PUBLIC_BASE_PATH` | Mount the app under a sub-path, e.g. `/webmail`. Baked into every asset URL, so it can't be changed after the build |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Locale the root page falls back to when the browser's languages match nothing exported |
| `GIT_COMMIT` | Commit shown in `lite-build.json` and the About screen |

To build locally, use a disposable checkout. The build deletes the server-only trees in place and refuses to run in a working tree unless told it is throwaway:

```bash
git worktree add ../bulwark-lite HEAD
cd ../bulwark-lite && npm ci
LITE_JMAP_SERVER_URL=https://mail.example.com npm run build:lite -- --in-place
npm run lite:serve                       # http://localhost:4173/
```

`npm run build:lite -- --dry-run` prints what would be removed and built without touching anything.

## What lands in the folder

| File | Purpose |
| --- | --- |
| `<locale>/mail/`, `calendar/`, `contacts/`, `files/`, `settings/`, `login/` | One shell per locale and surface; `<locale>/mail/index.html` serves every mail deep link |
| `index.html` | Root shim: picks the visitor's locale in the browser and jumps to it |
| `404.html` | Replays a deep link in the browser on hosts with no rewrite rules |
| `config.json`, `policy.json` | Runtime configuration, described above |
| `manifest.webmanifest` | Web app manifest, so the app can be added to a home screen |
| `_redirects`, `_headers` | Netlify and Cloudflare Pages rewrite rules and security headers |
| `nginx.conf.example`, `Caddyfile.example` | Ready-made server blocks for the two |
| `LITE-README.md`, `lite-build.json` | The three-step readme, and version / commit / locales / base path of this build |

## Deep links

A URL such as `/en/mail/thread/abc` has no file behind it. It is served by the shell at `/en/mail/index.html`, which reads the path and opens the thread. The host has to know that, in one of three ways:

- **Rewrite rules.** The host serves the owning surface's `index.html` for anything below `/<locale>/<surface>/`. This is what the snippets below do, and what `_redirects` does on Netlify and Cloudflare Pages. One page load, no flash.
- **The `404.html` replay.** On a host with no rewrite support (GitHub Pages, a plain S3 bucket) the shipped `404.html` parks the requested path in `sessionStorage`, loads the right shell, and the app picks the path up from there. It works, with one extra page load.
- **A sub-path build.** If Lite is mounted under `/webmail`, build it with `NEXT_PUBLIC_BASE_PATH=/webmail` so the shells and rules carry the prefix.

## Host snippets

### nginx

```nginx
server {
    listen 80;
    server_name webmail.example.com;
    root /var/www/bulwark-lite;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    # See _headers for a Content-Security-Policy that matches your JMAP server.

    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # /<locale>/<surface>/anything -> /<locale>/<surface>/index.html
    location ~ ^/(?<locale>[a-zA-Z-]+)/(?<surface>mail|calendar|contacts|files|settings)(/.*)?$ {
        try_files $uri $uri/ $uri/index.html /$locale/$surface/index.html;
    }

    location / {
        try_files $uri $uri/ $uri/index.html =404;
        error_page 404 /404.html;
    }
}
```

### Caddy

```caddy
webmail.example.com {
    root * /var/www/bulwark-lite
    encode gzip

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }

    @surface path_regexp surface ^/([a-zA-Z-]+)/(mail|calendar|contacts|files|settings)(/.*)?$
    handle @surface {
        try_files {path} {path}/ {path}/index.html /{re.surface.1}/{re.surface.2}/index.html
    }

    handle {
        try_files {path} {path}/ {path}/index.html /404.html
    }

    file_server
}
```

Both are what the zip ships as `nginx.conf.example` and `Caddyfile.example`, with the sub-path already substituted if you built for one.

### Netlify and Cloudflare Pages

Drop the folder in and you are done. Both hosts read the shipped `_redirects`, which maps every `/<locale>/<surface>/*` to its shell with a 200, and `_headers`, which sets the security headers and a Content-Security-Policy.

### GitHub Pages, S3, and other hosts without rewrites

Upload the folder. Deep links go through the `404.html` replay described above. For GitHub Pages under a project path (`https://you.github.io/webmail/`), build with `NEXT_PUBLIC_BASE_PATH=/webmail`.

## Container image

If you would rather run a container than upload a folder, `ghcr.io/bulwarkmail/webmail-lite` is the same export behind an unprivileged nginx: no Node.js at runtime, runs as uid 101, listens on port 8080 over IPv4 and IPv6. Releases are tagged like the main image (`latest`, `1.11.0`, `1.11`, `1`), and `ghcr.io/bulwarkmail/webmail-lite-beta:latest` follows `main`.

Configure it by mounting your own [`config.json`](#configjson) (and `policy.json`, if you need one) over the baked-in file:

```yaml
services:
  webmail-lite:
    image: ghcr.io/bulwarkmail/webmail-lite:latest
    ports:
      - "8080:8080"
    environment:
      # connect-src of the Content-Security-Policy. Defaults to "*" because the
      # image cannot know your mail server; pin it once config.json does.
      - LITE_CSP_CONNECT_SRC=https://mail.example.com
    volumes:
      - ./config.json:/usr/share/nginx/html/config.json:ro
    # Optional hardening: nginx only writes to these two.
    read_only: true
    tmpfs:
      - /tmp
      - /etc/nginx/conf.d:uid=101,gid=101
    restart: unless-stopped
```

```json
{
  "appName": "Example Mail",
  "jmapServerUrl": "https://mail.example.com",
  "allowCustomJmapEndpoint": false,
  "rememberMeEnabled": true
}
```

The nginx config is generated from the same routing rules as `nginx.conf.example` ([deep links](#deep-links) below a surface fall back to that surface's shell, everything else is a real 404). It also adds what a static host's `_headers` would: the Content-Security-Policy and the other [security headers](#security-headers), immutable caching for `/_next/static/`, revalidation for the shells and `config.json`, and gzip.

- Terminate TLS in the [reverse proxy](/docs/deployment/docker/reverse-proxy) in front of it.
- The image serves from `/`, so give it a host of its own rather than a sub-path.
- The browser still talks to the mail server directly, so the [CORS setting](#three-steps) applies as for any static host.

To bake in different defaults or a locale subset, build the image yourself. The build args are the `LITE_*` [build inputs](#build-inputs):

```bash
docker build -f Dockerfile.lite --build-arg LITE_LOCALES=en,de -t bulwark-lite .
```

## Security headers

`_headers` carries the recommended set: `nosniff`, `X-Frame-Options: DENY`, a referrer policy, a permissions policy, and a Content-Security-Policy whose `connect-src` is your JMAP server's origin when the build had one baked in, and `*` otherwise. Tighten it to your server's origin if you prefer a strict policy. The export contains inline hydration scripts, so `script-src` has to allow `'unsafe-inline'`; that is a property of the static export, not a choice.

## Updating

There is no update channel in Lite and no in-app notice. Download the new zip, keep your `config.json` (and `policy.json` if you wrote one), and upload over the old folder. `lite-build.json` tells you which version is deployed.

With the [container image](#container-image), pull the new tag and recreate the container; the mounted `config.json` carries over.

## Related pages

- [Bulwark Lite](/docs/getting-started/lite) - what it is and what it leaves out
- [Install on Stalwart](/docs/deployment/stalwart-app) - the no-web-server alternative
- [Stalwart setup](/docs/getting-started/configuration/stalwart-setup) - the CORS setting in context
- [Troubleshooting](/docs/guides/troubleshooting) - the CORS and deep-link failures
