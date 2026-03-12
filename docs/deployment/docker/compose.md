---
title: Docker Compose
description: Run Bulwark alongside Stalwart with Docker Compose.
order: 1
---

# Docker Compose

Run Bulwark alongside Stalwart Mail Server using Docker Compose for a complete, self-contained email stack.

## Basic Setup

Create a `docker-compose.yml`:

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

## Start the Stack

```bash
docker compose up -d
```

## View Logs

```bash
docker compose logs -f bulwark
docker compose logs -f stalwart
```

## Updating

```bash
docker compose pull
docker compose up -d
```

## Custom Build

If you want to build Bulwark from source instead of using the prebuilt image:

```yaml
bulwark:
  build:
    context: ./jmap-webmail
    dockerfile: Dockerfile
  container_name: bulwark
  ports:
    - "3000:3000"
  environment:
    NEXT_PUBLIC_JMAP_URL: http://stalwart:8080/jmap
  depends_on:
    - stalwart
  restart: unless-stopped
```
