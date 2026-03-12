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
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── docs/         # Documentation pages
├── components/       # Reusable React components
├── lib/              # Utility functions and helpers
└── types/            # TypeScript type definitions
```

## JMAP Integration

Bulwark communicates with Stalwart exclusively through the JMAP protocol. Key aspects:

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

### Push Notifications

Bulwark uses JMAP's EventSource mechanism for real-time updates. When new emails arrive or state changes occur, the server pushes updates to the client without polling.

## State Management

- **Server state** — Managed via JMAP state tokens for efficient sync
- **UI state** — React state and context for component-level state
- **Theme state** — Persisted in `localStorage`

## Security

- All communication uses HTTPS
- Authentication tokens stored securely in HTTP-only cookies
- XSS prevention through React's built-in escaping
- CSRF protection via Same-Site cookies
