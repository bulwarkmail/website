---
title: Introduction
description: Learn what Bulwark is and why it was built.
order: 1
---

# Introduction

**Bulwark** is a modern, open-source webmail client built with [Next.js](https://nextjs.org) and the [JMAP protocol](https://jmap.io) for [Stalwart Mail Server](https://stalw.art). It provides email, calendar, and contacts — all in one beautiful interface.

## Why Bulwark?

Most webmail clients are either outdated, slow, or lack modern features. Bulwark was created to fill this gap by providing:

- **Modern UI/UX** — A clean, responsive interface built with cutting-edge web technologies
- **JMAP Protocol** — Leveraging the modern JMAP standard instead of legacy IMAP for superior performance
- **Stalwart Integration** — First-class support for Stalwart Mail Server, including Sieve filters, vacation responder, and account security management
- **Open Source** — Fully open-source under the MIT license

## Key Features

- Full email management (compose, read, organize, search with filter panel)
- Calendar with event management, drag-and-drop scheduling, and iTIP invitations
- Contact management with JMAP sync, vCard import/export, and groups
- Email templates with placeholder variables
- Server-side email filters via Sieve scripts with visual rule builder
- Vacation auto-responder
- Multiple sender identities with per-identity signatures
- Dark and light themes with system preference detection
- Mobile-responsive design with bottom tab navigation
- Keyboard shortcuts
- Real-time push notifications via JMAP EventSource
- Internationalization (8 languages: English, French, Japanese, Spanish, Italian, German, Dutch, Portuguese)
- OAuth2/OIDC with PKCE for SSO, plus TOTP two-factor authentication
- Settings sync across devices

## Tech Stack

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Next.js 16      | React framework          |
| TypeScript      | Type safety              |
| Tailwind CSS v4 | Styling                  |
| Zustand         | State management         |
| JMAP            | Mail protocol (RFC 8620) |
| next-intl       | Internationalization     |
| Lucide React    | Icon library             |
| Stalwart        | Mail server              |

## Getting Help

- [GitHub Repository](https://github.com/bulwarkmail/webmail) — Source code and issue tracker
- [Stalwart Documentation](https://stalw.art/docs) — Mail server setup and configuration
- [JMAP Specification](https://jmap.io) — Protocol documentation
