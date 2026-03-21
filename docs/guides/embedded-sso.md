---
title: Embedded SSO
description: Embed Bulwark in an iframe with automatic single sign-on managed by a parent portal.
order: 3
---

# Embedded SSO

This guide explains how to embed Bulwark in an iframe within a parent portal that manages authentication via SSO.

## Prerequisites

Before configuring embedded SSO, ensure you have:

- OAuth 2.0 / OIDC configured (see [Authentication](/docs/getting-started/configuration/authentication))
- A `SESSION_SECRET` set for server-side PKCE encryption
- HTTPS enabled (required for cross-origin cookies)

## Configuration

Add the following environment variables to your deployment:

```env
# Required: OAuth must be enabled in SSO-only mode
OAUTH_ENABLED=true
OAUTH_ONLY=true
OAUTH_CLIENT_ID=webmail
OAUTH_ISSUER_URL=https://auth.example.com

# Required: encryption key for server-side PKCE state
SESSION_SECRET=your-32-char-secret-here

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
| `ALLOWED_FRAME_ANCESTORS`   | CSP `frame-ancestors` value                           | `'none'` |
| `COOKIE_SAME_SITE`          | Cookie `SameSite` attribute (`lax`, `none`, `strict`) | `lax`    |
| `NEXT_PUBLIC_PARENT_ORIGIN` | Origin of the parent frame for postMessage validation | (empty)  |

## Example Docker Compose

```yaml
services:
  webmail:
    image: bulwark-webmail
    environment:
      - JMAP_SERVER_URL=https://mail.example.com
      - OAUTH_ENABLED=true
      - OAUTH_ONLY=true
      - OAUTH_CLIENT_ID=webmail
      - OAUTH_ISSUER_URL=https://auth.example.com
      - SESSION_SECRET=your-32-char-secret-here
      - AUTO_SSO_ENABLED=true
      - ALLOWED_FRAME_ANCESTORS=https://portal.example.com
      - COOKIE_SAME_SITE=none
      - NEXT_PUBLIC_PARENT_ORIGIN=https://portal.example.com
```

## How It Works

### Server-Side PKCE Flow

The standard OAuth PKCE flow stores the `code_verifier` in `sessionStorage`, which is lost when the browser navigates across browsing contexts (e.g., iframe to top-level and back). The server-side SSO flow solves this by keeping the PKCE state in an encrypted httpOnly cookie:

1. **Start** - The client calls `POST /api/auth/sso/start`. The server generates PKCE parameters, stores them in an encrypted cookie (`sso_pending` with a 5-minute TTL), and returns the OAuth `authorize_url`.

2. **Redirect** - The browser redirects to the OAuth provider's authorize endpoint.

3. **Callback** - The OAuth provider redirects back to `/auth/callback` with `code` and `state` parameters.

4. **Complete** - The client calls `POST /api/auth/sso/complete`. The server reads the encrypted cookie, validates the `state` and TTL, exchanges the authorization code for tokens using the stored `code_verifier`, sets the `refresh_token` cookie, and returns the `access_token`.

### Auto-SSO

When `AUTO_SSO_ENABLED=true` and `OAUTH_ONLY=true`, the login page automatically starts the server-side SSO flow without user interaction. A 30-second loop guard prevents infinite redirect loops if the OAuth flow fails.

### Non-Interactive SSO

For fully embedded deployments where no login UI should ever appear, Bulwark supports a non-interactive SSO login flow. When configured, the OAuth flow starts automatically and completes without any user interaction, making it suitable for iframe deployments managed by a parent portal.

### iframe Security

When `ALLOWED_FRAME_ANCESTORS` is set to anything other than `'none'`:

- The `X-Frame-Options: DENY` header is removed
- CSP `frame-ancestors` is set to the configured value
- Set `COOKIE_SAME_SITE=none` for cross-origin iframe cookies (requires HTTPS)

## postMessage Bridge

Bulwark communicates with the parent frame via `postMessage`. All outgoing messages include `source: 'bulwark'`.

### Outgoing Messages (Webmail to Parent)

| Type                  | Payload        | When                            |
| --------------------- | -------------- | ------------------------------- |
| `sso:auth-success`    | `{ username }` | User successfully authenticated |
| `sso:auth-failure`    | `{ error }`    | Authentication failed           |
| `sso:logout`          | -              | User logged out                 |
| `sso:session-expired` | -              | Token refresh failed            |

### Incoming Messages (Parent to Webmail)

Messages must include `source: 'portal'`. If `NEXT_PUBLIC_PARENT_ORIGIN` is set, only messages from that origin are accepted.

| Type                 | Effect                                                   |
| -------------------- | -------------------------------------------------------- |
| `sso:trigger-login`  | Navigates to the login page (starts auto-SSO if enabled) |
| `sso:trigger-logout` | Logs the user out                                        |

### Example Parent Integration

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

## API Reference

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
