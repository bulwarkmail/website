---
title: Signatures and disclaimers
description: Give every message the organisation's signature, filled in with each user's details, and a legal disclaimer.
order: 2
edition: both
---

# Signatures and disclaimers

On **Admin > Organisation > Signatures** you write one signature for the organisation, or one per domain or group, and a disclaimer that goes below every message. Bulwark fills the signature in for the address each message is sent from.

## Set up a signature

1. Pick who it is for in the **Applies to** bar: Everyone, or a domain or group from [Domains and groups](/docs/guides/organisation/domains-and-groups).
2. Write the **HTML signature**. Click a placeholder to insert it at the cursor. The preview shows it with sample values; tick **For a user who filled in no details** to see what a user without a phone number gets.
3. Optionally write a **Plain-text signature** for plain-text mail. Without one, Bulwark makes the text from the HTML.
4. Save.

Without a lock, the organisation signature is the default: an address that has no signature of its own gets it, and users can still write their own. To make it the signature of everyone, lock it (see below).

<img class="theme-light-only" src="/screenshots/light-admin-signatures.webp" alt="The Signatures page in the admin console, with the organisation signature, its placeholders and a disclaimer" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-signatures.webp" alt="The Signatures page in the admin console, with the organisation signature, its placeholders and a disclaimer" width="5120" height="2880" />

### Placeholders

| Placeholder | Filled in with |
| --- | --- |
| `{name}` | The name of the address the message is sent from |
| `{email}` | That address |
| `{identity}` | Name and address, as in From: `Anna Berg <anna@example.com>` |
| `{company}` | The company name from Branding. With branding per domain, the one for the web address Bulwark is opened on, not the sender's domain |
| `{domain}` | The domain of the address |
| `{title}` | Job title, filled in by the user |
| `{department}` | Department, filled in by the user |
| `{phone}` | Phone number, filled in by the user |
| `{mobile}` | Mobile number, filled in by the user |

Values are inserted as text, so a user can't put HTML into the signature through their details. A line whose placeholders are all empty is left out: with `Mobile: {mobile}` on its own line, a user without a mobile number gets no "Mobile:" line. In HTML, a line is what sits between two `<br>`s (also inside a `<span>` or `<font>`, as signatures pasted from Outlook or Gmail have them) or in its own paragraph, and a table row counts as one line. An image on such a line, a logo for example, stays.

### What users fill in

**User details** on the same page lists the details the signature asks for. Users fill them in once under **Settings > Account > Your details**, which shows the fields the signatures and disclaimers of any of their addresses use (a group address can have its group's), with a preview of the signature their main address sends. The details count for every address the user sends from.

<img class="theme-light-only" src="/screenshots/light-composer-org-signature.webp" alt="A new message with the organisation signature filled in with the sender's name, job title, department and phone number" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-composer-org-signature.webp" alt="A new message with the organisation signature filled in with the sender's name, job title, department and phone number" width="5120" height="2880" />

### Lock or hide it

The **Signatures** row at the end of the section sets what users may change:

- **Lock**: the organisation signature replaces every user's own signature. In the address editor users see their filled-in signature, read-only, with "Set by your organisation". If they delete it from a message, Bulwark puts it back when the message is sent. Plugins that change signatures leave a locked one alone.
- **Hide**: users get no signature editor at all, and the organisation signature is used as with a lock.

A lock without an organisation signature only stops users from changing the signatures they have.

### Which signature an address gets

The signature follows the user's domain and groups, like every Organisation setting. An address of a group the user is a member of (sending as `sales@example.com`) gets the signature of the group's entry when a group entry names that group; every other address of the user, an alias in another domain included, gets the user's. With several accounts signed in, a message gets the signature of the account it is sent from.

## Set up a disclaimer

Write the **HTML disclaimer** and, if you want, a **Plain-text disclaimer**, in the same **Applies to** scope. The placeholders work here too.

Bulwark adds the disclaimer when a message is sent, below everything, the quoted message and footers that plugins add included: a line and the HTML in the HTML part, a blank line and the text in the text part. Without a plain-text version the text is made from the HTML. When a plugin signs or encrypts the message (S/MIME, PGP), the disclaimer is added first, so it is part of what is signed. Drafts never contain it, so a draft opened again doesn't end up with two, and a message taken back with Undo and sent again keeps the one it has. Users see it under the editor as a read-only block marked "Added when you send". Quick replies get the signature and the disclaimer too.

## In policy.json

Both are stored in `organisation` in `policy.json`, at the top level for Everyone or in an entry's `policy`:

```json
{
  "restrictions": {},
  "organisation": {
    "signature": { "html": "", "text": "", "fields": [] }
  },
  "scopes": [
    {
      "id": "example",
      "label": "Example",
      "match": { "domains": ["example.com"] },
      "policy": {
        "organisation": {
          "signature": {
            "html": "<p><b>{name}</b><br>{title}<br>Phone: {phone}<br>Mobile: {mobile}</p><p>{company}</p>",
            "text": "{name}\n{title}\nPhone: {phone}\nMobile: {mobile}\n{company}",
            "fields": ["title", "phone", "mobile"]
          },
          "disclaimer": {
            "html": "<p>This message is confidential.</p>",
            "text": ""
          }
        },
        "restrictions": { "signature": { "locked": true } }
      }
    }
  ]
}
```

- `signature.html` and `signature.text`: the templates. Both empty means no organisation signature.
- `signature.fields`: the details users are asked for, out of `title`, `department`, `phone` and `mobile`. The Signatures page of the admin console keeps it in step with the templates. A field a template uses is asked for even when it's missing here.
- `disclaimer.html` and `disclaimer.text`: both empty means no disclaimer.
- `restrictions.signature`: `{ "locked": true }` or `{ "hidden": true }`.

The users' details are a synced setting, `signatureDetails`.

<div class="bw-note"><b>Note.</b> Bulwark Lite applies the signature, the disclaimer and the lock from <code>policy.json</code> the same way. Lite has no settings sync, so the details a user fills in stay in that browser: on another browser or device they fill them in again.</div>

## What isn't possible

- **Mail sent from other apps gets nothing.** Bulwark adds the signature and the disclaimer in the browser, when the message is written and sent in Bulwark. Mail sent from a phone's mail app, Thunderbird or anything else over IMAP and SMTP has neither. For a disclaimer on every message whatever sends it, add it on the mail server.
- A user can still delete an unlocked signature from a message. A locked one can be deleted or edited in the message too (double-clicking a signature makes it editable, and plain text is plain text), but Bulwark checks on send: a locked signature that is missing or was changed is added again below the message, so the original always goes out.
- Users can't fill in details for only some of their addresses: the details are the same for all of them.
- Messages a plugin sends on its own (through its raw-send access) and the unsubscribe mails Bulwark sends for a List-Unsubscribe mailto link get neither the disclaimer nor the signature check.
