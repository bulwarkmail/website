---
title: Reverse Proxy
description: Set up a reverse proxy in front of Bulwark.
order: 2
---

# Reverse Proxy

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

## Important Notes

### Required Headers

Whatever reverse proxy you use, make sure to forward these headers:

- `X-Forwarded-For` - Client IP address
- `X-Forwarded-Proto` - Original protocol (http/https)
- `Host` - Original hostname

### EventSource Support

Bulwark uses JMAP EventSource for real-time push notifications. Ensure your reverse proxy supports long-lived HTTP connections and does not buffer server-sent events. For Nginx, the `proxy_set_header Connection 'upgrade'` and `proxy_http_version 1.1` directives handle this.

### Session URL Rewriting

Bulwark automatically rewrites JMAP session URLs returned by the server to match the origin the client connects to. This fixes deployments where Stalwart returns an internal hostname (e.g., `http://stalwart:8080`) that isn't reachable from the browser.

## Subpath Deployment

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

## PWA Paths

If Bulwark serves a PWA, make sure these paths are forwarded as-is and not aggressively cached at the proxy:

- `/manifest.webmanifest` - dynamic manifest
- `/sw.js` - service worker (scope is automatically adjusted under a subpath)
- `/api/pwa-icon/*` - auto-generated PWA icons
- `/branding/*` - branding assets
- `/api/push/*` - JMAP push verification handshake for web push notifications
