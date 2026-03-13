---
title: Architecture
description: Technical architecture overview of Bulwark.
order: 2
---

# Architecture

An overview of Bulwark's technical architecture and design decisions.

## High-Level Architecture

```
┌─────────────┐     JMAP/HTTP     ┌──────────────┐
│   Bulwark    │ ◄──────────────► │   Stalwart   │
│  (Next.js)   │                  │ Mail Server  │
└─────────────┘                   └──────────────┘
       │
       │ React
       ▼
┌─────────────┐
│   Browser    │
└─────────────┘
```

## Project Structure

```
jmap-webmail/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, config, health, etc.)
│   └── [locale]/          # Locale-aware routing
│       ├── login/         # Login page
│       ├── auth/          # OAuth callback
│       ├── calendar/      # Calendar page
│       ├── contacts/      # Contacts page
│       └── settings/      # Settings page
├── components/            # React components
│   ├── email/            # Email list, viewer, composer
│   ├── calendar/         # Calendar views and event modals
│   ├── contacts/         # Contact list, details, groups
│   ├── layout/           # Sidebar, header, navigation
│   ├── search/           # Search panel, chips
│   ├── settings/         # Settings tabs
│   ├── filters/          # Sieve filter builder
│   ├── identity/         # Identity management
│   ├── templates/        # Email template manager
│   └── ui/               # Reusable UI primitives
├── contexts/             # React contexts (drag-and-drop)
├── hooks/                # Custom React hooks
│   ├── use-keyboard-shortcuts.ts
│   ├── use-config.ts
│   ├── use-focus-trap.ts
│   └── ...
├── lib/                  # Utilities and libraries
│   ├── jmap/            # Custom JMAP client (RFC 8620)
│   ├── auth/            # Session cookies, encryption
│   ├── oauth/           # OAuth discovery, PKCE, tokens
│   ├── sieve/           # Sieve script generator/parser
│   └── stalwart/        # Stalwart API integration
├── stores/               # Zustand state stores
│   ├── auth-store.ts
│   ├── email-store.ts
│   ├── calendar-store.ts
│   ├── contact-store.ts
│   ├── settings-store.ts
│   ├── theme-store.ts
│   ├── filter-store.ts
│   ├── template-store.ts
│   └── ...
├── locales/              # Translation files (8 languages)
│   ├── en/
│   ├── fr/
│   ├── ja/
│   ├── es/
│   ├── it/
│   ├── de/
│   ├── nl/
│   └── pt/
├── i18n/                 # next-intl configuration
└── e2e/                  # Playwright end-to-end tests
```

## JMAP Integration

Bulwark communicates with Stalwart exclusively through the JMAP protocol via a custom client implementation. Key aspects:

### Request/Response Pattern

All JMAP operations use a single HTTP endpoint. Requests are batched method calls:

```json
{
  "using": ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
  "methodCalls": [
    ["Email/query", { "filter": { "inMailbox": "inbox-id" } }, "call-0"],
    [
      "Email/get",
      { "#ids": { "resultOf": "call-0", "path": "/ids" } },
      "call-1"
    ]
  ]
}
```

### Capability Detection

Bulwark detects server capabilities at session creation and conditionally enables features:

- `urn:ietf:params:jmap:mail` — Email (always required)
- `urn:ietf:params:jmap:calendars` — Calendar
- `urn:ietf:params:jmap:contacts` — Contacts with JMAP sync
- `urn:ietf:params:jmap:vacationresponse` — Vacation auto-reply
- `urn:ietf:params:jmap:sieve` — Server-side email filters

### Push Notifications

Bulwark uses JMAP's EventSource mechanism for real-time updates. When new emails arrive, calendar events change, or filter state updates, the server pushes notifications to the client without polling.

## State Management

- **Server state** — Managed via JMAP state tokens for efficient sync
- **UI state** — Zustand stores with persist middleware for client-side state
- **Theme state** — Zustand store persisted in `localStorage` with system preference detection
- **Settings state** — Zustand store with optional server-side sync (encrypted settings backup)

## Security

- All communication uses HTTPS
- Session-based auth with no password storage by default
- Optional "Remember me" with AES-256-GCM encrypted httpOnly cookies
- OAuth2/OIDC with PKCE for SSO
- HTML sanitization with DOMPurify
- External content blocked by default
- CSP headers with per-request nonce
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy headers
- CORS misconfiguration detection with actionable error messages
