---
title: Introduction
description: Learn what Bulwark is and why it was built.
order: 1
---

# Introduction

**Bulwark** is a modern, open-source webmail client built with [Next.js](https://nextjs.org) and the [JMAP protocol](https://jmap.io) for [Stalwart Mail Server](https://stalw.art). It provides email, calendar, contacts, and cloud files in one interface with modern security and customization features.

## Why Bulwark?

Most webmail clients are either outdated, slow, or lack modern features. Bulwark was created to fill this gap by providing:

- **Modern UI/UX** - A clean, responsive interface built with cutting-edge web technologies
- **JMAP Protocol** - Leveraging the modern JMAP standard instead of legacy IMAP for superior performance
- **Stalwart Integration** - First-class support for Stalwart Mail Server, including Sieve filters, vacation responder, account security management, JMAP FileNode storage, and runtime branding options
- **Open Source** - Fully open-source under the AGPL v3 license

## Key Features

- **Multi-account support** - Manage up to 5 email accounts with instant switching and per-account state preservation
- Full email management with archive modes, TNEF (`winmail.dat`) extraction, draft editing, embedded message/rfc822 unwrapping, email export/import, S/MIME-aware compose and reading flows, and keyword filtering
- Calendar with event management, drag-and-drop scheduling, iTIP invitations with RSVP trust assessment, iCal/webcal subscriptions, task list view, shared calendar grouping, and shared time-format preferences
- Contact management with JMAP sync, vCard import/export from Settings, contact import, address book directories, groups, and bulk operations
- File browser with upload, preview, favorites, recent files, and bulk operations
- Email templates with placeholder variables
- Server-side email filters via Sieve scripts with visual rule builder
- Vacation auto-responder
- Multiple sender identities with per-identity signatures and refresh after server-side changes
- Dark and light themes with smart iframe email color transformation, an always-light email option, and custom favicon/logo branding
- Mobile-responsive design with bottom tab navigation and long-press context menus
- Custom sidebar apps with inline or new-tab launch modes
- Keyboard shortcuts
- Real-time push notifications via JMAP EventSource
- Internationalization (8 languages: English, French, Japanese, Spanish, Italian, German, Dutch, Portuguese)
- OAuth2/OIDC with PKCE for SSO, plus TOTP two-factor authentication
- Encrypted settings sync across devices and accounts

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

- [GitHub Repository](https://github.com/bulwarkmail/webmail) - Source code and issue tracker
- [Stalwart Documentation](https://stalw.art/docs) - Mail server setup and configuration
- [JMAP Specification](https://jmap.io) - Protocol documentation
