---
title: Master-User Impersonation
description: Land platform admins directly inside a tenant's mailbox via signed JWT handoff, without storing tenant passwords.
order: 10
---

# Master-User Impersonation

This guide explains how to wire up a control panel's "Open Webmail" button so an operator lands directly inside a tenant's mailbox in Bulwark — without re-prompting for the mailbox password.

Bulwark consumes a short-lived signed JWT from your platform, verifies it, and mints a webmail session as the target mailbox using Stalwart's native **master-user impersonation** protocol. The actual login uses a Stalwart account with the `Admin` role and a `<target>%<master>` username syntax. No tenant credentials are stored anywhere.

## Prerequisites

- A Stalwart account with the `Admin` role (the master account).
- The mailbox to impersonate must exist on the same Stalwart server.
- Bulwark ≥ 1.6.7 (route + `app-top-banner` plugin slot).
- A shared HS256 signing secret between your platform and the Bulwark process.

## Configuration

Add the following environment variables to the Bulwark process:

```env
# Required: ≥32 chars, shared with your platform's JWT minter
BULWARK_JWT_AUTH_SECRET=<48 random chars>

# Required: Stalwart account with the Admin role
BULWARK_STALWART_MASTER_USER=master@example.com
BULWARK_STALWART_MASTER_PASSWORD=<that account's password>

# Optional: must match the JWT's `iss` claim. Defaults to "platform-api/webmail".
BULWARK_JWT_AUTH_ISSUER=platform-api/webmail
```

When any of the three required variables is missing, `GET /api/auth/impersonate` returns `404 Not found` — the endpoint is invisible on an unconfigured deployment.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

| Variable                            | Description                                                | Default                  |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------ |
| `BULWARK_JWT_AUTH_SECRET`           | HS256 signing key (≥32 chars). Route is disabled if unset. | _empty (disabled)_       |
| `BULWARK_STALWART_MASTER_USER`      | Stalwart account with `Admin` role.                        | _empty (disabled)_       |
| `BULWARK_STALWART_MASTER_PASSWORD`  | Master account's password.                                 | _empty (disabled)_       |
| `BULWARK_JWT_AUTH_ISSUER`           | Expected `iss` claim.                                      | `platform-api/webmail`   |

## JWT Contract

Sign an HS256 JWT with these claims and link to the resulting URL:

```
GET https://webmail.example.com/api/auth/impersonate?token=<jwt>
```

| Claim            | Required | Notes                                                                |
| ---------------- | -------- | -------------------------------------------------------------------- |
| `alg` (header)   | yes      | Must be `HS256`. Other algs are rejected before signature check.     |
| `typ` (header)   | optional | When set, must be `JWT`.                                             |
| `iss`            | yes      | Must match `BULWARK_JWT_AUTH_ISSUER`.                                |
| `iat`            | yes      | Issued-at, epoch seconds. ±60 s clock skew tolerated.                |
| `exp`            | yes      | Expiry, epoch seconds. Lifetime capped at **300 s**.                 |
| `nbf`            | optional | Not-before, epoch seconds. Honoured when present.                    |
| `jti`            | yes      | Random UUID. Replay-rejected via in-memory LRU per Bulwark process.  |
| `mailbox`        | yes      | Target email address. Must **not** contain `%` or `:`.               |
| `tenant_id`      | optional | Free-form tenant identifier. Logged in the audit line.               |
| `actor_user_id`  | optional | Platform user who triggered the handoff. Logged in the audit line.   |

### Minting a token (Node, zero deps)

```js
const crypto = require('node:crypto');

const secret = process.env.BULWARK_JWT_AUTH_SECRET;
const mailbox = 'alice@tenant.com';

const b64 = (x) => Buffer.from(x).toString('base64url');
const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const now = Math.floor(Date.now() / 1000);
const payload = b64(JSON.stringify({
  iss: 'platform-api/webmail',
  iat: now,
  exp: now + 120,                 // 2 minutes
  jti: crypto.randomUUID(),
  mailbox,
  tenant_id: 'acme-corp',         // optional, audit only
  actor_user_id: 'ops-jdoe',      // optional, audit only
}));
const sig = crypto.createHmac('sha256', secret)
  .update(`${header}.${payload}`).digest('base64url');

console.log(`https://webmail.example.com/api/auth/impersonate?token=${header}.${payload}.${sig}`);
```

## How It Works

1. **Platform mints a JWT** signed with `BULWARK_JWT_AUTH_SECRET` and includes the target mailbox.
2. **User clicks "Open Webmail"** — the browser hits `/api/auth/impersonate?token=<jwt>`.
3. **Bulwark verifies** the signature, claims, mailbox sanity and `jti` (replay-rejected on second use).
4. **Bulwark builds the master-user Basic header** — `Basic base64(<mailbox>%<master>:<password>)` — using the credentials from env.
5. **Cookies are set** identically to a password login (`jmap_session` + `jmap_stalwart_ctx`, encrypted with `SESSION_SECRET`).
6. **303 redirect to `/`** — the SPA hydrates, calls JMAP via Bulwark's same-origin proxy, and Stalwart honours the master-user credentials because the master account has the `Admin` role.

The cookies are **session-only** — they have no `Max-Age`, so the browser drops them when closed. Impersonation is treated as a temporary support handoff; persistent identity is what password logins are for.

## Optional: Impersonation Notice Plugin

Install the [Impersonation Notice](https://extensions.bulwarkmail.org/plugins/impersonation-notice) plugin from the marketplace to add a persistent "You are viewing X as Platform Admin" banner across every authenticated page, with a "Back to platform" button. The plugin detects impersonation automatically (`%` in the session username) and lets admins configure:

- Platform return URL (where "Back to platform" navigates)
- Button label, role-suffix text
- Banner colours for light and dark mode

When the user closes the tab or clicks the return button, the plugin fires `DELETE /api/auth/session` so the impersonation ends immediately — no waiting for cookie expiry.

## Security

- **The signing secret and master password live only in the Bulwark process environment.** Neither is exposed in admin config, the database, or any JWT.
- **HS256 only.** Tokens signed with any other algorithm — including `none` — are rejected before signature verification.
- **Replay protection.** Each `jti` is consumed exactly once per Bulwark process. The in-memory LRU holds ~4096 recent tokens and prunes by expiry.
- **Lifetime ceiling.** `exp - iat` may not exceed 300 seconds regardless of what the signer asks for.
- **Injection-safe mailbox parsing.** Any `%` or `:` in the mailbox claim causes the token to be rejected, since either character would otherwise corrupt the master-user auth string.
- **Session-only cookies.** The impersonated session does not survive a browser quit.
- **Structured audit log** per accepted handoff, with `jti`, `mailbox`, `tenant_id`, `actor_user_id`, `iss`, client IP, referer, and user-agent.

## Negative Test Cases

These all return the documented error rather than silently authenticating:

| Token property                        | Response                              |
| ------------------------------------- | ------------------------------------- |
| Missing / wrong signature             | `401 Invalid signature`               |
| `alg` other than `HS256`              | `401 Unsupported alg`                 |
| Expired (`exp < now`)                 | `401 Token expired`                   |
| Lifetime > 300 s                      | `401 Token lifetime exceeds ceiling`  |
| `iss` mismatch                        | `401 Unexpected issuer`               |
| Reused `jti`                          | `401 Token already used`              |
| `mailbox` contains `%` or `:`         | `401 mailbox must not contain '%' or ':'` |
| Feature unconfigured (any env missing)| `404 Not found`                       |

## Limitations

- **Per-process replay cache.** If you run multiple Bulwark replicas behind a load balancer, each replica maintains its own `jti` LRU. A stolen token replayed against a different replica would be accepted by that replica. Mitigate by routing the impersonate endpoint to a single replica, or by keeping `exp` lifetimes short so the attack window is small.
- **Single master account.** All impersonations go through one master user. Per-tenant master accounts and JWKS-based rotation are not yet supported; open an issue if you need them.
- **HS256 only.** RS256 / EdDSA support has not been requested yet — let us know if you'd use it.
