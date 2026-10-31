---
title: Embedded SSO
description: Embed Bulwark in an iframe with automatic single sign-on managed by a parent portal.
order: 3
edition: full
---

# Embedded SSO

Run Bulwark inside an iframe in a parent portal that already handles authentication through SSO.

<div class="bw-note bw-note-edition"><b>Not in Lite.</b> The server-side SSO flow on this page needs the full edition. Lite installed as a Stalwart Application can sign in through Stalwart's OpenID provider, but not silently in a frame. Lite's <code>config.json</code> accepts <code>embeddedMode</code> and <code>parentOrigin</code> for framing it.</div>

## Prerequisites

Embedded SSO needs all three of these in place first:

- OAuth 2.0 / OIDC configured (see [Authentication](/docs/getting-started/configuration/authentication))
- A session secret for server-side PKCE encryption. Bulwark generates one on first start; set `SESSION_SECRET` (at least 32 characters) if you run several replicas or don't keep the state directory.
- HTTPS enabled (required for cross-origin cookies)

## Configuration

Add the following environment variables to your deployment:

```env
# Required: OAuth must be enabled in SSO-only mode
OAUTH_ENABLED=true
OAUTH_ONLY=true
OAUTH_CLIENT_ID=webmail
OAUTH_ISSUER_URL=https://auth.example.com

# Encryption key for server-side PKCE state, at least 32 characters
# (generated on first start if unset), e.g. from: openssl rand -hex 32
SESSION_SECRET=<at least 32 random characters>

# Enable automatic SSO (skips the login form)
AUTO_SSO_ENABLED=true

# Allow iframe embedding from your portal's origin
ALLOWED_FRAME_ANCESTORS=https://portal.example.com

# Cross-origin cookies (required when embedded cross-origin)
COOKIE_SAME_SITE=none

# Parent origin for postMessage validation
NEXT_PUBLIC_PARENT_ORIGIN=https://portal.example.com
```

| Variable                    | Description                                           | Default  |
| --------------------------- | ----------------------------------------------------- | -------- |
| `AUTO_SSO_ENABLED`          | Automatically start the OAuth flow on the login page  | `false`  |
| `ALLOWED_FRAME_ANCESTORS`   | Origins added to CSP `frame-ancestors`                | (empty: `'self'` only) |
| `COOKIE_SAME_SITE`          | Cookie `SameSite` attribute (`lax`, `none`, `strict`) | `lax`    |
| `NEXT_PUBLIC_PARENT_ORIGIN` | Origin of the parent frame for postMessage validation | (empty)  |

## Example Docker Compose file

```yaml
services:
  webmail:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      - JMAP_SERVER_URL=https://mail.example.com
      - OAUTH_ENABLED=true
      - OAUTH_ONLY=true
      - OAUTH_CLIENT_ID=webmail
      - OAUTH_ISSUER_URL=https://auth.example.com
      - SESSION_SECRET=<at least 32 random characters, e.g. openssl rand -hex 32>
      - AUTO_SSO_ENABLED=true
      - ALLOWED_FRAME_ANCESTORS=https://portal.example.com
      - COOKIE_SAME_SITE=none
      - NEXT_PUBLIC_PARENT_ORIGIN=https://portal.example.com
```

## How it works

### Server-side PKCE flow

The usual OAuth PKCE flow keeps the `code_verifier` in `sessionStorage`, and that is lost the moment the browser crosses browsing contexts, iframe to top-level and back. Bulwark keeps the PKCE state in an encrypted httpOnly cookie instead:

1. **Start** - The client calls `POST /api/auth/sso/start`. The server generates PKCE parameters, stores them in an encrypted cookie (`sso_pending` with a 5-minute TTL), and returns the OAuth `authorize_url`.

2. **Redirect** - Bulwark sends the browser to the provider's authorize endpoint. In a frame it tries to navigate the top-level window first and uses the frame only when the browser doesn't allow that.

3. **Callback** - The OAuth provider redirects back to `/<locale>/auth/callback` on Bulwark's own origin (below the base path if you set one) with `code` and `state` parameters. The `redirect_uri` sent to the start endpoint must be on that origin, or the start answers `400 Invalid redirect_uri`.

4. **Complete** - The client calls `POST /api/auth/sso/complete`. The server reads the encrypted cookie, validates the `state` and TTL, exchanges the authorization code for tokens using the stored `code_verifier`, sets the `refresh_token` cookie, and returns the `access_token`.

### Auto-SSO

When `AUTO_SSO_ENABLED=true` and `OAUTH_ONLY=true`, the login page automatically starts the server-side SSO flow without user interaction. A 30-second loop guard prevents infinite redirect loops if the OAuth flow fails. It doesn't start when more than one JMAP server is configured, or right after a user signed out on purpose.

With Auto-SSO and a provider session the portal already started, users see no login screen. If the provider has no session, it shows its own login page. There is no separate non-interactive mode.

### iframe security

By default Bulwark can only be framed by itself (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`). Origins in `ALLOWED_FRAME_ANCESTORS` are added to `'self'` and the X-Frame-Options header is dropped, so the CSP decides. The admin console and the setup wizard can never be framed.

Set `COOKIE_SAME_SITE=none` for cross-origin iframe cookies (requires HTTPS).

## postMessage bridge

Bulwark communicates with the parent frame via `postMessage`. All outgoing messages include `source: 'bulwark'`.

Set `NEXT_PUBLIC_PARENT_ORIGIN` to the portal's origin as an environment variable. Without it Bulwark sends no messages, and with no parent origin at all it doesn't listen either. Bulwark posts only to that origin. It accepts messages only while embedding is on (`ALLOWED_FRAME_ANCESTORS` set), only from the parent window at that origin, and only with `source: 'portal'`. The **Parent origin** field on the admin Authentication page sets the origin Bulwark accepts messages from, but not the one it sends to, so set the environment variable either way.

### Outgoing messages, webmail to parent

| Type                  | Payload        | When                            |
| --------------------- | -------------- | ------------------------------- |
| `sso:auth-success`    | `{ username }` | User successfully authenticated |
| `sso:auth-failure`    | `{ error }`    | Authentication failed           |
| `sso:logout`          | -              | User logged out                 |
| `sso:session-expired` | -              | Token refresh failed            |

### Incoming messages, parent to webmail

Messages must include `source: 'portal'` and come from the parent window at the origin in `NEXT_PUBLIC_PARENT_ORIGIN`.

| Type                 | Effect                                                   |
| -------------------- | -------------------------------------------------------- |
| `sso:trigger-login`  | Navigates to the login page (starts auto-SSO if enabled) |
| `sso:trigger-logout` | Logs the user out                                        |

### Example parent integration

```javascript
const iframe = document.getElementById("webmail-iframe");

// Listen for auth events from Bulwark
window.addEventListener("message", (event) => {
  if (event.data?.source !== "bulwark") return;

  switch (event.data.type) {
    case "sso:auth-success":
      console.log("User logged in:", event.data.username);
      break;
    case "sso:session-expired":
      // Re-trigger login when session expires
      iframe.contentWindow.postMessage(
        { source: "portal", type: "sso:trigger-login" },
        "https://webmail.example.com",
      );
      break;
  }
});

// Trigger logout from the parent portal
function logoutWebmail() {
  iframe.contentWindow.postMessage(
    { source: "portal", type: "sso:trigger-logout" },
    "https://webmail.example.com",
  );
}
```

## API reference

### POST /api/auth/sso/start

Initiates the server-side OAuth flow.

**Request:**

```json
{
  "redirect_uri": "https://webmail.example.com/en/auth/callback"
}
```

**Response:**

```json
{
  "authorize_url": "https://auth.example.com/authorize?..."
}
```

### POST /api/auth/sso/complete

Completes the server-side OAuth flow. Requires the `sso_pending` cookie set by the start endpoint.

**Request:**

```json
{
  "code": "authorization_code_here",
  "state": "state_value_here"
}
```

**Response:**

```json
{
  "access_token": "...",
  "expires_in": 3600
}
```
