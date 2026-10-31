---
title: Multi-account support
description: Manage multiple simultaneous email accounts in Bulwark.
order: 6
edition: both
---

# Multi-account support

Several accounts can be signed in at once in a single browser session. Each keeps its own JMAP session and its own cached state, so switching between them fetches nothing.

On an HTTP/2 server you can add up to 50 accounts; that limit comes from how many cookies a browser keeps per site. On HTTP/1.1 Bulwark stops at 5, which leaves one of the browser's six connections per origin free for ordinary requests. Bulwark reads the protocol from the initial navigation's timing entry, so a deployment behind an HTTP/2 proxy is recognised without configuration. Each tab keeps at most two live push streams; the other accounts check for changes by polling, so many logins can't starve ordinary requests.

## Requirements

Multi-account needs a session secret so per-account credentials can be persisted encrypted across browser restarts (Bulwark Lite keeps them in the browser instead, as Stalwart refresh tokens, and needs no secret). Bulwark generates one on first start and keeps it in the admin state directory. To set your own:

```env
SESSION_SECRET=your-32-char-secret-here
```

For Docker / Kubernetes secret mounts, use `SESSION_SECRET_FILE` instead:

```env
SESSION_SECRET_FILE=/run/secrets/session_secret
```

## Adding an account

1. Click your avatar in the bottom-left to open the account switcher.
2. Click **Add account** (also available as a button on the navigation rail).
3. Sign in with the new account's credentials. Both Basic Auth and OAuth are supported, and accounts can use different authentication methods.
4. The new account is added and becomes active.

## Switching accounts

<img class="theme-light-only" src="/screenshots/light-account-switcher.webp" alt="The account switcher with two signed-in accounts" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-account-switcher.webp" alt="The account switcher with two signed-in accounts" width="5120" height="2880" />

Click any account in the account switcher to switch instantly. Per-account state (mailboxes, contacts, calendar, filters, identities) is cached in memory so the switch is immediate. If a per-account store is empty (first switch in a session), it's lazy-loaded on demand.

## Per-account state

Each account maintains its own:

- JMAP session and authentication tokens
- Mailbox tree, email cache, and unread counts
- Contacts and address books
- Calendars, events, and tasks
- Files (FileNode tree, recent files, favorites)
- Sieve filters, vacation responder, identities, and templates
- Settings (when settings sync is enabled, settings are scoped per account)

OAuth refresh tokens are stored encrypted in httpOnly cookies, scoped per account.

## Default account

You can mark one account as the default. The default account loads on initial sign-in and is the fallback target for the unified inbox. Set the default from the account switcher.

## Unified inbox

<img class="theme-light-only" src="/screenshots/light-unified-inbox.webp" alt="The unified inbox: mail from both accounts and the shared mailbox in one list" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-unified-inbox.webp" alt="The unified inbox: mail from both accounts and the shared mailbox in one list" width="5120" height="2880" />

Turn on **Unified mailbox** in Settings > Appearance > Multiple accounts to get one Inbox, Sent, Drafts and so on for the active account and its shared and group mailboxes. It is off by default. If your admin allows it (**Unified Mailbox: Cross-account** in the admin console, off on new installs), **Across all accounts** adds every signed-in account. Rows show the folder they come from, and **Tell accounts apart** marks each with its account's color.

## Shared folders

<img class="theme-light-only" src="/screenshots/light-shared-mailbox.webp" alt="A shared Support mailbox under its own heading in the sidebar" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-shared-mailbox.webp" alt="A shared Support mailbox under its own heading in the sidebar" width="5120" height="2880" />

Folders shared with one account are surfaced under that account in the sidebar. Shared account folder layouts mirror primary folders so navigation stays consistent.

## Connection status

The account switcher shows a green dot for a connected account and a warning icon when its connection failed. When a connection drops, JMAP push reconnects on its own and whatever search or filter you had applied survives the reconnect.

## Removing an account

In the account switcher choose **Sign out of** the account, or **Remove account** on its row. **Sign out of all accounts** signs out every one. Removing an account purges its in-memory state, encrypted cookie, and any per-account settings stored under settings sync.

## Account list backup

When the administrator turns on **Account List Backup** under **User policy** in the admin console, users can keep the list of accounts in their browser on the Bulwark server and bring it back on another device. The list is encrypted in the browser with a backup password the user picks, at least 10 characters long, which can't be recovered. Save, restore and delete it under **Settings → Account → Account list backup**.

Mailbox passwords aren't saved, so after a restore you sign in to each new account from the account list. With **Account List Backup: Passwords** also on, users can include the passwords of accounts that signed in with one, and those accounts then sign in by themselves after a restore. Anyone who learns the backup password gets into every mailbox in that list.

Signing in on a browser that knows no other account, with a list saved for that account, opens a dialog that asks for the backup password and restores the list. **Not now** hides the offer for that account in this browser; the restore stays in Settings.

The lists are stored in `SETTINGS_DATA_DIR/account-archives`, and the feature needs a session secret.

<div class="bw-note bw-note-brand"><b>Not in Lite.</b> The list is stored on the Bulwark server, which Lite doesn't have.</div>

## Identities versus accounts

Accounts and sender identities are separate:

- **Accounts** are full mailboxes with their own JMAP session.
- **Identities** are aliases under a single account - for example, a single Stalwart account with `you@personal.com` and `you@work.com` aliases configured. Identities have per-identity signatures and selectable from the composer.

You can use both: multiple accounts, each with multiple identities.

## Sub-addressing

Identities support sub-addressing (`user+tag@domain.com`). When composing a reply, Bulwark suggests contextual tags based on the recipient. Sub-addressing also works with auto-select reply identity. Change the delimiter in Settings > Account > Email addresses > **Sub-address delimiter** (defaults to `+`, supports other commonly used separators like `-` for compatibility with mail servers that don't use `+`).

## Limits and performance

- **Maximum accounts** - 50 on HTTP/2 or HTTP/3, 5 on HTTP/1.1.
- **Push connections** - At most two live push streams per tab; further accounts check for changes by polling until a stream frees up.
- **Session cookie size** - Per-account encrypted state fits within typical cookie size limits; very large refresh tokens may require server-side session storage. Each account gets its own `cookieSlot` so OAuth flows don't clobber each other.

## Troubleshooting

### Account is removed unexpectedly

If the session secret changes between deployments, all encrypted account cookies become unreadable and accounts are dropped. Keep the admin state directory on a persistent volume, or set a stable secret yourself (e.g., via Docker secrets or `SESSION_SECRET_FILE`).

After the mail server moved from Stalwart 0.16 to 1.0, accounts that signed in with single sign-on or with a two-factor code drop out of the list, because their tokens weren't migrated. Add them again. See [Upgrading to Stalwart 1.0](/docs/deployment/updating/stalwart-1-0#moving-a-016-server-to-10).

### "Stale account" warning

Bulwark detects accounts whose JMAP session is no longer valid (password changed, OAuth refresh token revoked, account deleted on the server) and prompts re-authentication on next switch.

### Mailbox tree appears empty

On first login Bulwark retries mailbox fetch to handle Stalwart's lazy provisioning of new accounts. If you still see an empty tree, check the JMAP server logs for permission errors.
