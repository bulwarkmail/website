---
title: S/MIME
description: Sign, encrypt, decrypt, and verify mail with S/MIME certificates.
order: 7
edition: full
---

# S/MIME

The whole S/MIME loop runs inside Bulwark. You import the certificates, sign and encrypt what you send, and read what arrives encrypted without leaving the browser. Current algorithms are covered. So are the older formats that corporate deployments still emit, which is the part most webmail quietly skips.

S/MIME is a plugin, not part of the core webmail. Until an admin installs it, there is no S/MIME page in Settings. This is separate from the public-key encryption at rest in Settings → Security, which only stores a public certificate on the server (see [Account security](/docs/guides/account-security)). The mobile app has no S/MIME support.

## Setting it up

1. An admin turns plugins on in the admin dashboard, then installs **S/MIME** from the [marketplace](/docs/guides/marketplace) (or uploads the ZIP from the [plugins repository](https://github.com/bulwarkmail/plugins)). The plugin runs in the [privileged tier](/docs/guides/plugins#privileged-tier), so only an admin can install it; a user upload is refused.
2. The admin enables it, either for everyone or so that each user can turn it on under Settings → Add-ons.
3. Once it is enabled for you, **S/MIME** appears in Settings under Add-ons. That page holds the key and certificate import, the per-identity defaults and the plugin's own options.

## Capabilities

- Import PKCS#12 (.p12 / .pfx) identity certificates from Settings
- Import recipient public certificates (.cer / .pem)
- Bind a certificate to a specific identity for default signing behavior
- Toggle signing and encryption per message in the composer
- Auto-import signer certificates from incoming verified messages (configurable) so you can encrypt replies without manual setup
- Decrypt incoming messages when the matching key is available
- Verify signatures and display detailed status (valid, untrusted issuer, expired, self-signed)
- Per-account key isolation - keys imported in one account aren't visible to another

## Algorithm support

| Class             | Supported                                                           |
| ----------------- | ------------------------------------------------------------------- |
| Modern signature  | RSA-PKCS1-v1.5 / RSA-PSS, ECDSA, with SHA-256/384/512               |
| Modern encryption | AES-128/192/256-CBC, AES-128/192/256-GCM                            |
| **Legacy 3DES**   | Imported via custom RSAES-PKCS1-v1.5 path for older Outlook senders |
| **Legacy PBE**    | Password-based encryption for older PKCS#12 bundles                 |
| Self-signed certs | Detected and reported in the signature status with a clear warning  |

The legacy paths exist specifically because older corporate S/MIME deployments still emit 3DES-encrypted content and PBE-protected key bundles. Bulwark's `CryptoEngine` and `LinerEngine` work together to decrypt these without forcing you to drop down to a desktop client.

## Importing certificates

1. Open Settings → Add-ons → S/MIME.
2. Choose **Import key** for a `.p12` / `.pfx` file. Enter the file's password if it has one (PBE or modern PKCS#12), then choose a storage passphrase. The key is re-encrypted with that passphrase in your browser; you need it to unlock the key later.
3. Choose **Import certificate** for a `.cer` / `.pem` file you've received from someone you want to encrypt mail to.
4. Bind the imported identity to one or more sender identities so signing toggles default-on for them.

## Sending signed and encrypted mail

In the composer:

- **Sign** - toggles when an identity certificate is bound to the active sender identity.
- **Encrypt** - toggles only when every recipient has a known public certificate. If a recipient is missing a key, Bulwark explains who and offers to send unencrypted.

A password-protected private key is unlocked from the composer itself, so you do not lose the draft.

You can set default signing and encryption preferences per identity in Settings → Add-ons → S/MIME.

## Receiving signed and encrypted mail

The email viewer shows a banner above the message body:

- **Encrypted** - Bulwark attempts to decrypt with any available key. If the matching key isn't loaded, a clear "import the matching key" prompt appears.
- **Signed (verified)** - Green badge with the signer's name, the issuer, and the chain.
- **Signed (untrusted issuer / self-signed)** - Yellow warning with details. Self-signed signatures are explicitly labeled.
- **Decryption failed** - Red banner with diagnostic details.

When verification succeeds, Bulwark auto-imports the signer's certificate so you can encrypt your reply without an extra step. You can turn this off in the plugin's settings.

## Per-account isolation

S/MIME state is fully isolated per account:

- A key imported under your work account is invisible to your personal account.
- That boundary is what stops one account's keys leaking into another when several are connected.
- Settings → Add-ons → S/MIME shows the account context at the top so you always know which account's keys you are managing.

## Security notes

- Private keys are stored in the browser (IndexedDB), encrypted with AES-256-GCM under a key derived from your storage passphrase. The raw key bytes are never written to disk and never sent to the server.
- Unlocking a key loads it as a non-extractable WebCrypto key. Unlocked keys are wiped when the app starts and on logout or account switch, so you enter the passphrase again after a reload (the logout behaviour can be changed in the plugin's settings).
- The signature itself is always verified cryptographically; there is no "skip verification" option. The issuer chain is not checked against a trust store: the banner shows the signer and issuer, flags self-signed certificates and a signer that differs from the From address, and leaves the trust decision to you.

## Troubleshooting

### "Cannot decrypt - no matching key"

The recipient encryption certificate the sender used does not match any of your imported identity certificates for this account. Either import the correct private key, or ask the sender to re-encrypt.

### "Untrusted issuer"

The signature is cryptographically valid, but the signer's certificate is self-signed or its issuer isn't one Bulwark can vouch for. Check the signer and issuer shown in the banner yourself.

### "Signature is from a self-signed certificate"

Bulwark detects and labels this explicitly so you don't mistake it for chain-validated identity. Treat self-signed signatures with extra caution.

### There is no S/MIME page in Settings

The plugin isn't installed or isn't enabled for your user. Ask your admin to install it from the marketplace and enable it; if the admin left it for users to turn on, enable it under Settings → Add-ons. The encryption-at-rest section in Settings → Security is not the same thing: it only takes a public certificate for the server.

### Can't sign - no certificate available

Make sure you've imported a private key (.p12 / .pfx, not just the public .cer) and bound it to your active sender identity in Settings → Add-ons → S/MIME.
