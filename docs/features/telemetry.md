---
title: Anonymous usage stats
description: The optional daily heartbeat - what it counts, why, and how to turn it on or off.
order: 7
edition: full
editionNote: "Usage stats are sent by Bulwark's server (not Lite). Lite has no server process and sends no heartbeats."
---

# Anonymous usage stats

Bulwark can send one anonymous heartbeat per day so we can answer basic questions about how the project is used. It is **off until you turn it on**: nothing leaves a fresh install until an admin opts in, and the exact JSON that would be sent is visible in the admin UI before the first ping.

The data is instance-level only. No email addresses, no hostnames, no IPs, nothing tied to an end user.

This page is the overview. The full data schema and the formal terms live on the [privacy policy sub-page](/docs/legal/privacy/telemetry).

## Why we ask for it

We ship Bulwark blind. We don't know whether a feature is used by 5 people or 500, whether the last release got adopted, or whether the deprecated config we're about to remove still has live users. Every roadmap call is a guess.

The heartbeat answers five questions and nothing else:

1. **How many instances are running.** Are we shipping to a hobby audience or a small business audience?
2. **What versions are deployed.** How fast does a new release roll out, and which old ones are still in the wild?
3. **Which features are turned on.** If 4% of installs enable S/MIME, we don't pour weeks into S/MIME UX.
4. **What deployment shape people use.** Docker, bare metal, or Kubernetes, which decides where the docs effort goes.
5. **Roughly how big the install is.** A homelab of one and a 200-seat business need different things.

If a future field can't fill in a sentence about which decision it changes, it doesn't ship.

## What we collect

Once enabled: one ping per day, jittered ±2 hours so the timing can't reveal user activity. Example payload:

```json
{
  "schema": "1",
  "instance_id": "f0c1...",
  "ts": "2026-10-31T17:00:00.000Z",
  "version": "1.19.1",
  "build": "release",
  "platform": "docker",
  "node_version": "22.x.x",
  "os_family": "linux",
  "stalwart_version": null,
  "features": {
    "calendar": true,
    "contacts": true,
    "files": false,
    "extensions": true,
    "oauth_enabled": false,
    "smime_enabled": true
  },
  "counts": {
    "accounts": "2-5",
    "accounts_active_7d": "1",
    "extensions_installed": 2,
    "themes_installed": 0
  },
  "uptime_days": 17
}
```

`accounts` is the number of different accounts that signed in during the last 90 days, `accounts_active_7d` those that signed in during the last 7. `uptime_days` is how long the server process has been running, capped at 365. `stalwart_version` stays `null` unless you set `STALWART_VERSION`, because Stalwart doesn't publish its version to clients.

Account counts are reported as **buckets** (`0`, `1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`) so a small instance can't be re-identified by exact size.

## What we never collect

- Email addresses, even hashed
- Hostnames, FQDNs, your domain name
- IP addresses on the server side (the receiving server's nginx logs are turned off)
- Mail counts, folder counts, message sizes, attachment sizes
- Timestamps of any user action
- Anything you typed in the UI

The full negative list, and what nginx and the collector log (or rather, don't log), is on the [privacy sub-page](/docs/legal/privacy/telemetry).

## Default state and inspection

<img class="theme-light-only" src="/screenshots/light-admin-telemetry.webp" alt="The telemetry section of the admin dashboard" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-telemetry.webp" alt="The telemetry section of the admin dashboard" width="5120" height="2880" />

Telemetry is **off on a fresh install**. Consent starts at `off` and is written to `TELEMETRY_DATA_DIR/state.json` on first boot, so an install that is never touched sends nothing, ever. Once you opt in, the first heartbeat fires an hour later.

In the admin console under **System → Usage stats** you can:

- Turn the heartbeat on or off at any time with **Send anonymous heartbeats**, then press **Save**.
- See the **Payload preview**: the exact JSON the next heartbeat would send, filled in with your install's current values.
- **Send now** fires a heartbeat immediately, for testing or just to see it happen (only while heartbeats are on).
- Change the **Collector URL** (default `https://telemetry.bulwarkmail.org/v1/heartbeat`) to point at your own collector. Clearing the field restores the default; it does not turn heartbeats off. Private and loopback addresses are refused unless `BULWARK_TELEMETRY_ALLOW_PRIVATE=1` is set, which is only useful while developing a collector.
- See when the last one went out.

## How to turn it on

Either turn on **Send anonymous heartbeats** under System → Usage stats in the admin console and press Save, or set `BULWARK_TELEMETRY=on` in the environment. Setting the environment variable either way locks the choice and greys out the admin toggle.

You're also asked once during setup: the setup wizard's Security step has a **Send anonymous usage stats to help improve Bulwark** switch (off by default), and the `setup.sh` installer asks the same question. Answering yes in `setup.sh` writes `BULWARK_TELEMETRY=on` to `.env.local`, which locks the admin switch until you remove the line.

## How to turn it off again

- In the admin console, turn off **Send anonymous heartbeats** under System → Usage stats and press Save.
- Set `BULWARK_TELEMETRY=off` in your environment (`.env`, `docker-compose.yml`, or your systemd unit). This wins over the admin switch. The older `BULWARK_TELEMETRY_DISABLED=1` still works when `BULWARK_TELEMETRY` is unset.
- Turn off third-party traffic (`NO_THIRD_PARTY_TRAFFIC=true`, or Organisation → Security → Third-party traffic in the admin console). This stops telemetry along with Bulwark's other connections to outside services, and it wins over `BULWARK_TELEMETRY`.
- Block `telemetry.bulwarkmail.org` at your firewall. Each failed heartbeat logs one warning; nothing else in Bulwark notices.

Clearing the Collector URL is not a way to turn it off: an empty field saves the default endpoint again.

The change takes effect as soon as you save it. To also reset your `instance_id`, so future heartbeats from this install look like a brand-new one, delete the `.telemetry-id` file in your telemetry data directory.

## Run your own collector

The collector is open source at [github.com/bulwarkmail/dashboard](https://github.com/bulwarkmail/dashboard) under `telemetry-collector/`. If you want the same data for your own fleet, point your installs at your own collector with the Collector URL field in the admin console.

<div class="bw-note"><b>Note.</b> Bulwark Lite has no server process and sends no heartbeat at all. This page only applies to the full edition.</div>

## Public dashboard

The aggregate numbers (active instances, version distribution, feature adoption percentages) are published on a read-only Grafana view linked from the privacy sub-page, so anyone, not just us, can see what we know.
