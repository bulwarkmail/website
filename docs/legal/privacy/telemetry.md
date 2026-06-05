---
title: Anonymous Usage Telemetry
description: Exact data collected by self-hosted Bulwark instances that opt into anonymous usage stats, and how it's stored.
order: 1
---

# Anonymous Usage Telemetry

This sub-page covers the **anonymous usage heartbeat** sent by self-hosted Bulwark webmail instances that opt in. The general project privacy policy is at [/docs/legal/privacy](/docs/legal/privacy). The friendly overview is the [feature page](/docs/features/telemetry); this page is the formal terms.

Last updated: 28 April 2026. Schema v1; the `push_relay` and `webdav_enabled` feature booleans were removed in this revision (push_relay was always reported false; webdav_enabled was a duplicate of `files`). `stalwart_version` is now actively probed from the JMAP server's `Server` response header instead of a static env var.

## Scope

Applies to instances of the Bulwark webmail software (the open-source Next.js app at `github.com/bulwarkmail/webmail`). Telemetry is enabled by default on fresh installs and can be disabled at any time. Disabling stops all future heartbeats; data already received from prior heartbeats can be deleted on request (see "Your rights" below).

Receiving server: `telemetry.bulwarkmail.org`, operated by the Bulwark project on hardware in the European Union (Germany).

## Default state

Telemetry is **enabled by default** on fresh installs. The first heartbeat fires **one hour** after the webmail process starts; an admin who installs and immediately disables telemetry will produce zero heartbeats. The exact JSON payload is visible verbatim in the admin UI before it is sent.

We default to enabled rather than blocking the install behind a consent modal because the data collected is **instance-level only and contains no personal data**: no email addresses, no hostnames, no IP addresses, no end-user information of any kind - only software version, deployment shape, which features are turned on, and bucketed account counts. See "Lawful basis" below for the legal reasoning.

Telemetry can be disabled at any time:

- In the admin UI (Settings → Anonymous usage stats → Disable).
- By setting `BULWARK_TELEMETRY=off` (or `BULWARK_TELEMETRY_DISABLED=1`) in the environment. The env var wins over the UI toggle.
- By clearing `BULWARK_TELEMETRY_URL` (empty value).
- By blocking `telemetry.bulwarkmail.org` at the network level.

## What is sent

One heartbeat per 24 hours, jittered ± 2 hours, containing exactly the following fields:

| Field                         | Type           | Example                            | Purpose                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`                      | string         | `"1"`                              | Lets us evolve the schema without breaking old senders.                                                                                                                                                                                                     |
| `instance_id`                 | uuid v4        | `f0c1...`                          | Distinguishes one install from another over time. Random, generated locally on first boot, stored at `<data-dir>/.telemetry-id`. Reset by deleting that file. Never tied to anything else.                                                                  |
| `ts`                          | ISO timestamp  | `2026-04-27T17:00:00Z`             | Stored rounded to the day; minute-level precision is discarded.                                                                                                                                                                                             |
| `version`                     | string         | `"1.4.8"`                          | Release adoption.                                                                                                                                                                                                                                           |
| `build`                       | string         | `"a1b2c3d"` or `"release"`         | Distinguishes published releases from local builds.                                                                                                                                                                                                         |
| `platform`                    | enum           | `docker`, `bare`, `k8s`, `unknown` | Where docs and bug-fix effort go.                                                                                                                                                                                                                           |
| `node_version`                | string         | `"20.11.0"`                        | Node compatibility horizon.                                                                                                                                                                                                                                 |
| `os_family`                   | enum           | `linux`, `darwin`, `windows`       | Coarse OS only. No distro, no kernel.                                                                                                                                                                                                                       |
| `stalwart_version`            | string or null | `"0.16.0"`                         | Stalwart upgrade adoption. Read from the `Server` response header on an unauthenticated `GET /.well-known/jmap` to the configured JMAP server, cached for 24 h. Null if Stalwart is unreachable, returns no `Server` header, or `JMAP_SERVER_URL` is unset. |
| `features.calendar`           | boolean        | `true`                             | Whether the calendar feature is enabled.                                                                                                                                                                                                                    |
| `features.contacts`           | boolean        | `true`                             | Whether contacts is enabled.                                                                                                                                                                                                                                |
| `features.files`              | boolean        | `false`                            | Whether files (WebDAV) is enabled.                                                                                                                                                                                                                          |
| `features.extensions`         | boolean        | `true`                             | Whether the marketplace integration is enabled.                                                                                                                                                                                                             |
| `features.oauth_enabled`      | boolean        | `false`                            | Whether OAuth is configured.                                                                                                                                                                                                                                |
| `features.smime_enabled`      | boolean        | `false`                            | Whether S/MIME is enabled.                                                                                                                                                                                                                                  |
| `counts.accounts`             | bucket string  | `"2-5"`                            | Approximate install size, bucketed (`1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`).                                                                                                                                                                         |
| `counts.accounts_active_7d`   | bucket string  | `"1"`                              | Approximate active-user count, same buckets.                                                                                                                                                                                                                |
| `counts.extensions_installed` | small int      | `2`                                | Marketplace traction. Not bucketed.                                                                                                                                                                                                                         |
| `counts.themes_installed`     | small int      | `0`                                | Same.                                                                                                                                                                                                                                                       |
| `uptime_days`                 | int            | `17`                               | Stability signal. Capped at 365.                                                                                                                                                                                                                            |

Total payload size is under 1 KB.

## What is explicitly NOT sent

- Email addresses, even hashed (a hashed address is still personally identifiable for a known target)
- Hostnames, FQDNs, your domain name, your server's hostname
- IP addresses on the server side - the `telemetry.bulwarkmail.org` nginx vhost has `access_log off`; the collector logs no IPs, no headers, no payload bodies
- Mail counts, folder counts, message sizes, attachment sizes, anything about message contents
- Timestamps of user actions (the heartbeat carries only its own send time)
- The names or slugs of installed marketplace extensions or themes (only the count)
- Stalwart deployment details (paths, ports, certificates, OAuth client IDs, config keys)
- Any string typed into the Bulwark UI

If a future schema version adds anything to the "what is sent" list, it will be visible in your admin UI's payload preview before it's sent, and this page will be updated with the "Last updated" date moved forward.

## Storage and retention

Heartbeats are written to a Postgres database named `telemetry`, separate from the databases backing other Bulwark services. Each row is keyed by `(instance_id, day)` so multiple heartbeats per day collapse into a single row.

- **Raw heartbeats** are retained for **90 days**, then deleted by an automated daily job.
- After 90 days, only **anonymized daily aggregates** survive - counts grouped by version, platform, feature, and account-count bucket, with no `instance_id` or per-instance grain.
- Backups of the telemetry database are kept on the same server, encrypted at rest. There is no off-site replication of telemetry data.

## Public dashboard

The aggregated numbers we derive from this data (active-instance counts, version distribution, feature adoption percentages, account-bucket histogram) are published on a read-only Grafana view at [grafana.external.bulwarkmail.org](https://grafana.external.bulwarkmail.org/), so anyone can audit what we have.

## Run your own collector

The receiving service is open source at [github.com/bulwarkmail/dashboard](https://github.com/bulwarkmail/dashboard) under `telemetry-collector/`. If you'd rather not share data with us, you can point your installs at your own collector by setting `BULWARK_TELEMETRY_URL` in your environment.

## How to opt out

- **In the admin UI:** Settings → Anonymous usage stats → toggle off.
- **By environment variable:** `BULWARK_TELEMETRY=off` (or `BULWARK_TELEMETRY_DISABLED=1`). Either wins over the UI toggle.
- **By blanking the endpoint:** `BULWARK_TELEMETRY_URL=` (empty value).
- **At the network:** block `telemetry.bulwarkmail.org` at your firewall. Heartbeats will silently fail with no impact on Bulwark.

To additionally make future heartbeats from this install look like a brand-new instance to us, delete the `.telemetry-id` file in your Bulwark data directory before re-enabling.

## Your rights

You can request:

- **What we hold tied to your `instance_id`** - open a GitHub issue or email us with the `instance_id` from your `.telemetry-id` file. We'll send back the raw rows and confirm what they are.
- **Deletion** - same channel. We delete all rows tagged with that `instance_id` from `heartbeats` and `instance_meta`. Aggregated data in `daily_rollups` cannot be unwound because no `instance_id` is stored there.

We respond within 30 days. If we hold no rows tagged with your `instance_id` (because you've never opted in, or because the rows have aged out past 90 days), we'll tell you that.

## Lawful basis (GDPR / DSGVO)

The data collected is **instance-level and contains no personal data of any data subject**. There is no email address, hostname, IP address, end-user identifier, or message content in any field - only software version, deployment shape, feature flags, and bucketed account counts. On that basis we take the position that the GDPR's processing rules for personal data **do not apply** to this data set, and the heartbeat can be enabled by default without prior consent.

To the extent any pseudonymous identifier (the `instance_id`) is treated as personal data under a strict reading of GDPR Art. 4(1) - which we don't believe it is in this context, because no link to a natural person exists or can be created from the stored fields - the lawful basis would be **legitimate interest** under Art. 6(1)(f): the project has a legitimate interest in maintaining and improving open-source software it provides at no cost, the processing is minimal and proportionate, and the data subject's rights are preserved by easy opt-out and a documented deletion path.

We do not rely on consent (Art. 6(1)(a)) precisely because consent must be opt-in to be valid under GDPR; auto-enabling telemetry would not satisfy that test. We rely instead on the data being non-personal (or at the outer edge, legitimate interest with full transparency and easy opt-out).

Disabling stops further collection. Data already received before the disable does not retroactively vanish - use the deletion request channel above to remove rows tagged with your `instance_id`.

## Contact

For data-protection questions, see the contact details at [github.com/bulwarkmail/webmail?tab=contributing-ov-file](https://github.com/bulwarkmail/webmail?tab=contributing-ov-file) (email is at the bottom).
