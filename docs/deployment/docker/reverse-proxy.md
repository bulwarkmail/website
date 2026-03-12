---
title: Reverse Proxy
description: Set up a reverse proxy in front of Bulwark.
order: 2
---

# Reverse Proxy

For production deployments, place Bulwark behind a reverse proxy for TLS termination and custom domains.

## Caddy

The simplest option — automatic HTTPS with Let's Encrypt:

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
  image: ghcr.io/root-fr/jmap-webmail:latest
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.bulwark.rule=Host(`mail.example.com`)"
    - "traefik.http.routers.bulwark.tls.certresolver=letsencrypt"
    - "traefik.http.services.bulwark.loadbalancer.server.port=3000"
```

## Important Headers

Whatever reverse proxy you use, make sure to forward these headers:

- `X-Forwarded-For` — Client IP address
- `X-Forwarded-Proto` — Original protocol (http/https)
- `Host` — Original hostname
