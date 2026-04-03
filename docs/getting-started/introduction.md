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
- Full email management with archive modes, TNEF (`winmail.dat`) extraction, draft editing, embedded message/rfc822 unwrapping, email export/import, S/MIME-aware compose and reading flows, hover actions, resizable inline images, keyword filtering, reply-to addresses, auto-select reply identity, plain text composer mode, conversation threading toggle, and mail layout settings
- Calendar with event management, drag-and-drop scheduling, iTIP invitations with RSVP trust assessment, iCal/webcal subscriptions with editing and batch import, CalDAV discovery, client-side recurrence expansion, task management, shared calendar grouping, week numbers, pending event preview, hover preview settings, virtual location input, and shared time-format preferences
- Contact management with JMAP sync, vCard import/export from Settings, contact import, address book directories, category filtering, groups, pagination, and bulk operations
- File browser with upload, folder upload, preview, favorites, recent files, dynamic server-configured maximum upload sizes, and bulk operations
- Email templates with placeholder variables
- Server-side email filters via Sieve scripts with visual rule builder and expanded visual view
- Vacation auto-responder with Sieve generation and parsing
- Multiple sender identities with per-identity signatures and refresh after server-side changes
- Plugin system with schema-driven admin configuration, calendar event action slots, and extensible plugin architecture (including Jitsi Meet plugin)
- Stalwart admin panel with authentication, sidebar access, reorganized dashboard, dedicated policy sections, and plugin/theme management with forced enable/disable controls
- Dark and light themes with smart iframe email color transformation, an always-light email option, and custom favicon/logo branding
- Mobile-responsive design with bottom tab navigation and long-press context menus
- Custom sidebar apps with inline or new-tab launch modes, drag-and-drop reordering, and mobile visibility toggle
- Configurable UI options including hiding the account switcher and showing account avatars on the navigation rail
- Interactive guided tour for new user onboarding
- Demo mode with fixture data for exploring the interface without a mail server
- Keyboard shortcuts
- Real-time push notifications via JMAP EventSource
- Internationalization (9 languages: English, French, Japanese, Spanish, Italian, German, Dutch, Portuguese, Russian)
- OAuth2/OIDC with PKCE for SSO, non-interactive SSO for embedded deployments, OAuth app password support, plus TOTP two-factor authentication
- Custom JMAP server endpoints configurable from login and settings
- Encrypted settings sync across devices and accounts with folder expansion state management
- Structured logging with configurable categories, CSP enforcement, and comprehensive security hardening

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
