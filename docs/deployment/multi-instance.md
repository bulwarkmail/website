---
title: Running several instances
description: Run Bulwark as several replicas behind one load balancer, with a shared Redis-protocol store.
order: 5
edition: full
editionNote: "This page runs Bulwark (not Lite) as several replicas. Lite is static files and runs any number of copies without this; see Static hosting."
---

# Running several instances

By default Bulwark is one process that keeps its state in memory and in files under `/app/data`. That is all most installs need. When you want two or more replicas, for failover, rolling updates or load, give every replica the same shared store with one variable:

```sh
REDIS_URL=redis://:password@valkey:6379/0
```

Every replica then sees the same admin configuration, plugins, branding, user settings, sign-in limits and pairing codes. Any load balancer works, including plain round robin: sessions don't need to stick to a replica, and no replica needs a shared writable volume.

Without `REDIS_URL` nothing changes: the same files on disk, the same behaviour.

<div class="lite-callout">Bulwark Lite has no server and runs any number of copies without this.</div>

## The store

Any server that speaks the Redis protocol and runs Lua scripts: [Valkey](https://valkey.io), Redis 5 or newer, KeyDB, Dragonfly, or a managed Redis service. One endpoint; Redis Cluster isn't supported (Sentinel through a single service address is fine).

Configure the server so it never drops data:

- `maxmemory-policy noeviction`. An evicting policy would silently delete settings and admin config under memory pressure.
- Persistence on: `appendonly yes` (AOF) or RDB snapshots, on a persistent volume.

Bulwark needs little memory. A few hundred users take a few megabytes; plugins and branding images add their own size (each plugin at most 5 MB). The audit log keeps the newest 50 000 entries.

| Variable | What it does |
|---|---|
| `REDIS_URL` | The store. `redis://` or `rediss://` (TLS), with the password in the URL: `redis://:password@host:6379/0` |
| `REDIS_URL_FILE` | Path to a file holding the URL, for Docker or Kubernetes secrets |
| `REDIS_KEY_PREFIX` | Prefix of every key, default `bulwark:`. Give each deployment its own when several share one server |

Set `SESSION_SECRET` the same on every replica as well. Without it, the first replica creates one in the store and the others use it, which works, but losing the store then signs everyone out and makes stored settings unreadable.

## Docker Compose

Three replicas, a Valkey and nginx in front:

```yaml
x-bulwark: &bulwark
  image: ghcr.io/bulwarkmail/webmail:latest
  env_file: [.env.local]
  environment:
    REDIS_URL: redis://:${VALKEY_PASSWORD}@valkey:6379/0
  restart: unless-stopped
  depends_on: [valkey]

services:
  valkey:
    image: valkey/valkey:8-alpine
    command: ["valkey-server", "--requirepass", "${VALKEY_PASSWORD}", "--appendonly", "yes", "--maxmemory-policy", "noeviction"]
    volumes: ["valkey-data:/data"]
    restart: unless-stopped

  bulwark-1: *bulwark
  bulwark-2: *bulwark
  bulwark-3: *bulwark

  lb:
    image: nginx:1.29-alpine
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
    ports: ["3000:80"]
    restart: unless-stopped

volumes:
  valkey-data:
```

The replicas need no volumes. In `nginx.conf`, list the replicas in one `upstream` and let nginx skip one that is down or still starting:

```nginx
upstream bulwark {
  zone bulwark 64k;
  server bulwark-1:3000 resolve max_fails=1 fail_timeout=5s;
  server bulwark-2:3000 resolve max_fails=1 fail_timeout=5s;
  server bulwark-3:3000 resolve max_fails=1 fail_timeout=5s;
}
# in the server's location /:
#   proxy_pass http://bulwark;
#   proxy_next_upstream error timeout http_502 http_503;
```

Put `.env.local`'s `SESSION_SECRET`, `ADMIN_PASSWORD` and `JMAP_SERVER_URL` there as for one instance. `VALKEY_PASSWORD` goes into the compose project's `.env`.

## Kubernetes

Run the Deployment with as many replicas as you like and a Redis-protocol service next to it (a Valkey StatefulSet, a Helm chart, or a managed service). Per pod:

- `REDIS_URL` from a Secret (or `REDIS_URL_FILE` pointing at a mounted Secret), and `SESSION_SECRET` from a Secret.
- `readinessProbe` on `/api/ready`, `livenessProbe` on `/api/health`. `/api/ready` answers 503 while a pod starts and while it can't reach the store, so the Service sends no traffic to it; `/api/health` keeps answering, so the pod isn't restarted for a store outage and comes back on its own.
- No PersistentVolume. To keep configuration in git, mount a ConfigMap at `/app/data/admin` with `config.json` and `policy.json` and set `ADMIN_CONFIG_READONLY=true`: every replica then reads config, policy, plugins, themes and branding from the mounted files, the admin console can't change them, and an updated ConfigMap is picked up within a few seconds without a restart. State (sessions, settings, audit log) still lives in the store.
- If you set `PLUGIN_SIGNING_KEY_FILE`, set it to the same key on every replica, or on none. Without it the replicas share one key from the store. A replica whose key differs refuses to sign plugins and logs why.
- Keep the replicas' clocks in sync (NTP). Short-lived codes and office editor sign-outs compare times written by different replicas.
- `TRUSTED_PROXY_DEPTH` must count the proxies in front of the pods (ingress controller, cloud load balancer), so sign-in limits see the client's address and not the ingress's.

```yaml
readinessProbe:
  httpGet: { path: /api/ready, port: 3000 }
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /api/health, port: 3000 }
  periodSeconds: 10
```

## Moving an existing install

1. Back up the data volume.
2. Scale down to one instance, add `REDIS_URL` to it and start it with its existing `/app/data` volume, against an empty store. On first start it copies everything into the store: config, policy, admin password, plugins, themes, branding, user settings, plugin credentials, account archives, the audit log, telemetry state and the generated session secret. The log says what it imported. Files on disk are never changed or deleted.
3. Start the other replicas. They don't need the old volume.

Restarting the first instance doesn't import again: the store remembers it was set up. If a replica that ran on its own before joins a store that was set up without its data, it refuses to serve and says so in its log, rather than mixing two installs.

Going back to one instance: start one instance with `REDIS_URL` and `SHARED_STORE_EXPORT=1`. It writes everything from the store into its data dirs in the usual file layout, logs what it wrote and exits. Then remove `REDIS_URL` and start it normally on that volume.

## What each replica keeps to itself

Admin changes reach every replica within five seconds, usually within one. A few caches stay per replica because they hold copies of other servers' data:

| Cache | How stale it can be |
|---|---|
| Stalwart admin check for the admin console's auto-login | 60 seconds after a user loses admin rights |
| Bearer token identities (mobile clients reading policy) | 60 seconds after a token is revoked |
| OAuth discovery, Stalwart client registration, extension directory keys | 10 minutes |
| WOPI discovery | 5 minutes |
| Sender favicons, BIMI logos | until they expire |
| Plugin proxy rate limit (300 requests a minute per user and plugin) | counted per replica |

Sign-in limits, pairing codes, hand-off codes, admin sessions and their sign-out are shared: a blocked address is blocked on every replica, and a signed-out admin session stops working everywhere at once.

## When the store is down

| What | Behaviour |
|---|---|
| Readiness (`/api/ready`) | 503 on every replica |
| Signing in, admin sign-in, pairing a phone | refused with 503; limits never fail open |
| Users already signed in | behind a load balancer that ignores readiness (plain nginx, Docker Compose): keep reading and sending mail, since the browser talks to the mail server. Behind one that follows `/api/ready` (Kubernetes): no pod is ready, so users get the ingress's error page until the store is back |
| Saving settings, plugin credentials | refused with 503; the browser keeps its copy and saves again later |
| Admin console | 503: admin sessions and sign-outs can't be checked |

Everything recovers by itself when the store is back. If the store comes back empty (no persistence, a flush), the replicas refuse to serve rather than start over silently; restore the store from a backup, or restart every replica to set it up fresh.

## Rolling updates

Replacing replicas one at a time works: sessions, settings and admin state live in the store. While replicas of two different versions run side by side, a page loaded from the new version may fetch a script from an old replica and need a reload; keep the overlap short (Kubernetes' default rolling update does).

## Securing the store

The store holds what the data volume holds: encrypted user settings and plugin credentials, the admin password hash, and admin config including OAuth client secrets in plain text. Treat it like that volume:

- require a password, and use `rediss://` when it crosses a network you don't control;
- let only the Bulwark replicas reach it (a NetworkPolicy, a private network);
- back it up with the rest of your data (see [Updating](/docs/deployment/updating#backing-up-the-shared-store)).
