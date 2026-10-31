---
title: Account security
description: Manage password, 2FA, app passwords, and API keys from within Bulwark.
order: 5
edition: full
editionNote: "The account security tab is hidden, because these calls go through the Node.js server. Logging in with a password and a TOTP code still works in Lite; enrolling or changing them does not."
---

# Account security

This is the panel where users look after their own account rather than filing a ticket. They can change the password, turn TOTP two-factor on, mint and revoke app passwords and API keys, and switch on encryption at rest.

<img class="theme-light-only" src="/screenshots/light-settings.webp" alt="Bulwark account settings panel" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-settings.webp" alt="Bulwark account settings panel" width="5120" height="2880" />

## Stalwart version requirement

Account security management requires **Stalwart 0.16.6 or newer**, or Stalwart 1.0 with Bulwark {{BULWARK_VERSION}} or newer. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP `x:` methods. Bulwark talks to the new JMAP endpoint exclusively. The deprecated `STALWART_API_URL` environment variable has no effect from Bulwark 1.5.0 onward.

If you see "Account security management is not available for this mail server" with a recent Bulwark, upgrade Stalwart to 0.16.6 or newer and see [Troubleshooting](#troubleshooting) below.

## Stalwart permissions

Stalwart's default user role already allows everything on this page, so there is nothing to switch on in Stalwart. If an administrator gave an account a custom role, that role needs the account password, app password, API key and public key permissions (`sysAccountPassword*`, `sysAppPassword*`, `sysApiKey*`, `sysPublicKey*`).

## What users can do

### Password management

- Users change their password in Settings → Security under **Change password**.

### Two-factor authentication (TOTP)

- Users turn TOTP-based 2FA on or off in Settings → Security.
- A QR code and the setup URL are shown for the authenticator app; users confirm with their password and a code from the app.

Users who signed in through single sign-on or with an access token don't see the password and two-factor sections; they change those at their identity provider.

### App passwords

- Users can create per-app credentials for clients that don't support OAuth (IMAP/SMTP, CalDAV).
- Each app password can carry an optional **IP allowlist**, so a credential only authenticates from approved networks.
- Existing passwords can be revoked individually.

### API keys

- Users create and delete their own API keys in Settings → Security → Other apps and devices, for scripts and integrations that talk to Stalwart directly.
- The section appears once **Show advanced settings** is on.

### Encryption at rest

- In Settings → Security → Encryption (shown with **Show advanced settings**), add your S/MIME or PGP public key and choose **Enable encryption** on it, with the algorithm you want. Stalwart then encrypts new mail with that key.

## Changing the password from Bulwark

1. Log into Bulwark.
2. Open Settings → Security.
3. Under **Change password**, enter the current password, the new one twice and, if two-factor is on, a code from your authenticator app.
4. Choose **Change password**.

If the section is missing, see the next section.

## Troubleshooting

### "Account security management is not available for this mail server"

This message appears when the account doesn't get Stalwart's `urn:stalwart:jmap` capability (the server isn't Stalwart, it is older than 0.16, or on Stalwart 1.0 Bulwark isn't registered as a first-party client), or when the operator set `STALWART_JMAP_PASSTHROUGH_ENABLED=false`. To resolve:

1. **Confirm Stalwart is on 0.16.6 or newer, or on 1.0 with Bulwark {{BULWARK_VERSION}} or newer.** Versions before 0.16 don't expose the required JMAP `x:` methods.
2. **On Stalwart 1.0, run Auto-configure OAuth** once on the **Authentication** page of Bulwark's admin console, so Bulwark is a first-party client. Until then, users who signed in with single sign-on or a two-factor code see this message.
3. **Check that `STALWART_JMAP_PASSTHROUGH_ENABLED`** isn't set to `false`.

### Bulwark talks to the wrong endpoint

Earlier Bulwark versions used `STALWART_API_URL` to reach a separate REST endpoint. From 1.5.0 onward, all self-service traffic goes through the normal JMAP session URL - there is no separate URL to configure. Remove `STALWART_API_URL` from your environment.

## Related pages

- [Stalwart Mail Server Documentation](https://stalw.art/)
- [Authentication](/docs/getting-started/configuration/authentication)
- [Stalwart setup](/docs/getting-started/configuration/stalwart-setup)
- [Multi-account support](/docs/guides/multi-account)
