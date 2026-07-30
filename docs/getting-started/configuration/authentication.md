---
title: Authentication
description: Authentication methods supported by Bulwark.
order: 2
---

# Authentication

Users sign in with the email credentials that already exist in Stalwart. There are three ways to do it. Basic auth is the default, OAuth 2.0 / OIDC handles single sign-on, and app passwords cover the clients that understand neither.

## Basic authentication

Users enter their email address and password, and Bulwark checks them against Stalwart's user database through the JMAP authentication endpoint.

No password is written to disk anywhere on the Bulwark side. The session lives in the browser and dies with it, unless you turn on Remember me below.

### Changing the password from Bulwark

1. Log into Bulwark.
2. Open **Settings → Security → Change Password**.
3. Enter the current password, then the new password twice.
4. Click **Change Password**.

If the section is missing or you receive an error, the administrator hasn't enabled the required Stalwart permissions. Required toggles in Stalwart:

- **Modify user account information** - master switch for account changes.
- **Manage account passwords** - allows password change via JMAP.
- **Modify user identities via JMAP** / **Retrieve user identities via JMAP** / **Track identity changes via JMAP** - for identity sync in the composer.

See [Account Security](/docs/guides/account-security) for the full permission matrix.

## OAuth 2.0 / OpenID Connect

OAuth2/OIDC with PKCE handles single sign-on. Run it alongside basic auth, or set `OAUTH_ONLY=true` to run it instead.

### App passwords

Plenty of clients never learned OAuth. IMAP and SMTP clients want a username and a password, and so does most CalDAV software. Users generate a separate credential for each of them from Settings → Security → App passwords.

Each app password can carry an optional IP allowlist, so a credential handed to a backup box only works from that box. App passwords go through Stalwart's JMAP `x:` methods and need Stalwart 0.16 or newer.

### Configuration

Add the following to your `.env.local`:

```env
# Enable OAuth login (shows "Sign in with SSO" button)
OAUTH_ENABLED=true

# OAuth client ID registered with your identity provider
OAUTH_CLIENT_ID=webmail

# OAuth client secret (optional, for confidential clients)
OAUTH_CLIENT_SECRET=your-client-secret

# Or: read the secret from a file (Docker / Kubernetes secrets)
# OAUTH_CLIENT_SECRET_FILE=/run/secrets/oauth_secret

# To only allow OAuth login (hides username/password form):
OAUTH_ONLY=true

# Optional: customize requested scopes
# OAUTH_SCOPES="openid profile email offline_access urn:ietf:params:jmap:core"
# OAUTH_EXTRA_SCOPES="custom-audience-scope"
```

### Endpoint discovery

Bulwark discovers the endpoints from `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`, so you don't configure them by hand.

### External identity providers

If your JMAP server delegates authentication to an external IdP (e.g., Keycloak, Authentik), set the issuer URL:

```env
OAUTH_ISSUER_URL=https://keycloak.example.com/realms/mail
```

When the provider advertises an `end_session_endpoint`, Bulwark performs RP-initiated logout.

### Embedded SSO

If you need to embed Bulwark in an iframe with automatic SSO managed by a parent portal, see the [Embedded SSO guide](/docs/guides/embedded-sso).

## Remember me

By default, sessions end when the browser is closed. To enable persistent sessions for Basic Auth:

```env
# Generate with: openssl rand -base64 32
SESSION_SECRET=your-secret-key-here
```

When set, a "Remember me" checkbox appears on the login form. Credentials are encrypted with AES-256-GCM and stored in an httpOnly cookie with a 30-day expiry.

The `SESSION_SECRET` is also required for settings sync and multi-account support.

## Multi-account support

Several accounts can be signed in at once. The historical 5-account cap is lifted on HTTP/2 servers - on HTTP/1.1 the practical limit is set by the browser's per-origin connection pool (typically 6 parallel push streams). Users can add accounts via the account switcher in the sidebar (or the **Add account** button on the navigation rail) and switch between them instantly with full state preservation.

Multi-account requires `SESSION_SECRET` to persist sessions for each account:

```env
SESSION_SECRET=your-secret-key-here
# Or: SESSION_SECRET_FILE=/run/secrets/session_secret
```

Each account maintains its own JMAP session, and per-account state (emails, contacts, calendar, filters, identities, S/MIME keys) is cached in memory for instant restoration when switching. Accounts can mix authentication methods - for example, one OAuth account and one Basic Auth account.

For full details, see [Multi-account Support](/docs/guides/multi-account).

## Two-factor authentication

When Stalwart has TOTP enabled, users are asked for a code from their authenticator app after the password step.

Users can enable or disable TOTP from Settings → Security within Bulwark (requires Stalwart 0.16+). Recovery codes are generated for account recovery. Session expiry during TOTP setup is handled cleanly so users aren't logged out partway through enrollment.

## Session security

- Sessions use secure, httpOnly cookies
- Session tokens follow Stalwart's JMAP session configuration
- CORS misconfiguration is automatically detected with detailed error messages
- External content is blocked by default to protect privacy
- CSP, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy headers are set
