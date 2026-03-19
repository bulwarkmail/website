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

## OAuth 2.0 / OpenID Connect

Bulwark supports OAuth2/OIDC with PKCE for single sign-on (SSO). This can be used alongside or instead of Basic Auth.

### Configuration

Add the following to your `.env.local`:

```env
# Enable OAuth login (shows "Sign in with SSO" button)
OAUTH_ENABLED=true

# OAuth client ID registered with your identity provider
OAUTH_CLIENT_ID=webmail

# OAuth client secret (optional, for confidential clients)
OAUTH_CLIENT_SECRET=your-client-secret

# To only allow OAuth login (hides username/password form):
OAUTH_ONLY=true
```

### Endpoint Discovery

Endpoints are auto-discovered via `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`. No manual endpoint configuration is needed.

### External Identity Providers

If your JMAP server delegates authentication to an external IdP (e.g., Keycloak, Authentik), set the issuer URL:

```env
OAUTH_ISSUER_URL=https://keycloak.example.com/realms/mail
```

Bulwark supports RP-initiated logout when an `end_session_endpoint` is available.

## Remember Me

By default, sessions end when the browser is closed. To enable persistent sessions for Basic Auth:

```env
# Generate with: openssl rand -base64 32
SESSION_SECRET=your-secret-key-here
```

When set, a "Remember me" checkbox appears on the login form. Credentials are encrypted with AES-256-GCM and stored in an httpOnly cookie with a 30-day expiry.

The `SESSION_SECRET` is also required for settings sync and multi-account support.

## Multi-Account Support

Bulwark supports managing up to 5 email accounts simultaneously. Users can add accounts via the account switcher in the sidebar and switch between them instantly with full state preservation.

Multi-account requires `SESSION_SECRET` to persist sessions for each account:

```env
SESSION_SECRET=your-secret-key-here
```

Each account maintains its own JMAP session, and per-account state (emails, contacts, calendar, filters) is cached in memory for instant restoration when switching.

## Two-Factor Authentication

Bulwark supports TOTP two-factor authentication when configured in Stalwart. After entering their password, users are prompted for a verification code from their authenticator app.

Users can enable or disable TOTP from the account security settings within Bulwark (when connected to a Stalwart server).

## Session Security

- Sessions use secure, httpOnly cookies
- Session tokens follow Stalwart's JMAP session configuration
- CORS misconfiguration is automatically detected with detailed error messages
- External content is blocked by default to protect privacy
- CSP, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy headers are set
