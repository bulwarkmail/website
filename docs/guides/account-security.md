# Account Security Management

## Overview

Account Security allows users to manage authentication and encryption settings for their mail account. This includes password changes, two-factor authentication (2FA/TOTP), and encryption-at-rest configuration.

## Required Permissions

For the Account Security feature to be available, your mail server administrator must enable the following permissions in the Stalwart Mail Server configuration:

### Core Security Permissions

| Permission | Description | Required |
|-----------|-------------|----------|
| **Manage account passwords** | Allows users to change their password | ✓ Yes |
| **Retrieve specific account information** | Allows viewing current account details and settings | ✓ Yes |
| **Modify user account information** | Allows updating user profile and account settings | ✓ Yes |
| **Authenticate** | Required for authentication operations | ✓ Yes |
| **Manage encryption-at-rest settings** | Allows managing encryption configuration | ✓ Yes |

## Features by Permission

### Password Management
- Requires: `Manage account passwords` + `Modify user account information`
- Allows users to securely update their email password

### Two-Factor Authentication (2FA/TOTP)
- Requires: `Authenticate`
- Allows enabling/disabling TOTP-based two-factor authentication
- Generates recovery codes for account recovery

### Encryption-at-Rest
- Requires: `Manage encryption-at-rest settings`
- Allows users to enable encryption for stored data

## Troubleshooting

### "Account security management is not available for this mail server"

This error appears when one or more required permissions are disabled. To resolve this:

1. **Contact your mail server administrator** to verify the following permissions are enabled:
   - Manage account passwords (On)
   - Retrieve specific account information (On)
   - Modify user account information (On)
   - Authenticate (On)
   - Manage encryption-at-rest settings (On)

2. **Check Stalwart Configuration**: Administrators can enable these permissions in the Stalwart Mail Server admin panel under user account capabilities.

3. **For OAuth users**: If using OAuth authentication, ensure the OAuth client has been granted the necessary scopes for account management.

## Admin Configuration

To enable Account Security features as an administrator:

1. Log in to the Stalwart Mail Server admin panel
2. Navigate to **Accounts** or **Permissions**
3. Ensure the following are set to **On**:
   - `Manage account passwords`
   - `Retrieve specific account information`
   - `Modify user account information`
   - `Authenticate`
   - `Manage encryption-at-rest settings`
4. Save and reload the configuration

## API Endpoints (Stalwart Server)

The following Stalwart API endpoints support account security operations:

- `GET /account/auth` - Retrieve 2FA and app password status
- `POST /account/auth` - Update authentication settings (add/remove TOTP, app passwords)
- `GET /account/crypto` - Retrieve encryption-at-rest settings
- `POST /account/crypto` - Update encryption configuration
- `PATCH /principal/{id}` - Update user principal (password, display name)

## See Also

- [Stalwart Mail Server Documentation](https://stalw.art/)
- [User Account Settings](../getting-started/account-settings.md)
- [Security Best Practices](./security-best-practices.md)
