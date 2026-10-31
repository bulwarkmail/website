---
title: Demo mode
description: Run Bulwark against fixture data instead of a mail server.
order: 7
edition: both
---

# Demo mode

Demo mode swaps the JMAP client for a fixture backend. Every screen has plausible data in it, any username and password gets you in, and nothing leaves the process. It exists for three situations: developing the UI without standing up a mail server, showing the app to someone who hasn't got one, and running the public demo.

## Turning it on

Set `DEMO_MODE=true`. On a fresh install with no `JMAP_SERVER_URL`, the setup wizard comes first, so also set `JMAP_SERVER_URL` to any address (demo mode doesn't use it) or finish the wizard:

```env
DEMO_MODE=true
JMAP_SERVER_URL=https://mail.example.com
```

For development, put these two lines in `.env.local` and run `npm run dev`. The shipped `.env.dev.example` starts a different helper: a mock JMAP server that also accepts any password, with its own test data instead of the set described below.

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

There is a public instance at [demo.bulwarkmail.org](https://demo.bulwarkmail.org). It runs in demo mode as described above: everyone sees the same sample mailbox, nothing is saved or sent, and a reload starts over. Treat it as a screenshot you can click rather than an account.

<img class="theme-light-only" src="/screenshots/light-demo-login.webp" alt="The demo's sign-in page with a Launch Demo button and no account fields" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-demo-login.webp" alt="The demo's sign-in page with a Launch Demo button and no account fields" width="5120" height="2880" />

## Related pages

- [Installation](/docs/getting-started/installation) - the non-demo path
- [Contributing](/docs/development/contributing) - the development loop demo mode was built for
