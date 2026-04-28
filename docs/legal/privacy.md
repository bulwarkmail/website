---
title: Privacy Policy
description: What data the Bulwark project collects, why, and where it lives.
order: 1
---

# Privacy Policy

Last updated: 28 April 2026

This page covers the services we operate at `bulwarkmail.org`, `extensions.bulwarkmail.org`, the public push relay, and the analytics we use across them. Bulwark itself is open-source software you can run on your own server; if you do that, you operate your own privacy-relevant infrastructure and this policy doesn't speak for you.

## TL;DR

- We don't read your mail. The webmail talks to your mail server directly. We never see message contents.
- We use **self-hosted Umami** for site analytics - no cookies, no cross-site tracking, no Google Analytics.
- The **push relay** sees your FCM/APNs token and a list of changed mailboxes. Not subjects, not senders, not bodies.
- We collect **public** GitHub data (stars, issues, traffic) for our internal dashboard. No personal data.
- We don't sell data to anyone. We don't share it with anyone except where strictly needed to deliver the service (e.g. Google FCM for push delivery).

## Who is "we"

The Bulwark project. For data-protection questions, see the contact details at [github.com/bulwarkmail/webmail?tab=contributing-ov-file](https://github.com/bulwarkmail/webmail?tab=contributing-ov-file) (email is at the bottom).

## bulwarkmail.org (the marketing site)

Hosted by us on our own server. Static content plus a thin Next.js layer for documentation pages.

**What's collected:**

- Standard nginx access logs (IP, user-agent, requested path, response code). Rotated and discarded after 14 days.
- Anonymous analytics via self-hosted **Umami**:
  - URL path, referrer, browser, OS, country (derived from IP via a local geo lookup; the IP itself is not stored)
  - A daily hashed session ID - rotates every 24 hours, cannot be linked across days
  - No cookies, no fingerprinting, no `localStorage` tracking

**What is _not_ collected:**

- No advertising or marketing trackers
- No third-party scripts at all - fonts are self-hosted (downloaded at build time into `/_next/static/media/`, served from `bulwarkmail.org`); the only script the page loads from anywhere is `umami.bulwarkmail.org/script.js`, which is also ours
- No account or login on this site

You can opt out of analytics by enabling "Do Not Track" in your browser, or by blocking `umami.bulwarkmail.org` in your browser/extension of choice.

## extensions.bulwarkmail.org (the extensions marketplace)

The directory of plugins and themes for Bulwark webmail.

Same self-hosted-everything story as the marketing site: fonts are bundled into the app's static assets, no third-party CDNs. The one exception is **GitHub-hosted avatars** (`avatars.githubusercontent.com`) shown next to author profiles - these are loaded directly by your browser when you view a page that displays an author. We don't proxy them, and GitHub will see the request.

**Browsing the marketplace** uses the same Umami analytics described above, plus three server-side events that are recorded when they happen:

- `extension-download` - when a bundle (`.zip`) is fetched. We record the bundle path and size. No information about you beyond what Umami collects above.
- `extension-submit` - when an author submits an extension. We record the slug, version, and submission type.
- `extension-review` - when a reviewer approves or rejects a submission. We record the action and the slug.

**Authoring extensions** requires signing in with your **GitHub account** via OAuth. After successful login we store:

- Your GitHub user ID, login, display name, avatar URL, and (if your GitHub profile exposes it) email
- Any extensions you submit, including the GitHub repository URL, ref, manifest snapshot, and bundle scan report

You can request deletion of your author profile and submissions by opening an issue or emailing us. Submissions tied to extensions that are still listed publicly may be retained as part of the audit trail; we'll discuss what's possible if you ask.

**Reviewers / admins:** the same fields as authors, plus the actions they take on submissions.

## relay.bulwarkmail.org (the push relay)

When your mail server has something new, the relay pings your phone. That's the whole job.

The relay accepts a JMAP `StateChange` body from your mail server and forwards it as a Firebase Cloud Messaging push so self-hosters don't need their own Firebase project.

**What the relay sees and stores:**

- An FCM (Android) or APNs (iOS) push token you registered from your device
- An optional account label you gave it (just so you can tell your accounts apart on the device)
- The JMAP `@type` and the list of changed mailbox/email/calendar IDs, while a push is in flight
- Timestamps of the registration and the most recent push

**What the relay does _not_ see:**

- Mail subjects, senders, recipients, bodies, attachments - none of it. The relay forwards a "something changed" ping; the device fetches details directly from your mail server.
- Your email address, your mail server's address, or any user account identifiers other than the FCM/APNs token

**Retention:** subscriptions are deleted after 90 days of inactivity, when your device's push token becomes invalid (FCM tells us), or when you uninstall/sign out and the app calls the unregister endpoint.

**Third party:** we hand the push payload to **Google Firebase Cloud Messaging** (Android) or Apple's APNs (iOS) for delivery. Their privacy policies apply to that hop. We minimize what we hand them - the data payload contains the change type and changed-IDs map only.

Source code for the relay is at [github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay). If you'd rather not use ours, you can run your own; the mobile app lets you point at a different relay URL.

## Self-hosted Bulwark instances (anonymous usage telemetry)

If you run Bulwark on your own server, the install sends one anonymous usage heartbeat per day to `telemetry.bulwarkmail.org`. This is **enabled by default** because the data is instance-level only - no email addresses, no hostnames, no IPs (the receiving server's nginx logs are turned off), no message data, and no end-user information. Disabling is one click in admin settings or `BULWARK_TELEMETRY=off` in the environment. The first heartbeat fires one hour after the webmail process starts, so an install + immediate-disable produces zero pings.

Heartbeats contain instance-level information only - version, platform (Docker / bare / k8s), which features are enabled, and bucketed account counts (`1`, `2-5`, `6-10`, `11-50`, `51-200`, `201+`). Raw rows are deleted after 90 days; only anonymized aggregates survive longer.

The full schema, field-by-field intent, retention policy, lawful basis, opt-out instructions, and a public read-only dashboard of the aggregate numbers are on the [telemetry sub-page](/docs/legal/privacy/telemetry).

## Internal observability

We run an internal Grafana dashboard for the project's own operations. It pulls:

- **Public** GitHub data for the `bulwarkmail` org (star counts, open issues/PRs, traffic stats GitHub already shows repo admins, release download counts) via the GitHub API
- Operational metrics from the relay (push counts, latencies, no per-user data)
- Aggregated counts from the same Umami events the marketplace generates
- Anonymous daily heartbeats from self-hosted instances (enabled by default, disable at any time - see the [telemetry sub-page](/docs/legal/privacy/telemetry) for the exact data, lawful basis, and disable instructions)

This dashboard is private and never publicly exposed. It contains no personal data beyond what's already public on GitHub.

## Cookies

The marketing site and the marketplace **do not set tracking cookies**. The marketplace sets a session cookie (`__author_session`, `__admin_session`) only after you log in with GitHub OAuth, and only for the duration of your session. Umami does not use cookies.

## Data location

All servers we operate are in the European Union (Germany). FCM/APNs delivery hops through Google/Apple infrastructure, which is global.

## Your rights (GDPR, where applicable)

You have the right to ask what data we hold about you, request its deletion, request correction, and lodge a complaint with a supervisory authority. The fastest path is to open a GitHub issue or email us; we'll respond within 30 days.

If you've never logged into the marketplace and don't use a relay-backed Bulwark client, the only data we hold tied to you is anonymous Umami events and short-lived nginx access logs - which by design we cannot map back to a person.

## Changes

We'll update this page when the answer to "what does Bulwark collect" changes. The "Last updated" date at the top reflects the most recent edit. If a change is material we'll mention it in the project's release notes.
