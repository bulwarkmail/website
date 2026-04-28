---
title: Architecture
description: Technical architecture overview of Bulwark.
order: 2
---

# Architecture

An overview of Bulwark's technical architecture and design decisions.

## High-Level Architecture

```
┌──────────────┐     JMAP/HTTP      ┌──────────────┐
│   Browser    │ ─────────────────► │   Stalwart   │
│ React + Zus. │                    │ Mail Server  │
└──────────────┘                    └──────────────┘
       ▲                                    ▲
       │                                    │
       │  Bootstraps auth, serves config    │ JMAP `x:` (admin)
       ▼                                    │
┌──────────────┐                            │
│   Bulwark    │ ───────────────────────────┘
│  (Next.js)   │
└──────────────┘
```

After authentication bootstrap, the browser talks JMAP directly to Stalwart. Bulwark's Next.js server is responsible for credential encryption, OAuth PKCE flows, runtime config, settings sync persistence, and the admin dashboard - never as a proxy for normal mail traffic.

## Project Structure

```
webmail/
├── app/                       # Next.js App Router
│   ├── api/                   # API routes (auth, config, health, sso, settings, admin, etc.)
│   └── [locale]/              # Locale-aware routing
│       ├── login/             # Login page
│       ├── auth/              # OAuth callback
│       ├── calendar/          # Calendar page
│       ├── contacts/          # Contacts page
│       ├── files/             # JMAP FileNode browser
│       ├── admin/             # Admin dashboard
│       └── settings/          # Settings page
├── components/                # React components, organized by feature
│   ├── email/                 # Email list, viewer, composer
│   ├── calendar/              # Calendar views, event modals, task views
│   ├── contacts/              # Contact list, detail, groups, address books
│   ├── files/                 # File browser, previews, upload
│   ├── layout/                # Sidebar, navigation rail, header
│   ├── search/                # Search panel, chips
│   ├── settings/              # Settings tabs, identities, S/MIME, PWA
│   ├── filters/               # Sieve filter builder
│   ├── identity/              # Identity management
│   ├── templates/             # Email template manager
│   ├── plugins/               # Plugin host, slots, harness
│   ├── admin/                 # Admin dashboard panels
│   └── ui/                    # Reusable UI primitives
├── contexts/                  # React contexts (drag-and-drop, etc.)
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities and libraries
│   ├── jmap/                  # Custom JMAP client (RFC 8620)
│   ├── auth/                  # Session cookies, AES-256-GCM crypto
│   ├── oauth/                 # OAuth discovery, PKCE, token exchange
│   ├── sieve/                 # Sieve script generator/parser
│   ├── smime/                 # S/MIME sign/encrypt/decrypt/verify
│   ├── tnef/                  # winmail.dat extractor
│   ├── ical/                  # iCal/iMIP encoder and decoder
│   ├── plugins/               # Plugin loader, sandbox, permissions, proxy
│   ├── admin/                 # Admin session, config manager, audit log
│   └── stalwart/              # Stalwart `x:` JMAP method bindings
├── stores/                    # Zustand state stores
│   ├── auth-store.ts
│   ├── email-store.ts
│   ├── calendar-store.ts
│   ├── contact-store.ts
│   ├── file-store.ts
│   ├── settings-store.ts
│   ├── theme-store.ts
│   ├── filter-store.ts
│   ├── template-store.ts
│   ├── identity-store.ts
│   ├── plugin-store.ts
│   └── ...
├── locales/                   # Translation files (15 languages)
│   ├── en/                    # English
│   ├── fr/                    # Français
│   ├── ja/                    # 日本語
│   ├── es/                    # Español
│   ├── it/                    # Italiano
│   ├── de/                    # Deutsch
│   ├── nl/                    # Nederlands
│   ├── pt/                    # Português
│   ├── ru/                    # Русский
│   ├── ko/                    # 한국어
│   ├── pl/                    # Polski
│   ├── lv/                    # Latviešu
│   ├── zh/                    # 简体中文
│   ├── uk/                    # Українська
│   └── cs/                    # Čeština
├── i18n/                      # next-intl configuration
├── public/                    # Static assets, branding, PWA icons, service worker
└── e2e/                       # Playwright end-to-end tests
```

## JMAP Integration

Bulwark communicates with Stalwart exclusively through JMAP via a custom client. The client is wrapped behind an interface abstraction that allows swapping between a live JMAP backend and a demo backend with fixture data - used by `npm run dev` with `.env.dev.example` and by demo deployments. Custom JMAP server endpoints can be configured from login and settings via `ALLOW_CUSTOM_JMAP_ENDPOINT`.

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

- `urn:ietf:params:jmap:core` - required, batched method calls and state tokens
- `urn:ietf:params:jmap:mail` - required, email and mailbox handling
- `urn:ietf:params:jmap:calendars` - calendar events and tasks
- `urn:ietf:params:jmap:contacts` - JMAP ContactCard / AddressBook
- `urn:ietf:params:jmap:vacationresponse` - vacation auto-reply
- `urn:ietf:params:jmap:sieve` - server-side email filters
- Stalwart's JMAP FileNode extension - cloud file storage
- Stalwart's `x:` method namespace - admin, API keys, app passwords (Stalwart 0.16+)

### Session URL Rewriting

Bulwark rewrites the URLs returned in the JMAP session resource to match the origin the client connects to. This is what makes deployments where Stalwart returns an internal hostname (e.g., `http://stalwart:8080`) work transparently behind a reverse proxy.

### Plugin System

Bulwark includes an extensible plugin system with:

- **Schema-driven configuration** - plugins declare a config schema, the admin UI is generated from it
- **Render hooks** - plugins can render into named slots (calendar event actions, composer sidebar, etc.)
- **Intercept hooks** - plugins can intercept user actions like send, reply, archive
- **`onAvatarResolve` hook** - provide custom avatar resolution logic
- **Plugin i18n API** - plugins ship their own translation bundles
- **Sandboxed HTTP proxy** - plugins talk to external services through a server-side proxy with origin validation, never exposing user credentials
- **`frameOrigins` manifest field** - plugins declare which `https://host` origins they need to embed; the proxy reads the union of enabled plugin origins and merges into the host CSP `frame-src`
- **Disabled by default + admin approval** - plugins are inert until an admin enables them
- **Dangerous-pattern detection** - plugins with prohibited JS patterns are blocked at install time
- **Theme bundles** - themes are uploaded as ZIP packages and managed alongside plugins

A bundled Jitsi Meet plugin demonstrates the calendar event slot.

### Push Notifications

Bulwark uses JMAP's EventSource mechanism for real-time updates. When new emails arrive, calendar events change, or filter state updates, the server pushes notifications to the client without polling.

## State Management

- **Server state** - Managed via JMAP state tokens for efficient incremental sync
- **UI state** - Zustand stores with optional `persist` middleware
- **Theme state** - Zustand store persisted in `localStorage` with system preference detection
- **Settings state** - Zustand store with optional encrypted server-side sync (`SETTINGS_SYNC_ENABLED`)
- **Per-account state** - Cached in memory while the account is active so account switching is instant; OAuth refresh tokens are stored encrypted in httpOnly cookies

## Security

- All communication uses HTTPS in production
- Session-based auth with no plaintext password storage
- Optional "Remember me" with AES-256-GCM encrypted httpOnly cookies (30-day expiry)
- OAuth2/OIDC with PKCE; server-side PKCE state for embedded SSO survives top-level navigation
- Strict session secret length validation
- HTML sanitization with DOMPurify
- External content blocked by default with per-sender trust list
- Enforced CSP with per-request nonce
- Plugin `frameOrigins` merged into host CSP `frame-src`
- X-Content-Type-Options, X-Frame-Options (when not embedding), Referrer-Policy, and Permissions-Policy headers
- SSRF redirect validation
- IP spoofing prevention (configurable trusted-proxy depth)
- PDF iframe sandbox for safe document preview
- Plugin sandbox with dangerous-pattern detection and admin approval requirement
- Encrypted settings sync (per-account AES-256-GCM)
- S/MIME with per-account key isolation
