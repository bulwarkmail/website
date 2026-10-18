---
title: Demo mode
description: Run Bulwark against fixture data instead of a mail server.
order: 5
edition: both
---

# Demo mode

Demo mode swaps the JMAP client for a fixture backend. Every screen has plausible data in it, any username and password gets you in, and nothing leaves the process. It exists for three situations: developing the UI without standing up a mail server, showing the app to someone who hasn't got one, and running the public demo.

## Turning it on

For development, the shipped dev environment file already enables it:

```bash
cp .env.dev.example .env.local
npm run dev
```

For a container or a deployed instance, set one variable:

```env
DEMO_MODE=true
```

Then log in with anything at all. The credentials are not checked because there is nothing to check them against.

Bulwark Lite has the same switch as a build input: `LITE_DEMO_MODE=true` produces a static export whose login page offers the demo account, or set `"demoMode": true` in the shipped `config.json`. See [static hosting](/docs/deployment/static).

## What's in the fixtures

One person's week. Nora Lindqvist leads engineering at a small software company in the days before a product launch: her team's mail, a designer's invoice with the prototype attached, a calendar invitation waiting for an answer, a conference trip, receipts, newsletters and some spam. Two accounts are signed in (work and personal) and the company's shared Support mailbox is delegated to her, so the account switcher, the shared section and the merged inbox all have content.

The mail carries the headers a real server would add, so the viewer shows what it shows on a live account: the sender check fails on the phishing mail, newsletters have a one-click unsubscribe, one message asks for a read receipt, and remote images are blocked until you load them. Every attachment and every file in the Files app has real bytes behind it, so previews work, and contacts come with photos, groups and birthdays. Calendars, tasks, Sieve filters, identities, templates and a vacation response round it out. Dates float with the clock, so the inbox always looks like this morning.

## What it is not

Demo mode is not a sandbox around a real account, and it is not a read-only mode for one. Everything is fabricated in memory:

- Changes are lost on reload. There is no persistence layer behind the fixtures.
- Sending mail does nothing. No SMTP transaction happens.
- Stalwart-specific panels (account security, API keys, Sieve on the server) have no server to talk to and behave accordingly.

Never point a public demo at real data by leaving `DEMO_MODE` off and hoping. The two states are unrelated: `DEMO_MODE=true` means fixtures, and anything else means a live mail server.

## The hosted demo

There is a shared instance at [demo.bulwarkmail.org](https://demo.bulwarkmail.org). Everyone lands in the same mailbox, it is mostly read-only, and it is wiped every hour. Treat it as a screenshot you can click rather than an account.

## Related pages

- [Installation](/docs/getting-started/installation) - the non-demo path
- [Contributing](/docs/development/contributing) - the development loop demo mode was built for
