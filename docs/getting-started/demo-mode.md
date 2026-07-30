---
title: Demo mode
description: Run Bulwark against fixture data instead of a mail server.
order: 4
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

## What's in the fixtures

Emails, mailboxes, calendars, tasks, contacts, files, Sieve filters, identities, and a vacation response. Enough that no screen renders empty, and enough that layout work on the message list or the calendar grid has something realistic to push against.

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
