---
title: Anonymous Usage Stats
description: How Bulwark phones home - what we count, why, and how to turn it off.
order: 7
---

# Anonymous Usage Stats

Bulwark sends one anonymous heartbeat per day from each install so we can answer basic questions about how the project is used. **Enabled by default** - opt-out is one switch in admin settings, and the exact JSON we'd send is visible there before any ping leaves your server.

The data is instance-level only - no email addresses, no hostnames, no IPs, nothing tied to an end user - which is why we default it on rather than blocking the install behind a consent modal. Most self-hosters never have to think about it; the admins who care can disable in three seconds.

This page is the friendly overview. The full data schema and the formal terms live on the [privacy policy sub-page](/docs/legal/privacy/telemetry).

## Why we do this

We currently ship Bulwark blind. We don't know if a feature is used by 5 people or 500, whether the last release got adopted, or whether the deprecated config we're about to remove still has live users. Every roadmap call is a guess.

The heartbeat answers five concrete questions and nothing else:

1. **How many instances are running.** Are we shipping to a hobby audience or a small business audience?
2. **What versions are deployed.** How fast does a new release roll out - and which old ones are still in the wild?
3. **Which features are turned on.** Where should engineering time go? If 4 % of installs enable S/MIME, we don't pour weeks into S/MIME UX.
4. **What deployment shape people use.** Docker vs bare-metal vs k8s - drives where docs effort goes.
5. **Roughly how big the install is.** A homelab-of-one and a 200-seat business have very different needs.

That's it. If a future field can't fill in a sentence about which decision it changes, it doesn't ship.

## What we collect

One ping per day, jittered ± 2 hours so the timing can't reveal user activity. Example payload:

```json
{
  "schema": "1",
  "instance_id": "f0c1...",
  "ts": "2026-04-27T17:00:00Z",
  "version": "1.4.8",
  "platform": "docker",
  "os_family": "linux",
  "stalwart_version": "0.16.0",
  "features": {
    "calendar": true,
    "contacts": true,
    "files": false,
    "extensions": true
  },
  "counts": {
    "accounts": "2-5",
    "accounts_active_7d": "1",
    "extensions_installed": 2
  },
  "uptime_days": 17
}
```

Account counts are reported as **buckets** (`1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`) so a small instance can't be re-identified by exact size.

## What we explicitly do NOT collect

- Email addresses, even hashed
- Hostnames, FQDNs, your domain name
- IP addresses on the server side (the receiving server's nginx logs are turned off)
- Mail counts, folder counts, message sizes, attachment sizes
- Timestamps of any user action
- Anything you typed in the UI

The full negative list and what nginx + the collector log (or rather, don't log) is on the [privacy sub-page](/docs/legal/privacy/telemetry).

## Default state and inspection

Telemetry is **enabled by default** on a fresh install. The first heartbeat fires **one hour** after the webmail process starts, so if you install Bulwark and immediately disable telemetry from the admin UI, zero pings ever leave your server.

In **Admin → Settings → Anonymous usage stats** you can:

- Toggle the heartbeat on or off at any time.
- **Preview payload** - see the exact JSON the next heartbeat would send, with your install's current values.
- **Send now** - fire a heartbeat immediately for testing or transparency.
- Change the **endpoint** (defaults to `https://telemetry.bulwarkmail.org/v1/heartbeat`) to point at your own collector or to disable by clearing it.
- See **Last sent: 17 hours ago** so you know what's actually happening.

## How to opt out

Pick whichever fits your workflow:

- In the admin UI, flip **Anonymous usage stats** off.
- Set `BULWARK_TELEMETRY=off` in your environment (`.env`, `docker-compose.yml`, or your systemd unit). Wins over the UI toggle.
- Set `BULWARK_TELEMETRY_URL=` (empty) - same effect as off.
- Block `telemetry.bulwarkmail.org` in your firewall. Heartbeats will silently fail with no impact on Bulwark.

Already opted in and changed your mind? The toggle takes effect immediately. To also reset your `instance_id` (so future heartbeats from this install look like a brand-new instance), delete the `.telemetry-id` file in your Bulwark data directory.

## Run your own collector

The collector is open source at [github.com/bulwarkmail/dashboard](https://github.com/bulwarkmail/dashboard) under `telemetry-collector/`. If you want telemetry data for your own fleet, point your installs at your own collector via `BULWARK_TELEMETRY_URL`.

## Public dashboard

The aggregate numbers (active instances, version distribution, feature adoption percentages) are published on a read-only Grafana view linked from the privacy sub-page, so anyone - not just us - can see what we know.
