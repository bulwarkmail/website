---
title: Reverse proxy
description: Set up a reverse proxy in front of Bulwark.
order: 2
edition: full
editionNote: "These examples put a proxy in front of Bulwark (not Lite). The server snippets for Lite are on Static hosting."
---

# Reverse proxy

For production deployments, place Bulwark behind a reverse proxy for TLS termination and custom domains.

## Caddy

The simplest option - automatic HTTPS with Let's Encrypt:

```caddy
mail.example.com {
    reverse_proxy bulwark:3000
}
```

## Nginx

```nginx
server {
    listen 443 ssl;
    http2 on; # nginx 1.25.1+; older versions: listen 443 ssl http2;
    server_name mail.example.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Traefik

Using Docker labels:

```yaml
bulwark:
  image: ghcr.io/bulwarkmail/webmail:latest
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.bulwark.rule=Host(`mail.example.com`)"
    - "traefik.http.routers.bulwark.tls.certresolver=letsencrypt"
    - "traefik.http.services.bulwark.loadbalancer.server.port=3000"
```

## Proxy requirements

### Required headers

Whatever reverse proxy you use, make sure to forward these headers:

- `X-Forwarded-For` - Client IP address
- `X-Forwarded-Proto` - Original protocol (http/https)
- `Host` - Original hostname

### EventSource support

Push notifications ride on a JMAP EventSource that the browser opens to Stalwart directly, not through the proxy in front of Bulwark. If Stalwart sits behind nginx, that proxy must keep long connections open and not buffer them: add `proxy_buffering off;` and a long `proxy_read_timeout` to its JMAP location.

### Session URL rewriting

Bulwark moves the JMAP session URLs the server returns onto the origin of the configured server URL. Without this, a Stalwart that advertises an internal hostname such as `http://stalwart:8080` would hand the browser an address it cannot reach. URLs the server deliberately serves from another HTTPS host are left alone.

## Subpath deployment

To mount Bulwark under a URL prefix (e.g. `https://example.com/webmail`):

1. Build a custom image with the path and the locale prefix mode baked in. Next.js reads both at build time, so setting them on a running container does nothing. `NEXT_PUBLIC_LOCALE_PREFIX=always` avoids `next-intl` rewrite loops under a subpath:
   ```bash
   docker build --build-arg NEXT_PUBLIC_BASE_PATH=/webmail --build-arg NEXT_PUBLIC_LOCALE_PREFIX=always -t bulwark-webmail .
   ```
   The published `-always` images (for example `ghcr.io/bulwarkmail/webmail:1.19.1-always`) are built with the locale prefix mode but without a base path, so they don't replace this build for a subpath.
2. Point your reverse proxy at the container **without stripping the prefix**. The app expects to receive requests under `/webmail/...` and serves all routes (`/webmail/api/...`, `/webmail/_next/static/...`, `/webmail/sw.js`, etc.) accordingly.

```caddy
example.com {
    reverse_proxy /webmail/* bulwark:3000
}
```

```nginx
location /webmail/ {
    proxy_pass http://localhost:3000/webmail/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## PWA paths

If Bulwark serves a PWA, make sure these paths are forwarded as-is and not aggressively cached at the proxy:

- `/manifest.webmanifest` - dynamic manifest
- `/sw.js` - service worker (scope is automatically adjusted under a subpath)
- `/api/pwa-icon/*` - auto-generated PWA icons
- `/branding/*` - branding assets
- `/api/push/preview` - fetches the text of a push notification for the service worker

## Next step

With Bulwark on HTTPS, users can install it as a [Progressive Web App](/docs/features/pwa) and get web push. To keep it current, see [Updating](/docs/deployment/updating).
