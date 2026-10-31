---
title: Privacy policy
description: What data the Bulwark project collects, why, and where it lives.
order: 1
edition: both
---

# Privacy policy

Last updated: 31 October 2026

This page covers the services we operate at `bulwarkmail.org`, `extensions.bulwarkmail.org`, the public push relay, and the analytics we use across them. Bulwark itself is open-source software you can run on your own server; if you do that, you operate your own privacy-relevant infrastructure and this policy doesn't speak for you.

## TL;DR

- We don't read your mail. The webmail talks to your mail server directly. We never see message contents.
- We use **self-hosted Umami** for site analytics - no cookies, no cross-site tracking, no Google Analytics.
- The **push relay** sees your device's or browser's push token, an account label (your sign-in name, usually your email address) and the ids of changed mailboxes and messages. Not subjects, not senders, not bodies.
- We collect GitHub data about our own repositories (stars, issues, traffic, release downloads) for our internal dashboard. No personal data.
- We don't sell data to anyone. We don't share it with anyone except where strictly needed to deliver the service (e.g. Google FCM for push delivery).

## Who is "we"

The Bulwark project. For data-protection questions, see the contact details at [github.com/bulwarkmail/webmail?tab=contributing-ov-file](https://github.com/bulwarkmail/webmail?tab=contributing-ov-file) (email is at the bottom).

## bulwarkmail.org (the marketing site)

Hosted by us on our own server. Static content plus a thin Next.js layer for documentation pages.

**What's collected:**

- Standard nginx access logs (IP, user-agent, requested path, response code). Rotated and discarded after 14 days.
- Anonymous analytics via self-hosted **Umami**:
  - URL path, referrer, browser, OS, country (derived from IP via a local geo lookup; the IP itself is not stored)
  - A hashed session ID. Umami changes the salt behind it once a month, so visits in the same month can be linked to each other, but not across months
  - No cookies, no fingerprinting, no `localStorage` tracking

**What is _not_ collected:**

- No advertising or marketing trackers
- No third-party scripts at all - fonts are self-hosted (downloaded at build time into `/_next/static/media/`, served from `bulwarkmail.org`); the only script the page loads from anywhere is `umami.bulwarkmail.org/script.js`, which is also ours
- No account or login on this site

You can opt out of analytics by blocking `umami.bulwarkmail.org` in your browser or a content blocker. The analytics script does not check your browser's "Do Not Track" setting.

## extensions.bulwarkmail.org (the extensions marketplace)

The directory of plugins and themes for Bulwark webmail.

Same self-hosted-everything story as the marketing site: fonts are bundled into the app's static assets, no third-party CDNs. The one exception is **GitHub-hosted avatars** (`avatars.githubusercontent.com`) shown next to author profiles - these are loaded directly by your browser when you view a page that displays an author. We don't proxy them, and GitHub will see the request.

**Browsing the marketplace** uses the same Umami analytics described above. When a bundle (`.zip`) is downloaded, the directory's server also sends an `extension-download` event to Umami with the bundle path and size, and your browser's user agent and referrer.

To count each download once, the directory stores a salted hash of your IP address and your browser's user agent with every download, and deletes these records after 90 days. Only the download counts per day and per version stay.

**Authoring extensions** requires signing in with your **GitHub account** via OAuth. After successful login we store:

- Your GitHub user ID, login, display name, avatar URL, bio and website, and the primary email address GitHub has verified for you (notifications go there)
- Whether you want email notifications
- Any extensions you submit, including the GitHub repository URL, ref, manifest snapshot, and bundle scan report
- Ratings and reviews you write, and reports you send (a report may include a contact address)
- API tokens you create, with a salted hash of the IP address that last used each one
- A log of what you do in the directory, with a salted hash of your IP address

You can request deletion of your author profile and submissions by opening an issue or emailing us. Submissions tied to extensions that are still listed publicly may be retained as part of the audit trail; we'll discuss what's possible if you ask.

**Reviewers / admins:** the same fields as authors, plus the actions they take on submissions.

## notifications.relay.bulwarkmail.org (the push relay)

When your mail server has something new, the relay wakes your phone or browser. That's the whole job.

The relay accepts a JMAP push from your mail server and passes it on as a Firebase Cloud Messaging or Apple push (mobile app), a Web Push message (browser notifications from the webmail) or a UnifiedPush message (Android phones without Google services), so self-hosters don't need their own Firebase project or push keys.

**What the relay sees and stores:**

- The push address you registered: an FCM (Android) or APNs (iOS) token from the app, a Web Push subscription from your browser, or a UnifiedPush endpoint
- An account label, which Bulwark and the mobile app set to your sign-in name (usually your email address) so the device can tell accounts apart
- While a push is in flight: the JMAP `@type`, the JMAP account id and the ids of changed mailboxes, emails or calendars
- Timestamps of the registration and the most recent push

**What the relay does _not_ see:**

- Mail subjects, senders, recipients, bodies, attachments. If your mail server puts any of these in the push, the relay drops them and passes on only the message ids; the device fetches the rest from your mail server itself.
- Your mail server's URL. The relay sees the IP address a push comes from, but the relay software doesn't store it.

**Retention:** subscriptions are deleted after 90 days of inactivity, when your device's push token becomes invalid (FCM tells us), or when you uninstall/sign out and the app calls the unregister endpoint.

**Third party:** we hand pushes for the mobile app to **Google Firebase Cloud Messaging** (Android) or Apple's APNs (iOS), browser pushes to your browser vendor's push service, and UnifiedPush messages to the distributor you chose. Their privacy policies apply to that hop. We hand them the change type, the account label, the account id and the ids of changed messages, nothing from the messages themselves. FCM messages are not end-to-end encrypted, so Google can read the account label. Web Push messages, and UnifiedPush messages when the app supplies keys, are encrypted for the receiving browser or app, so the push service in between can't read them.

Source code for the relay is at [github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay). You can run your own relay for the webmail's browser notifications and for UnifiedPush: admins list it under Admin > User policy > Push relays, and the mobile app lets you enter its URL. Push to the published mobile app through Google or Apple only works through ours, because it needs the project's Firebase and Apple keys.

## Self-hosted Bulwark instances (update check and telemetry)

If you run Bulwark on your own server, it asks `version.telemetry.bulwarkmail.org` once an hour whether a newer release exists, sending only its version number. This is on by default. That server keeps no access logs and doesn't log the version it is asked about. Turn it off with `BULWARK_UPDATE_CHECK=off`. Admin > Marketplace loads plugins and themes from `extensions.bulwarkmail.org`, and browser notifications use our push relay unless the admin lists another. The no-third-party switch (`NO_THIRD_PARTY_TRAFFIC=on`, or Admin > Organisation > Security > Third-party traffic) stops all of these, and telemetry too; see [Third-party traffic](/docs/guides/organisation/third-party-traffic).

The install can also send one anonymous usage heartbeat per day to `telemetry.bulwarkmail.org`. This is **opt-in and off by default**: a fresh install sends nothing until an admin turns it on, in admin settings or with `BULWARK_TELEMETRY=on`. Once enabled, the first heartbeat fires an hour later.

Heartbeats contain instance-level information only: version, platform (Docker, bare metal, or Kubernetes), which features are enabled, and bucketed account counts (`0`, `1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`). No email addresses, no hostnames, no IPs (the receiving server's nginx logs are off), no message data, no end-user information. Raw rows are deleted after 90 days. After that we keep daily totals and, per instance id, only the first and last day it was seen and on how many days.

The full schema, field-by-field intent, retention policy, lawful basis, opt-out instructions, and a public read-only dashboard of the aggregate numbers are on the [telemetry sub-page](/docs/legal/privacy/telemetry).

## Internal observability

We run an internal Grafana dashboard for the project's own operations. It pulls:

- GitHub data about the `bulwarkmail` org's repositories (star counts, open issues/PRs, traffic stats GitHub already shows repo admins, release download counts) via the GitHub API
- Operational metrics from the relay (push counts, latencies, no per-user data)
- Aggregated counts from the same Umami events the marketplace generates
- Anonymous daily heartbeats from the self-hosted instances that opted in (see the [telemetry sub-page](/docs/legal/privacy/telemetry) for the exact data, lawful basis, and opt-out instructions)

This dashboard is private and never publicly exposed. It contains no personal data beyond what's already public on GitHub.

## Cookies

The marketing site and the marketplace **do not set tracking cookies**. The marketplace sets one cookie, `ext_author_session`, when you sign in with GitHub. It holds the sign-in state during the GitHub login and then keeps you signed in for up to 14 days. Umami does not use cookies.

## Data location

All servers we operate are in the European Union (Germany). FCM/APNs delivery hops through Google/Apple infrastructure, and browser notifications through the browser vendor's push service, which are global.

## Your rights (GDPR, where applicable)

You have the right to ask what data we hold about you, request its deletion, request correction, and lodge a complaint with a supervisory authority. The fastest path is to open a GitHub issue or email us; we'll respond within 30 days.

If you've never logged into the marketplace and don't use a relay-backed Bulwark client, the only data we hold tied to you is anonymous Umami events, short-lived nginx access logs and, if you downloaded or reported an extension, the directory's records with a salted hash of your IP address.

## Changes

We'll update this page when the answer to "what does Bulwark collect" changes. The "Last updated" date at the top reflects the most recent edit. If a change is material we'll mention it in the project's release notes.

## Next step

[Anonymous usage telemetry](/docs/legal/privacy/telemetry) has the details of the heartbeat an instance can send.
