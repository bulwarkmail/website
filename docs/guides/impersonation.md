---
title: Master-user impersonation
description: Land platform admins directly inside a tenant's mailbox via signed JWT handoff, without storing tenant passwords.
order: 11
edition: full
editionNote: "Impersonation goes through Bulwark's server (not Lite). Lite has no way to open another user's mailbox."
---

# Master-user impersonation

Wire a control panel's "Open Webmail" button so an operator lands inside a tenant's mailbox without being asked for that mailbox's password.

Bulwark takes a short-lived signed JWT from your platform, verifies it, and signs in to Stalwart once as the target mailbox through Stalwart's master-user login (`<target>%<master>`). It uses that login only to create an app password on the target mailbox that expires after 8 hours, and the webmail session runs on that app password. The master password never reaches the browser, and no tenant credential is stored anywhere.

## Prerequisites

- A Stalwart account with the Impersonate permission, the master account. Stalwart's administrator (superuser) role has it by default; tenant administrators don't. No Enterprise licence is needed.
- The mailbox to impersonate must exist on the same Stalwart server.
- Bulwark 1.11.1 or later and Stalwart 0.16 or later. Bulwark opens mailboxes on the JMAP server set in `JMAP_SERVER_URL` (or on the Server page); servers from `JMAP_SERVERS` can't be used.
- A shared HS256 signing secret between your platform and the Bulwark process.

## Configuration

Add the following environment variables to the Bulwark process:

```env
# Required: ≥32 chars, shared with your platform's JWT minter
BULWARK_JWT_AUTH_SECRET=<48 random chars>

# Required: Stalwart account with the Impersonate permission
BULWARK_STALWART_MASTER_USER=master@example.com
BULWARK_STALWART_MASTER_PASSWORD=<that account's password>

# Optional: must match the JWT's `iss` claim. Defaults to "platform-api/webmail".
BULWARK_JWT_AUTH_ISSUER=platform-api/webmail
```

With any of the three required variables missing, `GET /api/auth/impersonate` returns `404 Not found`, so the endpoint is invisible on a deployment that has not opted in.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

| Variable                            | Description                                                | Default                  |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------ |
| `BULWARK_JWT_AUTH_SECRET`           | HS256 signing key (≥32 chars). Route is disabled if unset; a shorter secret makes every request fail with 500. | _empty (disabled)_       |
| `BULWARK_STALWART_MASTER_USER`      | Stalwart account with the Impersonate permission.          | _empty (disabled)_       |
| `BULWARK_STALWART_MASTER_PASSWORD`  | Master account's password.                                 | _empty (disabled)_       |
| `BULWARK_JWT_AUTH_ISSUER`           | Expected `iss` claim.                                      | `platform-api/webmail`   |

Each of the three required values can instead be read from a file named in `BULWARK_JWT_AUTH_SECRET_FILE`, `BULWARK_STALWART_MASTER_USER_FILE` or `BULWARK_STALWART_MASTER_PASSWORD_FILE` (Docker or Kubernetes secrets).

## JWT contract

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
| `jti`            | yes      | Random UUID. Works once; see [Security](#security).                 |
| `mailbox`        | yes      | Target email address. Must **not** contain `%` or `:`.               |
| `tenant_id`      | optional | Free-form tenant identifier. Written to the server log line.         |
| `actor_user_id`  | optional | Platform user who triggered the handoff. Written to the server log line. |

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

## How it works

1. **Platform mints a JWT** signed with `BULWARK_JWT_AUTH_SECRET` and includes the target mailbox.
2. **User clicks "Open Webmail"**, and the browser hits `/api/auth/impersonate?token=<jwt>`.
3. **Bulwark verifies** the signature, claims, mailbox sanity and `jti` (replay-rejected on second use).
4. **Bulwark creates an app password.** It signs in to Stalwart once as `<mailbox>%<master>` with the master password and creates an app password on the target mailbox that expires after 8 hours.
5. **Cookies are set** with that app password, encrypted with `SESSION_SECRET`, plus a `jmap_impersonation` cookie that remembers the app password so signing out can delete it, and a `jmap_impersonated` marker that lasts 60 seconds. The master password never reaches the browser. Sessions from versions before 1.11.1 that still hold a master password are refused.
6. **The admin's own session is kept for the way back.** If the browser was signed in before the handoff, Bulwark keeps that sign-in on the server, sealed with `SESSION_SECRET`, in the shared store (or in memory without `REDIS_URL`), and the page sends its account list there before it clears it. The browser gets only a random handle in the httpOnly `jmap_impersonation_restore` cookie.
7. **303 redirect to `/?impersonated=1`**, and the webmail opens the mailbox.

The cookies carry no `Max-Age`, so the browser drops them on quit, and the app password behind them expires after 8 hours, so the session ends then at the latest. Use impersonation for short support sessions, and password logins for lasting access.

## Returning to your own account

When the browser was signed in before the handoff, a strip at the top of the app says which mailbox you opened through impersonation and has a **Return to my account** button. It ends the impersonation the way signing out does, deleting the app password at Stalwart, and signs you back in to the accounts you had open, with the same account list.

The way back works once, in the browser that opened the handoff, while that impersonation is open, and for at most 8 hours. Signing out of the impersonation gives it up. A second handoff in the same browser keeps it, so returning still leads to the account you started from. Without a sign-in before the handoff, after a restart without a shared store, or in Bulwark Lite, there is no button, and the way back is to sign out and sign in again.

With the Impersonation Notice plugin (1.5.0 or later) the button is in the plugin's banner instead, and Bulwark's own strip stays away.

## Optional: impersonation notice plugin

The [Impersonation Notice](https://extensions.bulwarkmail.org/extension/impersonation-notice) plugin adds a persistent "You are viewing X as Platform Admin" banner across every authenticated page, with a "Back to platform" button. Bulwark tells the plugin when a session was opened through this route, and the plugin reads that from version 1.4.1 on. Older plugin versions only looked for `%` in the username, which sessions since Bulwark 1.11.1 no longer have, so update the plugin if the banner doesn't show.

From plugin 1.5.0, on Bulwark releases after 1.21.0, the banner also has the **Return to my account** button described above. It needs the optional `auth:impersonation-return` permission: an admin install grants it, and a user is asked once. While the plugin draws the button, Bulwark leaves out its own strip.

Admins can configure:

- Platform return URL (where **Back to platform** goes; empty hides the button)
- Button label
- Actor role label (the text after the mailbox, default "as Platform Admin")

The banner takes its colours from the theme, and **Back to platform** signs out. Signing out ends the session and deletes the app password at Stalwart. Closing the tab doesn't; the session then ends when the browser quits or after 8 hours.

## Security

- **The signing secret and master password live only in the Bulwark process environment or in the secret files it reads.** Neither is exposed in admin config, the database, or any JWT.
- **HS256 only:** tokens signed with any other algorithm, `none` included, are rejected before signature verification.
- **Replay protection:** each `jti` works once. Bulwark records it in memory and as a file in the admin state directory (`ADMIN_STATE_DIR`), so a used link stays refused after a restart. With several replicas and a shared store (`REDIS_URL`) the record lives in the store and holds on every replica. If the record can't be written, Bulwark refuses the link with a 503 instead of accepting it unrecorded.
- **Lifetime ceiling:** `exp - iat` may not exceed 300 seconds regardless of what the signer asks for.
- **Injection-safe mailbox parsing:** any `%` or `:` in the mailbox claim causes the token to be rejected, since either character would otherwise corrupt the master-user auth string.
- **Session-only cookies:** the impersonated session does not survive a browser quit, and it ends after 8 hours at the latest.
- **Server log line** per accepted handoff (`impersonation_granted`), with `jti`, `mailbox`, `tenant_id`, `actor_user_id`, `iss`, the expiry, client IP, referer, user agent and whether a way back was kept (`restorable`). Returning is logged as `impersonation_returned`. Neither appears in the admin console's audit log.
- **Return handle:** the kept session never reaches the browser. The handle in `jmap_impersonation_restore` only opens it together with the same impersonation's `jmap_impersonation` cookie, works once, and expires with the impersonation. A copy tried in another browser is refused and leaves the way back intact.

## Negative test cases

These all return the documented error rather than silently authenticating:

| Token property                        | Response                              |
| ------------------------------------- | ------------------------------------- |
| No `token` parameter                  | `400 Missing token`                   |
| Not three parts, or bad base64 or JSON | `400`                                |
| Wrong signature                       | `401 Invalid signature`               |
| `alg` other than `HS256`              | `401 Unsupported alg '<alg>'`         |
| A required claim missing or of the wrong type | `401 Missing or invalid '<claim>' claim` |
| `nbf` more than 60 s in the future    | `401 Token not yet valid`             |
| `iat` more than 60 s in the future    | `401 Token issued in the future`      |
| Expired more than 60 s ago            | `401 Token expired`                   |
| Lifetime > 300 s                      | `401 Token lifetime exceeds 300s ceiling` |
| `iss` mismatch                        | `401 Unexpected issuer '<iss>'`       |
| Reused `jti`                          | `401 Token already used`              |
| `mailbox` contains `%` or `:`         | `401 mailbox must not contain '%' or ':'` |
| Stalwart refuses the master login     | `502 Could not open the mailbox`      |
| Feature unconfigured (any env missing)| `404 Not found`                       |

Errors other than the 404 come as JSON, `{"error": "..."}`; the 404 is plain text.

## Limitations

- **Several replicas need the shared store:** without `REDIS_URL`, replicas that don't share `ADMIN_STATE_DIR` keep separate records, so a used token could be redeemed again on another replica. Set up [the shared store](/docs/deployment/multi-instance) for more than one replica.
- **Way back after a restart:** without `REDIS_URL` the kept session lives in the process's memory, so after a restart during an impersonation you sign in again.
- **Single master account:** all impersonations go through one master user. Per-tenant master accounts and JWKS-based rotation are not yet supported; open an issue if you need them.
- **HS256 only:** nobody has asked for RS256 or EdDSA yet. Open an issue if you would use it.

## Next step

[Running Bulwark for customers](/docs/deployment/hosting-providers) covers the rest of a hosting setup: servers picked by domain, branding per web address and several replicas.
