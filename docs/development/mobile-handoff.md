---
title: Mobile app hand-off
description: How the mobile app signs in through the webmail with a one-time code, and how it reads the organisation policy with its token.
order: 3
edition: full
---

# Mobile app hand-off

The Bulwark mobile app can sign in through the webmail's login page in the system browser. Older webmail versions opened the app's callback link with the sign-in in the fragment (`flow=password` with the password, or `flow=oauth` with the tokens). Any app on the device can register the `bulwarkmobile` scheme, so that link could be caught by another app.

When the app sends a PKCE challenge, the link carries only a one-time code. The sign-in stays on the webmail server until the app redeems the code with the matching verifier. Without a challenge the page behaves as before, so older app builds keep working.

## 1. Open the login page

```
GET <webmail>/<locale>/login
    ?mobile_redirect_uri=bulwarkmobile://auth/callback
    &mobile_state=<opaque, up to 512 chars>
    &mobile_code_challenge=<S256 challenge>
```

- `mobile_code_challenge` is `BASE64URL(SHA256(code_verifier))` without padding, exactly 43 characters (RFC 7636, method S256 only). The verifier is 43 to 128 characters from `A-Z a-z 0-9 - . _ ~`. Use a fresh verifier for every sign-in.
- If the challenge is present but malformed, the page ignores the hand-off: it acts as a normal sign-in page and gives the app nothing.
- `mobile_redirect_uri` must be exactly `bulwarkmobile://auth/callback`.

This works for the password form and for SSO/OAuth sign-in. Bulwark Lite has no server to keep the sign-in on, so it ignores the challenge and still uses the fragment.

## 2. The callback link

After the user signs in and confirms the hand-off, the browser opens:

```
bulwarkmobile://auth/callback?code=<64 lowercase hex chars>&state=<mobile_state>
```

The parameters are in the query string, not the fragment. The link has no `flow`, no server URL and no secret. Check `state` against the value you sent before redeeming.

A link with a fragment (`#flow=...`) comes from an older webmail or a Lite build. Handle it the old way.

## 3. Redeem the code

```
POST <webmail>/api/auth/handoff/redeem
Content-Type: application/json

{ "code": "<code from the link>", "code_verifier": "<verifier>" }
```

The code is valid for 60 seconds from the moment the user confirmed the hand-off in the browser, and works once. Don't send an `Origin` or `Sec-Fetch-Site` header (native HTTP clients don't), or the same-origin check answers 403.

### Success: 200

The response has the same fields the fragment used to carry, as JSON, plus `state`.

```json
{
  "flow": "password",
  "server_url": "https://mail.example.org",
  "username": "alice@example.org",
  "password": "...",
  "state": "<mobile_state>"
}
```

```json
{
  "flow": "oauth",
  "server_url": "https://mail.example.org",
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3540,
  "token_endpoint": "https://mail.example.org/auth/token",
  "client_id": "bulwark-webmail",
  "state": "<mobile_state>"
}
```

- `expires_in` is a number (the fragment had a string) and counts from the redeem, not from the sign-in.
- `refresh_token` and `expires_in` are optional.
- `token_endpoint` may point at the webmail's token proxy (`<webmail>/api/auth/pair/token`) with a sealed `refresh_token`, the same as the QR pairing bundle.

### Errors

Every failure spends the code. Start a new sign-in after any of them.

| Status | `error`             | Meaning                                                      |
| ------ | ------------------- | ------------------------------------------------------------ |
| 400    | `invalid_request`   | Body is not JSON or `code` is malformed                      |
| 400    | `invalid_code`      | Never issued, already redeemed or already tried              |
| 400    | `expired_code`      | Confirmed more than 60 seconds ago                           |
| 400    | `invalid_verifier`  | Verifier malformed or doesn't match                          |
| 429    | `too_many_requests` | More than 10 failed redeems from this address in 15 minutes  |
| 403    |                     | Cross-origin browser request                                 |

All responses carry `Cache-Control: no-store`.

### Deployment note

Parked sign-ins are kept in the webmail process's memory, like QR pairing codes. Run a single instance, or use sticky sessions when you run several.

## Organisation policy for the app

The app has no webmail session, so it reads the organisation policy with its JMAP access token:

```
GET <webmail>/api/admin/policy
Authorization: Bearer <JMAP access token>
```

- The webmail checks the token by fetching the JMAP session from its configured server, never from a URL in the request. With several configured servers and no global server URL, send `X-JMAP-Server-Url: <server url>`; it must match a configured entry.
- A valid token gets what a signed-in user of that account gets: the policy with the scopes for their domains, and the organisation settings. The `x-bulwark-policy-domains` header names those domains.
- An invalid token gets the public subset with status 200 and `x-bulwark-policy-scope: public`, the same answer as without a token. Basic credentials are ignored.
- Each refused token counts as a failed login on the mail server, so the webmail stops checking tokens from a client after 10 refusals in 15 minutes.

## Related pages

- [Mobile](/docs/features/mobile)
- [Architecture](/docs/development/architecture)
