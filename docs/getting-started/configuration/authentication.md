---
title: Authentication
description: Authentication methods supported by Bulwark.
order: 2
---

# Authentication

Bulwark supports multiple authentication methods. Users log in with their email credentials configured in Stalwart.

## Basic Authentication

The default method. Users enter their email address and password, which are validated against Stalwart's user database via the JMAP authentication endpoint.

By default, Bulwark uses session-based authentication with no password storage on the server for security. Credentials are held only in the browser session.

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

Bulwark supports OAuth2/OIDC with PKCE for single sign-on (SSO). This can be used alongside or instead of Basic Auth.

### App Passwords

For environments where OAuth is the primary authentication method but some workflows require traditional credentials (e.g., IMAP/SMTP clients, CalDAV), Bulwark supports app password generation. Users create per-app credentials from Settings → Security → App passwords.

Each app password can carry an optional **IP allowlist** so it only authenticates from approved networks (added in 1.5.0). App passwords are managed via Stalwart's JMAP `x:` methods and require Stalwart 0.16 or newer.

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

### Endpoint Discovery

Endpoints are auto-discovered via `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`. No manual endpoint configuration is needed.

### External Identity Providers

If your JMAP server delegates authentication to an external IdP (e.g., Keycloak, Authentik), set the issuer URL:

```env
OAUTH_ISSUER_URL=https://keycloak.example.com/realms/mail
```

Bulwark supports RP-initiated logout when an `end_session_endpoint` is available.

### Embedded SSO

If you need to embed Bulwark in an iframe with automatic SSO managed by a parent portal, see the [Embedded SSO guide](/docs/guides/embedded-sso).

## Remember Me

By default, sessions end when the browser is closed. To enable persistent sessions for Basic Auth:

```env
# Generate with: openssl rand -base64 32
SESSION_SECRET=your-secret-key-here
```

When set, a "Remember me" checkbox appears on the login form. Credentials are encrypted with AES-256-GCM and stored in an httpOnly cookie with a 30-day expiry.

The `SESSION_SECRET` is also required for settings sync and multi-account support.

## Multi-Account Support

Bulwark supports managing multiple email accounts simultaneously. The historical 5-account cap is lifted on HTTP/2 servers - on HTTP/1.1 the practical limit is set by the browser's per-origin connection pool (typically 6 parallel push streams). Users can add accounts via the account switcher in the sidebar (or the **Add account** button on the navigation rail) and switch between them instantly with full state preservation.

Multi-account requires `SESSION_SECRET` to persist sessions for each account:

```env
SESSION_SECRET=your-secret-key-here
# Or: SESSION_SECRET_FILE=/run/secrets/session_secret
```

Each account maintains its own JMAP session, and per-account state (emails, contacts, calendar, filters, identities, S/MIME keys) is cached in memory for instant restoration when switching. Accounts can mix authentication methods - for example, one OAuth account and one Basic Auth account.

For full details, see [Multi-account Support](/docs/guides/multi-account).

## Two-Factor Authentication

Bulwark supports TOTP two-factor authentication when configured in Stalwart. After entering their password, users are prompted for a verification code from their authenticator app.

Users can enable or disable TOTP from Settings → Security within Bulwark (requires Stalwart 0.16+). Recovery codes are generated for account recovery. Session expiry during TOTP setup is handled cleanly so users aren't logged out partway through enrollment.

## Session Security

- Sessions use secure, httpOnly cookies
- Session tokens follow Stalwart's JMAP session configuration
- CORS misconfiguration is automatically detected with detailed error messages
- External content is blocked by default to protect privacy
- CSP, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy headers are set
