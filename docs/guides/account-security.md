---
title: Account Security
description: Manage password, 2FA, app passwords, and API keys from within Bulwark.
order: 5
---

# Account Security

The Account Security panel in Bulwark lets users manage authentication and encryption settings for their mail account: password changes, two-factor authentication (TOTP), app passwords, API keys, and encryption-at-rest configuration.

## Stalwart Version Requirement

Account security management requires **Stalwart 0.16 or newer**. Stalwart 0.16 dropped its REST self-service HTTP API and replaced it with JMAP `x:` methods. Bulwark talks to the new JMAP endpoint exclusively. The deprecated `STALWART_API_URL` environment variable has no effect from Bulwark 1.5.0 onward.

If you see "Account security management is not available for this mail server" with a recent Bulwark, upgrade Stalwart to 0.16+ and check the principal permissions described below.

## Required Stalwart Permissions

For the Account Security feature to be available, the mail server administrator must enable the following principal permissions in Stalwart:

### Core Security Permissions

| Permission                                  | Description                                              | Required |
| ------------------------------------------- | -------------------------------------------------------- | -------- |
| **Manage account passwords**                | Allows users to change their password                    | ✓ Yes    |
| **Retrieve specific account information**   | Allows viewing current account details and settings      | ✓ Yes    |
| **Modify user account information**         | Allows updating user profile and account settings        | ✓ Yes    |
| **Authenticate**                            | Required for authentication operations                   | ✓ Yes    |
| **Manage encryption-at-rest settings**      | Allows managing encryption configuration                 | ✓ Yes    |

### JMAP Identity Permissions (for compose / identities)

| Permission                                | Required for                              |
| ----------------------------------------- | ----------------------------------------- |
| **Modify user identities via JMAP**       | Creating and updating sender identities   |
| **Retrieve user identities via JMAP**     | Listing identities in the composer        |
| **Track identity changes via JMAP**       | Real-time identity sync after edits       |

## Features by Permission

### Password Management

- Requires: `Manage account passwords` + `Modify user account information`
- Users can update their password from Settings → Security → Change Password.

### Two-Factor Authentication (TOTP)

- Requires: `Authenticate`
- Users can enable or disable TOTP-based 2FA from Settings → Security.
- A QR code is rendered for authenticator apps; recovery codes are generated for account recovery.

### App Passwords

- Requires: `Authenticate` + `Modify user account information`
- Users can create per-app credentials for clients that don't support OAuth (IMAP/SMTP, CalDAV).
- Each app password can carry an optional **IP allowlist** (added in 1.5.0) so it only authenticates from approved networks.
- Existing passwords can be revoked individually.

### API Keys

- Requires: appropriate Stalwart admin permissions
- Available from the admin panel.
- Generate, list, and revoke API keys used to access Stalwart programmatically.

### Encryption-at-Rest

- Requires: `Manage encryption-at-rest settings`
- Users can enable encryption for stored mail.

## Changing the Password from Bulwark

1. Log into Bulwark.
2. Open Settings → Security.
3. Under **Change Password**, enter the current password and the new password twice.
4. Click **Change Password**.

If the section is missing or you receive an error, the required Stalwart permissions are likely not enabled.

## Troubleshooting

### "Account security management is not available for this mail server"

This error appears when one or more required permissions are disabled, or when Stalwart predates the JMAP self-service API. To resolve:

1. **Confirm Stalwart is on 0.16 or newer.** Older versions don't expose the required JMAP `x:` methods.
2. **Contact your administrator** to verify the permissions in the table above are enabled on the principal.
3. **For OAuth users**: ensure the OAuth client has been granted scopes sufficient for account management.

### Bulwark talks to the wrong endpoint

Earlier Bulwark versions used `STALWART_API_URL` to reach a separate REST endpoint. From 1.5.0 onward, all self-service traffic goes through the normal JMAP session URL — there is no separate URL to configure. Remove `STALWART_API_URL` from your environment.

## Admin Configuration Steps

To enable Account Security as a Stalwart administrator:

1. Log in to Stalwart's admin console.
2. Navigate to **Accounts** → the principal you want to authorize.
3. Toggle each permission listed above to **On**.
4. Save and reload Stalwart's configuration.

Permissions can be applied at the role level for bulk configuration.

## See Also

- [Stalwart Mail Server Documentation](https://stalw.art/)
- [Authentication](/docs/getting-started/configuration/authentication)
- [Stalwart Setup](/docs/getting-started/configuration/stalwart-setup)
- [Multi-account Support](/docs/guides/multi-account)
