---
title: Architecture
description: How the browser, the Next.js server, and Stalwart divide the work.
order: 2
---

# Architecture

Where the work happens, and why it was split up this way.

## The shape of it

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

After authentication bootstrap, the browser talks JMAP directly to Stalwart. Bulwark's Next.js server is responsible for credential encryption, OAuth PKCE flows, runtime config, settings sync persistence, the first-launch setup wizard, and the admin dashboard - never as a proxy for normal mail traffic.

## Project structure

```
webmail/
├── app/                       # Next.js App Router
│   ├── api/                   # API routes (auth, config, health, sso, settings, admin, setup, push, etc.)
│   └── [locale]/              # Locale-aware routing
│       ├── login/             # Login page
│       ├── auth/              # OAuth callback
│       ├── setup/             # First-launch setup wizard
│       ├── calendar/          # Calendar page
│       ├── contacts/          # Contacts page
│       ├── files/             # JMAP FileNode browser
│       ├── admin/             # Admin dashboard (single tabbed page)
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
│   ├── plugins/               # Plugin loader, sandbox, permissions, proxy, esbuild on-demand
│   ├── admin/                 # Admin session, config manager (split config/state), audit log
│   ├── setup/                 # First-launch web setup wizard
│   ├── telemetry/             # Anonymous heartbeat (opt-out)
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
├── locales/                   # One directory per language, 24 of them:
│                              #   ar ca cs da de en es fa fr he hu it
│                              #   ja ko lv nl pl pt ro ru sk tr uk zh
├── i18n/                      # next-intl configuration
├── public/                    # Static assets, branding, PWA icons, service worker
└── e2e/                       # Playwright end-to-end tests
```

## JMAP integration

Everything Bulwark says to Stalwart goes over JMAP, through a client of its own. That client sits behind an interface, so a demo backend with fixture data can take its place; `npm run dev` with `.env.dev.example` does exactly that, and so do demo deployments. With `ALLOW_CUSTOM_JMAP_ENDPOINT`, the server URL can also come from the login form or from settings.

### Request and response pattern

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

### Capability detection

At session creation Bulwark reads the advertised capabilities and turns features on accordingly:

- `urn:ietf:params:jmap:core` - required, batched method calls and state tokens
- `urn:ietf:params:jmap:mail` - required, email and mailbox handling
- `urn:ietf:params:jmap:calendars` - calendar events and tasks
- `urn:ietf:params:jmap:contacts` - JMAP ContactCard / AddressBook
- `urn:ietf:params:jmap:vacationresponse` - vacation auto-reply
- `urn:ietf:params:jmap:sieve` - server-side email filters
- Stalwart's JMAP FileNode extension - cloud file storage
- Stalwart's `x:` method namespace - admin, API keys, app passwords (Stalwart 0.16+)

### Session URL rewriting

The URLs in the JMAP session resource are rewritten to the origin the client actually connected to. That is what lets a Stalwart advertising an internal hostname such as `http://stalwart:8080` work behind a reverse proxy without the browser ever noticing.

### Plugin system

The plugin system covers:

- **Schema-driven configuration** - plugins declare a config schema, the admin UI is generated from it inline
- **Render hooks** - plugins can render into named slots (calendar event actions, composer sidebar, email banner/footer, sidebar widget, settings sections, context menus, navigation rail, toolbars)
- **Intercept hooks** - plugins can intercept user actions like send, reply, archive
- **`onBeforeEmailSend` hook** - hook into the outgoing send pipeline; `OutgoingEmail` exposes `fromEmail` so plugins can branch on identity
- **`onAvatarResolve` hook** - provide custom avatar resolution logic
- **Plugin i18n API** - plugins ship their own translation bundles
- **Sandboxed HTTP proxy** - plugins talk to external services through a server-side proxy with origin validation, never exposing user credentials
- **`http:fetch` + `httpOrigins`** - per-plugin allowlist of outbound origins enforced by the proxy
- **`frameOrigins` manifest field** - plugins declare which `https://host` origins they need to embed; the proxy reads the union of enabled plugin origins and merges into the host CSP `frame-src`
- **Hot-reload and dev folder** - `PLUGIN_DEV_DIR` loads plugins from a folder during development, esbuild bundles `src/` on demand
- **Install/uninstall restricted to admin dashboard** - regular users cannot add or remove plugins
- **Disabled by default + admin approval** - plugins are inert until an admin enables them
- **Dangerous-pattern detection** - plugins with prohibited JS patterns are blocked at install time
- **Theme bundles** - themes are uploaded as ZIP packages and managed alongside plugins; theme API v2 includes a token compiler and skin slot

A bundled Jitsi Meet plugin demonstrates the calendar event slot.

### Push notifications

Real-time updates ride JMAP push: new mail, calendar changes, and filter state all arrive because the server sends them, not because the client asked. On HTTP/2 the push streams multiplex over one connection, which is what lifted the old 5-account cap. That cap was never ours; it came from HTTP/1.1 connection pooling in the browser.

Web push notifications layer on top of this: when the user grants permission, the service worker subscribes to JMAP push for the inbox and surfaces new-mail notifications even when the tab is closed.

## State management

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
