---
title: S/MIME
description: Sign, encrypt, decrypt, and verify mail with S/MIME certificates.
order: 7
edition: full
editionNote: "S/MIME is a plugin, and plugins run in Bulwark (not Lite)."
---

# S/MIME

The whole S/MIME loop runs inside Bulwark. You import the certificates, sign and encrypt what you send, and read what arrives encrypted without leaving the browser. Current algorithms are covered, and so are older formats such as 3DES and legacy PKCS#12 encryption; RC2 is not.

S/MIME is a plugin, not part of the core webmail. Until an admin installs it, there is no S/MIME page in Settings. This is separate from the public-key encryption at rest in Settings → Security, which only stores a public certificate on the server (see [Account security](/docs/guides/account-security)). The mobile app has no S/MIME support.

## Setting it up

1. An admin turns plugins on in the admin console, then installs **S/MIME** from the [marketplace](/docs/guides/marketplace) (or uploads the ZIP from the [plugins repository](https://github.com/bulwarkmail/plugins)). The plugin runs in the [privileged tier](/docs/guides/plugins#privileged-tier), so only an admin can install it; a user upload is refused.
2. Once installed, it is available to users, who turn it on under Settings → Add-ons. The admin can also force it on for everyone on its page under Plugins.
3. Once it is on for you, **S/MIME** appears in Settings under Add-ons. That page holds the key and certificate import, the defaults for new messages and the plugin's own options.

## Capabilities

- Import PKCS#12 (.p12 / .pfx) identity certificates from Settings
- Import recipient public certificates (.cer / .pem)
- Sign with the key whose certificate matches the message's From address
- Turn signing and encryption on per message in the composer's Options menu
- Auto-import signer certificates from incoming verified messages (configurable) so you can encrypt replies without manual setup
- Decrypt incoming messages when the matching key is available
- Verify signatures and show the result: valid or invalid, with marks for a self-signed certificate and a signer that isn't the From address. Expiry is checked; the issuer chain is not

## Algorithm support

| Class             | Supported                                                           |
| ----------------- | ------------------------------------------------------------------- |
| Signing           | RSA or ECDSA keys, with SHA-256. Verifying uses the algorithms pkijs supports |
| Encryption, sending | AES-256-GCM, or AES-128-GCM in the plugin settings                |
| Encryption, reading | AES-CBC (128/192/256), 3DES, DES, AES-GCM (128/256) and ChaCha20-Poly1305. RC2 isn't supported; such mail shows a banner naming the algorithm |
| **Legacy 3DES**   | 3DES and DES content, and RSA PKCS#1 v1.5 key transport (done in JavaScript, since WebCrypto can't) |
| **Legacy PBE**    | Password-based encryption for older PKCS#12 bundles                 |
| Self-signed certs | Detected and reported in the signature status with a clear warning  |

The legacy paths exist because older corporate S/MIME deployments still emit 3DES-encrypted content and PBE-protected key bundles. The plugin bundles pkijs and webcrypto-liner to read these legacy formats in the browser, so you don't have to drop down to a desktop client.

## Importing certificates

1. Open Settings → Add-ons → S/MIME.
2. Choose **Import key** for a `.p12` / `.pfx` file. Enter the file's password if it has one (PBE or modern PKCS#12), then choose a storage passphrase. The key is re-encrypted with that passphrase in your browser; you need it to unlock the key later.
3. Choose **Import certificate** for a `.cer` / `.pem` file you've received from someone you want to encrypt mail to.

There is nothing to link to a sender identity. The plugin signs with the key whose certificate is for the address you send from.

## Sending signed and encrypted mail

In the composer's Options menu:

- **Sign (S/MIME)** - signs with the key whose certificate matches the From address.
- **Encrypt (S/MIME)** - needs a certificate for every recipient. If a recipient has no certificate, the message isn't sent: Bulwark names the recipients without one and keeps the draft.

A password-protected private key is unlocked from the composer itself, so you do not lose the draft.

Set whether new messages start signed or encrypted under **Defaults for new messages** in Settings → Add-ons → S/MIME (**Sign new messages**, **Encrypt new messages**). They apply to every sender address.

## Receiving signed and encrypted mail

The email viewer shows a banner above the message body:

- **Encrypted** - Bulwark decrypts with your unlocked key. If your key is locked, the banner says "Encrypted — unlock your key to read" and offers **Unlock now**; if none of your keys fits, it says "Encrypted — couldn't be decrypted with your keys". Mail in an algorithm the plugin can't read shows "Encrypted — unsupported encryption algorithm" with its name.
- **Valid signature by …** - the signature matches the message. A **self-signed** or **signer ≠ From** mark warns you. **Show certificate details** lists subject, issuer and validity, and says that the issuer chain is not checked.
- **Invalid signature** - the banner names the reason, such as a changed message or an expired certificate.

<img class="theme-light-only" src="/screenshots/light-smime-signed.webp" alt="A signed message with the S/MIME plugin's banner above the body, saying the signature is valid" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-smime-signed.webp" alt="A signed message with the S/MIME plugin's banner above the body, saying the signature is valid" width="5120" height="2880" />

When verification succeeds, Bulwark auto-imports the signer's certificate so you can encrypt your reply without an extra step. You can turn this off in the plugin's settings.

## Keys and accounts

Keys and recipient certificates are stored per browser, not per account: every account signed in to that browser can use them. The key used is the one whose certificate matches the sender address.

## Security notes

- Private keys are stored in the browser (IndexedDB), encrypted with AES-256-GCM under a key derived from your storage passphrase. The raw key bytes are never written to disk and never sent to the server.
- Unlocking a key loads it as a non-extractable WebCrypto key. Unlocked keys are wiped when the app starts and on logout or account switch, so you enter the passphrase again after a reload (the logout behaviour can be changed in the plugin's settings).
- The signature itself is always verified cryptographically; there is no "skip verification" option. The issuer chain is not checked against a trust store: the banner shows the signer and issuer, flags self-signed certificates and a signer that differs from the From address, and leaves the trust decision to you.

## Troubleshooting

### "Encrypted — couldn't be decrypted with your keys"

The message was encrypted to a certificate that matches none of your imported keys. Either import the correct private key, or ask the sender to re-encrypt.

### "Invalid signature"

The banner names the reason: the message was changed after signing, the signature is damaged, the signer's certificate is missing, or the certificate has expired or isn't valid yet.

### Self-signed certificate

The signature is valid, but the certificate wasn't issued by a certificate authority. Bulwark marks it **self-signed** so you don't mistake it for a checked identity. Treat it with extra caution and check the signer and issuer in the certificate details yourself.

### There is no S/MIME page in Settings

The plugin isn't installed or isn't enabled for your user. Ask your admin to install it from the marketplace and enable it; if the admin left it for users to turn on, enable it under Settings → Add-ons. The encryption-at-rest section in Settings → Security is not the same thing: it only takes a public certificate for the server.

### "No S/MIME key for …"

Import a .p12 / .pfx (not just the public .cer) whose certificate is for the address you send from, in Settings → Add-ons → S/MIME. The message names the path as Settings → Plugins → S/MIME; the page is under Settings → Add-ons.

## Next step

Go on to [Account security](/docs/guides/account-security), where you can also add S/MIME or PGP public keys for Stalwart's encryption at rest.
