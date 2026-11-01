---
title: Anonymous usage telemetry
description: Exact data collected by self-hosted Bulwark instances that opt into anonymous usage stats, and how it's stored.
order: 1
edition: both
---

# Anonymous usage telemetry

This sub-page covers the **anonymous usage heartbeat** sent by self-hosted Bulwark webmail instances that opt in. The general project privacy policy is at [/docs/legal/privacy](/docs/legal/privacy). The [feature page](/docs/features/telemetry) is the plain-language version; this page is the formal terms.

Last updated: 1 November 2026. Schema v1, and schema v2 with the separately consented error counts and the optional instant error counts from the next release, after 1.19.1 (see [Error counts](#error-counts-schema-2) and [Instant error counts](#instant-error-counts)). Schema v1: the `push_relay` and `webdav_enabled` feature booleans were removed in an earlier revision (`push_relay` was always reported false, `webdav_enabled` duplicated `files`). From Bulwark {{BULWARK_VERSION}} on, `stalwart_version` is only what the admin sets in the `STALWART_VERSION` environment variable. Earlier releases, when it was unset, read it from the JMAP server's `Server` response header, which Stalwart doesn't send, so they reported null or the version of a reverse proxy in front of Stalwart.

## Scope

Applies to instances of the Bulwark webmail software (the open-source Next.js app at `github.com/bulwarkmail/webmail`). Bulwark Lite, the static export, has no server process and never sends a heartbeat. Telemetry is opt-in: it is off on a fresh install and stays off until an admin enables it. Turning it off again stops all future heartbeats; data already received can be deleted on request (see "Your rights" below).

Receiving server: `telemetry.bulwarkmail.org`, operated by the Bulwark project on hardware in the European Union (Germany).

## Default state

Telemetry is **off by default**. On first boot the app writes a state file recording consent as `off`, and no heartbeat is scheduled. An install that nobody touches sends nothing at any point.

When an admin opts in, the first heartbeat fires **one hour** later, and the exact JSON payload is visible in the admin console before that happens.

Enable it in one of three ways:

- In the setup wizard, step Security & sessions: Send anonymous usage stats to help improve Bulwark.
- In the admin console: Usage stats → Send anonymous heartbeats, then Save.
- By setting `BULWARK_TELEMETRY=on` in the environment.

Disable it in one of four ways:

- In the admin console: Usage stats → turn off Send anonymous heartbeats, then Save.
- By setting `BULWARK_TELEMETRY=off` (or the legacy `BULWARK_TELEMETRY_DISABLED=1`) in the environment. Either environment variable wins over the admin switch and greys it out.
- With the no-third-party switch (`NO_THIRD_PARTY_TRAFFIC=true`, or Organisation → Security → Third-party traffic), which wins over every other setting, `BULWARK_TELEMETRY=on` included.
- By blocking `telemetry.bulwarkmail.org` at the network level.

Error counts (schema v2) have their own consent, off by default: Usage stats → Also send anonymous error counts, or `BULWARK_TELEMETRY_ERRORS=on`. They are off whenever the heartbeat is off or the no-third-party switch is on, and switching the heartbeat off in the admin console switches them off too. `BULWARK_TELEMETRY_ERRORS=off` locks them off.

Sending error counts right away is a further choice on top, off by default: Usage stats → Send error counts right away, or `BULWARK_TELEMETRY_ERRORS=instant`. See [Instant error counts](#instant-error-counts).

Clearing the endpoint field does not turn telemetry off: Bulwark saves an empty field as the default collector, `https://telemetry.bulwarkmail.org/v1/heartbeat`.

## What is sent

One heartbeat per 24 hours, jittered ± 2 hours, containing exactly the following fields:

| Field                         | Type           | Example                            | Purpose                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`                      | string         | `"1"`                              | Lets us evolve the schema without breaking old senders.                                                                                                                                                                                                     |
| `instance_id`                 | uuid v4        | `f0c1...`                          | Distinguishes one install from another over time. Random, generated locally the first time someone signs in or the payload is built, stored at `data/telemetry/.telemetry-id` (or in `TELEMETRY_DATA_DIR`). Reset by deleting that file. Never tied to anything else. |
| `ts`                          | ISO timestamp  | `2026-04-27T17:00:00Z`             | Send time, stored rounded to the day. The time the heartbeat arrived is kept with the raw row, which is deleted after 90 days.                                                                                                                                                                     |
| `version`                     | string         | `"1.4.8"`                          | Release adoption.                                                                                                                                                                                                                                           |
| `build`                       | string         | `"a1b2c3d"` or `"release"`         | Distinguishes published releases from local builds.                                                                                                                                                                                                         |
| `platform`                    | enum           | `docker`, `bare`, `k8s`, `unknown` | Where docs and bug-fix effort go.                                                                                                                                                                                                                           |
| `node_version`                | string         | `"20.11.0"`                        | Node compatibility horizon.                                                                                                                                                                                                                                 |
| `os_family`                   | enum           | `linux`, `darwin`, `windows`, `unknown` | Coarse OS only. No distro, no kernel.                                                                                                                                                                                                                       |
| `stalwart_version`            | string or null | `"0.16.0"`                         | Stalwart upgrade adoption. The value of the `STALWART_VERSION` environment variable, which only the admin sets; null when it is unset. Bulwark doesn't ask the mail server for it.                                                                          |
| `features.calendar`           | boolean        | `true`                             | Whether the calendar feature is enabled.                                                                                                                                                                                                                    |
| `features.contacts`           | boolean        | `true`                             | Whether contacts is enabled.                                                                                                                                                                                                                                |
| `features.files`              | boolean        | `false`                            | Whether the Files app is on.                                                                                                                                                                                                                                |
| `features.extensions`         | boolean        | `true`                             | Whether plugins are switched on.                                                                                                                                                                                                                            |
| `features.oauth_enabled`      | boolean        | `false`                            | Whether OAuth is configured.                                                                                                                                                                                                                                |
| `features.smime_enabled`      | boolean        | `false`                            | Whether S/MIME is enabled.                                                                                                                                                                                                                                  |
| `counts.accounts`             | bucket string  | `"2-5"`                            | Accounts that signed in during the last 90 days, bucketed (`0`, `1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`).                                                                                                                                              |
| `counts.accounts_active_7d`   | bucket string  | `"1"`                              | Accounts that signed in during the last 7 days, same buckets.                                                                                                                                                                                               |
| `counts.extensions_installed` | small int      | `2`                                | Marketplace traction. Not bucketed.                                                                                                                                                                                                                         |
| `counts.themes_installed`     | small int      | `0`                                | Same.                                                                                                                                                                                                                                                       |
| `uptime_days`                 | int            | `17`                               | Stability signal. Capped at 365.                                                                                                                                                                                                                            |

Total payload size is under 1 KB for schema v1.

### Error counts (schema 2)

Only with the separate error-count consent. The heartbeat then has `"schema": "2"`, every field above unchanged, and one more:

| Field | Type | Example | Purpose |
| --- | --- | --- | --- |
| `errors` | list, at most 50 | | The errors the install counted on the last complete UTC day (the day before the heartbeat), the most frequent first. |
| `errors[].name` | identifier | `"TypeError"` | The error's class name in the code. |
| `errors[].fingerprint` | 16 hex digits | `"3f9a0c71d2e84b65"` | Groups the same error: a hash of the name, the top frames and the version. |
| `errors[].frames` | list, at most 5 | | Where in Bulwark's code it happened. |
| `errors[].frames[].path` | string | `"/_next/static/chunks/4821-ab12.js"` | The file inside Bulwark's bundle (`/_next/static/...` or `/.next/server/...`), without host, base path or query. Frames outside Bulwark's own files are left out. |
| `errors[].frames[].line`, `col` | int or null | `1`, `20817` | Position in that file. |
| `errors[].frames[].debug_id` | uuid or null | `c40c4654-...` | Identifies the file's source map, so the position can be read as source code. |
| `errors[].version` | string | `"1.20.0"` | The Bulwark version the error happened in. |
| `errors[].count` | bucket string | `"6-10"` | How often, in the same buckets as the account counts (`1` to `201+`). |
| `errors[].days` | int, 1-7 | `3` | On how many of the last 7 days it happened. |
| `errors[].message` | string, optional | `"Email/set: overQuota"` | Only one of Bulwark's fixed error codes (a JMAP error type, optionally with the method name, or `http:<status>`). Never other message text. |

The collector rejects a schema 2 heartbeat with any other field, with free text where a code or identifier belongs, with a path outside Bulwark's bundles, or with more than 50 errors or 5 frames. Each error adds a few hundred bytes, and the collector refuses a heartbeat over 64 KB.

### Instant error counts

With **Send error counts right away** on (from the next release, after 1.19.1), the install also posts error counts to `/v1/errors` on the collector, at most once a minute. A post holds `schema` (`"1"`), the `instance_id`, `day` (the current UTC day) and `errors`: entries with exactly the fields of the schema 2 errors above, for the errors of that day that are new or reached a higher count bucket since the last post. Nothing is posted when nothing changed.

What this adds: the collector sees roughly when during the day errors happen on an install, to the minute, from when the post arrives. It doesn't store that time; it stores the counts for the day, like the heartbeat's, and the next heartbeat replaces them with the complete day. The first report of an error on a day, from any install, goes to our error tracker at once, without the `instance_id`, stamped with the time it came in.

The collector applies the same checks as for schema 2, refuses a post for any day other than today or yesterday, and accepts one post per install every 30 seconds.

## What is never sent

- Email addresses, even hashed (a hashed address is still personally identifiable for a known target)
- Hostnames, FQDNs, your domain name, your server's hostname
- IP addresses on the server side: the `telemetry.bulwarkmail.org` nginx vhost has `access_log off`, and the collector logs no IPs, headers or payload bodies
- Mail counts, folder counts, message sizes, attachment sizes, anything about message contents
- Timestamps of user actions (the heartbeat carries only its own send time; error counts carry no time, only the UTC day they are for. Instant error counts are posted within about a minute, so their arrival tells the collector roughly when an error happened)
- The names or slugs of installed marketplace extensions or themes (only the count)
- Stalwart deployment details (paths, ports, certificates, OAuth client IDs, config keys)
- Any string typed into the Bulwark UI
- Error message text: an error count carries a message only when it is one of Bulwark's fixed error codes
- URLs, page addresses and query strings: frames name files inside Bulwark's bundle, without host or path prefix

If a future schema version adds anything to the "what is sent" list, it will be visible in the admin console's payload preview before it's sent, and we will update this page and move the "Last updated" date forward.

## Storage and retention

Heartbeats are written to a Postgres database named `telemetry`, separate from the databases backing other Bulwark services. Each row is keyed by `(instance_id, day)` so multiple heartbeats per day collapse into a single row.

- **Raw heartbeats** are retained for **90 days**, then deleted by an automated daily job.
- After 90 days we keep **daily aggregates** (counts grouped by version, platform, feature, and account-count bucket) without any `instance_id`, and in `instance_meta`, per `instance_id`, only the first and last day it was seen and on how many days. An `instance_meta` row is deleted once its instance hasn't been seen for 90 days; only a count of such deleted rows per day stays, with no `instance_id`.
- **Error counts** (schema v2) are stored per `(instance_id, day, fingerprint, version)` in a table of their own and deleted after **90 days**, like the raw heartbeats.
- Backups of the telemetry database are kept on the same server, encrypted at rest. There is no off-site replication of telemetry data.

### Error counts in the error tracker

Once a day's counts are complete (two days later), the collector forwards each error to an error tracker, Bugsink, that the Bulwark project runs on the same server as the collector. It sends one event per error, version and day, combined across all installs: the error's name, fixed code if any, frames, version, the day, how many installs reported it and their count buckets. **No `instance_id` and no field that could identify an install goes to Bugsink.** Bugsink keeps events for **90 days**. It has no public view; reading it needs an account on it.

Instant error counts add one event per error, version and day: the first time any install reports it that day, with the same fields from that one report and the time it arrived. Again without an `instance_id`. At most 30 such events a minute go out; the rest show up with the daily summary.

## Public dashboard

The aggregated numbers we derive from this data (active-instance counts, version distribution, feature adoption percentages, account-bucket histogram) are published on a read-only Grafana view at [grafana.external.bulwarkmail.org](https://grafana.external.bulwarkmail.org/), so anyone can audit what we have.

## Run your own collector

The receiving service is open source at [github.com/bulwarkmail/dashboard](https://github.com/bulwarkmail/dashboard) under `telemetry-collector/`. If you'd rather not share data with us, you can point your installs at your own collector from the endpoint field in the admin UI.

## How to opt out again

- **In the admin console:** Usage stats → turn off Send anonymous heartbeats, then Save.
- **By environment variable:** `BULWARK_TELEMETRY=off` (or the legacy `BULWARK_TELEMETRY_DISABLED=1`). Either wins over the admin switch.
- **With the no-third-party switch:** `NO_THIRD_PARTY_TRAFFIC=true`, or Organisation → Security → Third-party traffic. It wins over every other setting.
- **At the network:** block `telemetry.bulwarkmail.org` at your firewall. Each failed heartbeat logs one warning, and Bulwark otherwise works as before.

To also make any future heartbeats from this install look like a brand-new instance to us, delete the `.telemetry-id` file in your telemetry data directory before re-enabling.

## Your rights

You can request:

- **What we hold tied to your `instance_id`:** open a GitHub issue or email us with the `instance_id` from your `.telemetry-id` file. We'll send back the raw rows and confirm what they are.
- **Deletion:** same channel. We delete all rows tagged with that `instance_id` from `heartbeats`, `instance_meta` and the error counts. Aggregated data in `daily_rollups` and the events already forwarded to Bugsink cannot be unwound, because no `instance_id` is stored there.

We respond within 30 days. If we hold no rows tagged with your `instance_id`, because you never opted in, we'll tell you that. After 90 days only the `instance_meta` row (first day, last day, number of days seen) is left, and it goes too once the instance hasn't reported for 90 days.

## Lawful basis (GDPR / DSGVO)

The data collected is **instance-level and contains no personal data of any data subject**. No email address, hostname, IP address, end-user identifier, or message content appears in any field: only software version, deployment shape, feature flags, and bucketed account counts. On that basis we take the position that the GDPR's processing rules for personal data do not apply to this data set.

Independently of that, collection is **opt-in**. Nothing is sent until an administrator turns it on, having been shown the exact payload first, so the arrangement also satisfies consent under Art. 6(1)(a) if a supervisory authority reads the `instance_id` as a pseudonymous identifier under Art. 4(1). We do not believe it is one, because no link to a natural person exists or can be constructed from the stored fields.

Turning telemetry off stops further collection but doesn't delete data already received. Use the deletion request channel above to remove rows tagged with your `instance_id`.

## Contact

For data-protection questions, see the contact details at [github.com/bulwarkmail/webmail?tab=contributing-ov-file](https://github.com/bulwarkmail/webmail?tab=contributing-ov-file) (email is at the bottom).

## Next step

To turn the heartbeat on or off, see [Anonymous usage stats](/docs/features/telemetry).
