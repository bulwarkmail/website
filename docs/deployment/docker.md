---
title: Docker Deployment
description: Deploy Bulwark with Docker and Docker Compose.
order: 1
---

# Docker Deployment

The easiest way to deploy Bulwark in production is with Docker.

## Using Docker

### Pull and Run

```bash
docker run -d \
  --name bulwark \
  -p 3000:3000 \
  -e NEXT_PUBLIC_JMAP_URL=https://mail.example.com/jmap \
  ghcr.io/root-fr/jmap-webmail:latest
```

### Build from Source

```bash
git clone https://github.com/root-fr/jmap-webmail.git
cd jmap-webmail
docker build -t bulwark .
docker run -d --name bulwark -p 3000:3000 bulwark
```

## Docker Compose

Create a `docker-compose.yml` for running Bulwark alongside Stalwart:

```yaml
version: "3.8"

services:
  stalwart:
    image: stalwartlabs/mail-server:latest
    container_name: stalwart
    ports:
      - "443:443"
      - "25:25"
      - "587:587"
      - "993:993"
      - "8080:8080"
    volumes:
      - stalwart-data:/opt/stalwart-mail
    restart: unless-stopped

  bulwark:
    image: ghcr.io/root-fr/jmap-webmail:latest
    container_name: bulwark
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_JMAP_URL: http://stalwart:8080/jmap
    depends_on:
      - stalwart
    restart: unless-stopped

volumes:
  stalwart-data:
```

Start both services:

```bash
docker compose up -d
```

## Reverse Proxy

For production, place Bulwark behind a reverse proxy like Nginx or Caddy for TLS termination.

### Caddy Example

```caddy
mail.example.com {
    reverse_proxy bulwark:3000
}
```

### Nginx Example

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
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Health Check

Bulwark exposes a health check endpoint at `/api/health`. Use it in your Docker or orchestration health checks.
