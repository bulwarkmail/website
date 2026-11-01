---
title: Send checks
description: Warn or stop users before mail with bank account or card numbers, keywords, your own patterns or disallowed attachments goes out.
order: 15
edition: full
---

# Send checks

The **Send Checks** plugin looks at a message when the user presses Send and warns, or stops the send, when it finds something your organisation doesn't want to leave by mail: IBANs, payment card numbers, keywords, your own patterns, or attachments of a type or size you don't allow.

## Set it up

1. Install **Send Checks** 1.0.0 under **Admin > Extensions > Plugins** (from the marketplace, or upload its ZIP). It needs Bulwark 1.20.0.
2. Open it in the plugin list and turn on **Force on for everyone** under **Availability**.
3. Check the rules on the plugin's page. With the defaults it warns about IBANs and card numbers in mail that goes outside the organisation, and does nothing else until you fill in the lists.

Rules are global: the plugin can't use different rules per domain or group. Which recipients are outside the organisation does follow your domains and groups (see below).

## Rules

Each rule is **Warn** (the user confirms) or **Block** (the message can't be sent), and most can apply only when a recipient is outside the organisation.

| Setting | Key | Default | What it checks |
| --- | --- | --- | --- |
| IBANs | `ibanAction`, `ibanExternalOnly` | Warn, outside only | IBANs with the right length for their country and a valid check digit (mod 97), written together or in groups of four |
| Payment card numbers | `cardAction`, `cardExternalOnly` | Warn, outside only | 13 to 19 digits that pass the Luhn check and start like a card network's number |
| Keywords | `keywords`, `keywordAction`, `keywordExternalOnly` | Empty, Warn | One word or phrase per line, any case, whole words |
| Patterns | `patterns`, `patternAction`, `patternExternalOnly` | Empty, Warn | One regular expression per line, `Name: pattern` |
| Blocked file types | `blockedTypes` | Empty | Extensions and MIME types, for example `exe, bat, cmd, scr, js, vbs, ps1, msi` |
| Allowed file types | `allowedTypes` | Empty | When set, only these may be attached, for example `pdf, docx, xlsx, image/*` |
| Largest attachment (MB) | `maxSizeMb` | 0 (no limit) | Per file |
| Attachments: action | `attachmentAction`, `attachmentExternalOnly` | Block | For the three attachment rules |

Patterns that could freeze the browser are skipped: lines over 200 characters, nested repeats such as `(a+)+`, repeated alternatives and back references. The plugin's README lists the rules.

## What is scanned

- The subject.
- What the user wrote, without the quoted original of a reply or forward and without the signature. An IBAN in the message being answered doesn't warn on every reply.
- Attachment names.
- The first megabyte of text attachments (txt, csv, json, xml, ics, vcf and other text files).
- Each attachment's type, by its extension and by its first bytes. Bulwark reads the start of every file and tells the plugin what it is, so a program renamed to `invoice.pdf` is still a program. A Word or Excel file is a ZIP inside; that doesn't count as a `.zip`.
- Each attachment's size. Images pasted into the text count for the size limit only.

A blocked file type, or a file over the limit, is refused as soon as it is attached when the attachment rule blocks for all recipients. Otherwise it is checked at Send.

## What users see

- **Warn:** "Check before sending" lists what was found, with **Send anyway** and **Go back**.
- **Block:** "This message can't be sent" lists what was found, and the message stays in the composer.
- Matches are named by rule and masked: "IBAN DE89 … 3000", "Card number ending 4242", "The word “confidential”". The full number is never shown.
- When a rule counted only because a recipient is outside, the dialog says so.

## Outside the organisation

Bulwark decides which recipients are outside, with the same domains as the [external mail warning](/docs/guides/organisation/external-mail): the domains under **More organisation domains** for the account the message goes out from (with its domain and group settings) and the domains of that account's own addresses. This works whether or not the recipient warning itself is on. The plugin learns only which recipients are outside, not your domain list. Bcc counts too.

## Which sends are checked

- The composer: new mail, replies, forwards, re-opened drafts, scheduled sends and sends with undo, inline, in a new window and in Pro tabs.
- Quick replies under a message.
- Forwards a plugin makes (`api.email.forward`).
- S/MIME and PGP mail: the composer checks it before the crypto plugin signs or encrypts it.

**Not checked:**

- Mail sent from other mail programs over IMAP and SMTP (Outlook, Thunderbird, phones). The check runs in Bulwark, not on the mail server.
- Calendar invitations and replies to them: the mail server sends those when an event is saved.
- Read receipts, List-Unsubscribe mails and [phishing reports](/docs/guides/organisation/phishing-reports), which Bulwark sends on its own.
- Messages a plugin builds and sends itself with its raw send outside the composer.

## When the check isn't running

A force-enabled send check that is still loading, failed to start or was turned off after repeated errors would let mail through. Bulwark waits a few seconds for it when the user presses Send, and then refuses to send: "Not sent. A check your organisation requires isn't running. Try again in a moment." This applies to every force-enabled plugin that checks mail before it is sent, not only Send Checks. A plugin Bulwark refuses on purpose (for example with [No third-party traffic](/docs/guides/organisation/third-party-traffic) on) doesn't hold sends; the Security page lists those.

## The policy file

The rules aren't in `policy.json`; they are stored with the plugin and set on its admin page. Force-enabling it and the internal domains are in `policy.json`:

```json
{
  "forceEnabledPlugins": ["send-checks"],
  "organisation": {
    "externalMail": { "domains": ["example.com", "example-group.de"] }
  }
}
```

## Bulwark Lite

Lite has no plugins, so it has no send checks.

## What isn't possible

- **A guarantee against leaks.** The check is a safety net against mistakes. Someone who wants to get around it can write a number differently, or use another mail program.
- **Checking on the server.** The mail server sends what other programs hand it unchecked. For that you need a filter on the mail server or the gateway.
- **Per domain or group rules.** Plugin settings are global.

## Next step

Go back to the [Organisation settings](/docs/guides/organisation).
