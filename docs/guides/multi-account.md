---
title: Multi-Account Support
description: Manage up to 5 simultaneous email accounts in Bulwark.
order: 6
---

# Multi-Account Support

Bulwark supports managing up to 5 simultaneous email accounts in a single browser session. Each account maintains its own JMAP session and per-account state, so switching is instant and nothing has to be re-fetched on a switch.

## Requirements

Multi-account requires `SESSION_SECRET` to be set so per-account credentials can be persisted encrypted across browser restarts:

```env
SESSION_SECRET=your-32-char-secret-here
```

Without `SESSION_SECRET`, only the currently active account is held in memory and accounts are lost when the browser closes.

For Docker / Kubernetes secret mounts, use `SESSION_SECRET_FILE` instead:

```env
SESSION_SECRET_FILE=/run/secrets/session_secret
```

## Adding an Account

1. Click your avatar in the bottom-left to open the account switcher.
2. Click **Add account** (also available as a button on the navigation rail).
3. Sign in with the new account's credentials. Both Basic Auth and OAuth are supported, and accounts can use different authentication methods.
4. The new account is added and becomes active.

## Switching Accounts

Click any account in the account switcher to switch instantly. Per-account state (mailboxes, contacts, calendar, filters, identities) is cached in memory so the switch is immediate. If a per-account store is empty (first switch in a session), it's lazy-loaded on demand.

## Per-Account State

Each account maintains its own:

- JMAP session and authentication tokens
- Mailbox tree, email cache, and unread counts
- Contacts and address books
- Calendars, events, and tasks
- Files (FileNode tree, recent files, favorites)
- Sieve filters, vacation responder, identities, and templates
- S/MIME certificates and per-account key isolation
- Settings (when settings sync is enabled, settings are scoped per account)

OAuth refresh tokens are stored encrypted in httpOnly cookies, scoped per account.

## Default Account

You can mark one account as the default. The default account loads on initial sign-in and is the fallback target for the unified inbox. Set the default from the account switcher.

## Unified Inbox

A unified mailbox view aggregates new mail from every connected account into a single list. Each row is annotated with the source account so you always know which mailbox an email lives in. The unified inbox is toggleable from the sidebar.

## Shared Folders

Folders shared with one account are surfaced under that account in the sidebar. Shared account folder layouts mirror primary folders so navigation stays consistent.

## Connection Status

The account switcher shows per-account connection status (connected, reconnecting, error). Connection loss is handled transparently — JMAP push reconnects automatically and search/filter state is preserved across reconnects.

## Removing an Account

From the account switcher → account context menu → **Sign out**. Removing an account purges its in-memory state, encrypted cookie, and any per-account settings stored under settings sync.

## Identities vs. Accounts

Accounts and sender identities are separate:

- **Accounts** are full mailboxes with their own JMAP session.
- **Identities** are aliases under a single account — for example, a single Stalwart account with `you@personal.com` and `you@work.com` aliases configured. Identities have per-identity signatures and selectable from the composer.

You can use both: multiple accounts, each with multiple identities.

## Sub-addressing

Identities support sub-addressing (`user+tag@domain.com`). When composing a reply, Bulwark suggests contextual tags based on the recipient. Sub-addressing also works with auto-select reply identity.

## Limits and Performance

- **Maximum accounts** — 5 simultaneous accounts. The cap exists to keep memory and push connections bounded.
- **Push connections** — One JMAP EventSource per account, established lazily on first switch.
- **Session cookie size** — Per-account encrypted state fits within typical cookie size limits; very large refresh tokens may require server-side session storage. If you hit cookie size issues with many OAuth providers, contact support.

## Troubleshooting

### Account is removed unexpectedly

If `SESSION_SECRET` changes between deployments, all encrypted account cookies become unreadable and accounts are dropped. Pick a stable secret and persist it (e.g., via Docker secrets or `SESSION_SECRET_FILE`).

### "Stale account" warning

Bulwark detects accounts whose JMAP session is no longer valid (password changed, OAuth refresh token revoked, account deleted on the server) and prompts re-authentication on next switch.

### Mailbox tree appears empty

On first login Bulwark retries mailbox fetch to handle Stalwart's lazy provisioning of new accounts. If you still see an empty tree, check the JMAP server logs for permission errors.
