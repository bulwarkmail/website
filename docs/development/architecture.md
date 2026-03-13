---
title: Architecture
description: Technical architecture overview of Bulwark.
order: 2
---

# Architecture

An overview of Bulwark's technical architecture and design decisions.

## High-Level Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     JMAP/HTTP     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Bulwark    â”‚ â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º â”‚   Stalwart   â”‚
â”‚  (Next.js)   â”‚                  â”‚ Mail Server  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
       â”‚
       â”‚ React
       â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Browser    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Project Structure

```
webmail/
â”œâ”€â”€ app/                    # Next.js App Router pages
â”‚   â”œâ”€â”€ api/               # API routes (auth, config, health, etc.)
â”‚   â””â”€â”€ [locale]/          # Locale-aware routing
â”‚       â”œâ”€â”€ login/         # Login page
â”‚       â”œâ”€â”€ auth/          # OAuth callback
â”‚       â”œâ”€â”€ calendar/      # Calendar page
â”‚       â”œâ”€â”€ contacts/      # Contacts page
â”‚       â””â”€â”€ settings/      # Settings page
â”œâ”€â”€ components/            # React components
â”‚   â”œâ”€â”€ email/            # Email list, viewer, composer
â”‚   â”œâ”€â”€ calendar/         # Calendar views and event modals
â”‚   â”œâ”€â”€ contacts/         # Contact list, details, groups
â”‚   â”œâ”€â”€ layout/           # Sidebar, header, navigation
â”‚   â”œâ”€â”€ search/           # Search panel, chips
â”‚   â”œâ”€â”€ settings/         # Settings tabs
â”‚   â”œâ”€â”€ filters/          # Sieve filter builder
â”‚   â”œâ”€â”€ identity/         # Identity management
â”‚   â”œâ”€â”€ templates/        # Email template manager
â”‚   â””â”€â”€ ui/               # Reusable UI primitives
â”œâ”€â”€ contexts/             # React contexts (drag-and-drop)
â”œâ”€â”€ hooks/                # Custom React hooks
â”‚   â”œâ”€â”€ use-keyboard-shortcuts.ts
â”‚   â”œâ”€â”€ use-config.ts
â”‚   â”œâ”€â”€ use-focus-trap.ts
â”‚   â””â”€â”€ ...
â”œâ”€â”€ lib/                  # Utilities and libraries
â”‚   â”œâ”€â”€ jmap/            # Custom JMAP client (RFC 8620)
â”‚   â”œâ”€â”€ auth/            # Session cookies, encryption
â”‚   â”œâ”€â”€ oauth/           # OAuth discovery, PKCE, tokens
â”‚   â”œâ”€â”€ sieve/           # Sieve script generator/parser
â”‚   â””â”€â”€ stalwart/        # Stalwart API integration
â”œâ”€â”€ stores/               # Zustand state stores
â”‚   â”œâ”€â”€ auth-store.ts
â”‚   â”œâ”€â”€ email-store.ts
â”‚   â”œâ”€â”€ calendar-store.ts
â”‚   â”œâ”€â”€ contact-store.ts
â”‚   â”œâ”€â”€ settings-store.ts
â”‚   â”œâ”€â”€ theme-store.ts
â”‚   â”œâ”€â”€ filter-store.ts
â”‚   â”œâ”€â”€ template-store.ts
â”‚   â””â”€â”€ ...
â”œâ”€â”€ locales/              # Translation files (8 languages)
â”‚   â”œâ”€â”€ en/
â”‚   â”œâ”€â”€ fr/
â”‚   â”œâ”€â”€ ja/
â”‚   â”œâ”€â”€ es/
â”‚   â”œâ”€â”€ it/
â”‚   â”œâ”€â”€ de/
â”‚   â”œâ”€â”€ nl/
â”‚   â””â”€â”€ pt/
â”œâ”€â”€ i18n/                 # next-intl configuration
â””â”€â”€ e2e/                  # Playwright end-to-end tests
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

- `urn:ietf:params:jmap:mail` â€” Email (always required)
- `urn:ietf:params:jmap:calendars` â€” Calendar
- `urn:ietf:params:jmap:contacts` â€” Contacts with JMAP sync
- `urn:ietf:params:jmap:vacationresponse` â€” Vacation auto-reply
- `urn:ietf:params:jmap:sieve` â€” Server-side email filters

### Push Notifications

Bulwark uses JMAP's EventSource mechanism for real-time updates. When new emails arrive, calendar events change, or filter state updates, the server pushes notifications to the client without polling.

## State Management

- **Server state** â€” Managed via JMAP state tokens for efficient sync
- **UI state** â€” Zustand stores with persist middleware for client-side state
- **Theme state** â€” Zustand store persisted in `localStorage` with system preference detection
- **Settings state** â€” Zustand store with optional server-side sync (encrypted settings backup)

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
