---
title: Authentication
description: Authentication methods supported by Bulwark.
order: 2
---

# Authentication

Bulwark uses JMAP's built-in authentication. Users log in with their email credentials configured in Stalwart.

## Basic Authentication

The default method. Users enter their email address and password, which are validated against Stalwart's user database.

## OAuth 2.0

If your Stalwart instance is configured with an OAuth provider, Bulwark supports OAuth login flows:

1. User clicks "Sign in with OAuth"
2. Redirected to the OAuth provider
3. After authorization, redirected back to Bulwark
4. JMAP session established with the OAuth token

### Configuring OAuth in Stalwart

```toml
[oauth]
key = "your-oauth-key"
```

Refer to the [Stalwart OAuth documentation](https://stalw.art/docs/auth/oauth) for detailed setup.

## Session Management

- Sessions are maintained via secure HTTP-only cookies
- Session tokens expire based on Stalwart's JMAP session configuration
- Users can log out from all devices via account settings

## Two-Factor Authentication

If Stalwart is configured with 2FA (via TOTP), Bulwark will prompt for the second factor after password entry.
