---
title: Reverse Proxy
description: Set up a reverse proxy in front of Bulwark.
order: 2
---

# Reverse Proxy

For production deployments, place Bulwark behind a reverse proxy for TLS termination and custom domains.

## Caddy

The simplest option Ã¢â‚¬â€ automatic HTTPS with Let's Encrypt:

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

- `X-Forwarded-For` Ã¢â‚¬â€ Client IP address
- `X-Forwarded-Proto` Ã¢â‚¬â€ Original protocol (http/https)
- `Host` Ã¢â‚¬â€ Original hostname

### EventSource Support

Bulwark uses JMAP EventSource for real-time push notifications. Ensure your reverse proxy supports long-lived HTTP connections and does not buffer server-sent events. For Nginx, the `proxy_set_header Connection 'upgrade'` and `proxy_http_version 1.1` directives handle this.

### Session URL Rewriting

Bulwark automatically rewrites JMAP session URLs returned by the server to match the origin the client connects to. This fixes deployments where Stalwart returns an internal hostname (e.g., `http://stalwart:8080`) that isn't reachable from the browser.
