---
title: S/MIME
description: Sign, encrypt, decrypt, and verify mail with S/MIME certificates.
order: 7
---

# S/MIME

The whole S/MIME loop runs inside Bulwark. You import the certificates, sign and encrypt what you send, and read what arrives encrypted without leaving the browser. Current algorithms are covered. So are the older formats that corporate deployments still emit, which is the part most webmail quietly skips.

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

1. Open Settings → Security → S/MIME.
2. Choose **Import identity certificate** for a `.p12` / `.pfx` file. You'll be prompted for the password if the bundle is protected (PBE or modern PKCS#12).
3. Choose **Import recipient certificate** for a `.cer` / `.pem` file you've received from someone you want to encrypt mail to.
4. Bind the imported identity to one or more sender identities so signing toggles default-on for them.

## Sending signed and encrypted mail

In the composer:

- **Sign** - toggles when an identity certificate is bound to the active sender identity.
- **Encrypt** - toggles only when every recipient has a known public certificate. If a recipient is missing a key, Bulwark explains who and offers to send unencrypted.

A password-protected private key is unlocked from the composer itself, so you do not lose the draft.

You can set default signing and encryption preferences per identity in Settings → Security → S/MIME.

## Receiving signed and encrypted mail

The email viewer shows a banner above the message body:

- **Encrypted** - Bulwark attempts to decrypt with any available key. If the matching key isn't loaded, a clear "import the matching key" prompt appears.
- **Signed (verified)** - Green badge with the signer's name, the issuer, and the chain.
- **Signed (untrusted issuer / self-signed)** - Yellow warning with details. Self-signed signatures are explicitly labeled.
- **Decryption failed** - Red banner with diagnostic details.

When verification succeeds, Bulwark can optionally auto-import the signer's certificate so you can encrypt your reply without an extra step. Auto-import is opt-in.

## Per-account isolation

S/MIME state is fully isolated per account:

- A key imported under your work account is invisible to your personal account.
- That boundary is what stops one account's keys leaking into another when several are connected.
- Settings → Security → S/MIME shows the account context at the top so you always know which account's keys you are managing.

## Security notes

- Keys are stored encrypted using the per-account session key (which itself derives from `SESSION_SECRET`).
- Keys never leave the browser unless you explicitly export them.
- The S/MIME chain is validated against the system trust store plus any administrator-provided CAs.
- Signature verification is enforced - there is no "skip verification" option.
- Self-signed certificates are detected and displayed differently from chain-valid signatures.

## Troubleshooting

### "Cannot decrypt - no matching key"

The recipient encryption certificate the sender used does not match any of your imported identity certificates for this account. Either import the correct private key, or ask the sender to re-encrypt.

### "Untrusted issuer"

The signature is cryptographically valid but the issuer chain is not trusted by the browser/system. Either install the issuer's CA system-wide, or accept the signature manually.

### "Signature is from a self-signed certificate"

Bulwark detects and labels this explicitly so you don't mistake it for chain-validated identity. Treat self-signed signatures with extra caution.

### Can't sign - no certificate available

Make sure you've imported a private key (.p12 / .pfx, not just the public .cer) and bound it to your active sender identity in Settings → Security → S/MIME.
