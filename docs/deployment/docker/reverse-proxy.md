---
title: Reverse proxy
description: Set up a reverse proxy in front of Bulwark.
order: 2
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
    listen 443 ssl http2;
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

Push notifications ride on JMAP EventSource, so the proxy has to hold long-lived HTTP connections open and must not buffer server-sent events. On Nginx, `proxy_http_version 1.1` plus `proxy_set_header Connection 'upgrade'` covers it.

### Session URL rewriting

Bulwark rewrites the JMAP session URLs the server returns so they match the origin the browser connected to. Without this, a Stalwart that advertises an internal hostname such as `http://stalwart:8080` would hand the browser an address it cannot reach.

## Subpath deployment

To mount Bulwark under a URL prefix (e.g. `https://example.com/webmail`):

1. Build a custom image with the path baked in - Next.js reads `NEXT_PUBLIC_BASE_PATH` at build time:
   ```bash
   docker build --build-arg NEXT_PUBLIC_BASE_PATH=/webmail -t bulwark-webmail .
   ```
2. Run with the matching locale prefix mode to avoid `next-intl` rewrite loops:
   ```env
   NEXT_PUBLIC_LOCALE_PREFIX=always
   ```
3. Point your reverse proxy at the container **without stripping the prefix**. The app expects to receive requests under `/webmail/...` and serves all routes (`/webmail/api/...`, `/webmail/_next/static/...`, `/webmail/sw.js`, etc.) accordingly.

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
- `/api/push/*` - JMAP push verification handshake for web push notifications
