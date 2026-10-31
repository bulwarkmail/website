---
title: External mail
description: Label mail from outside the organisation and confirm before users send outside it.
order: 4
edition: both
---

# External mail

On **Admin > Organisation > Security**, the **External mail** section has two switches. Both are off until you turn them on.

- **Label external senders** puts an **External** chip next to the sender of mail from outside the organisation, in the reader and in conversations. Hovering it, or tapping it on a phone, shows the sender's domain.
- **Confirm external recipients** asks before a message goes to someone outside the organisation. The dialog lists those recipients and offers **Send anyway** or **Back**. It works for the composer, for quick replies and for meeting invitations.

## Turn it on

1. Pick who it is for in the **Applies to** bar: Everyone, or a domain or group from [Domains and groups](/docs/guides/organisation/domains-and-groups).
2. Turn on **Label external senders**, **Confirm external recipients**, or both.
3. If you work with partner or sister companies, add their domains under **More organisation domains**.
4. Save. Users get the change the next time Bulwark loads.

## Who counts as external

Internal are:

- the domains of the user's own addresses (every address they can send from), always;
- the domains you list under **More organisation domains**.

A domain covers its subdomains: `example.com` also covers `eu.example.com`. Everyone else is external. With no domain known at all, nobody is labelled or asked about.

International domain names work in either form: `bücher.de` in the list matches mail from `xn--bcher-kva.de` and the other way round. Entries that aren't domains are named under the field when you leave it, and aren't saved.

**Trust contacts** (on by default) leaves recipients out of the confirm when they are in the user's contacts, shared address books included. Addresses that are only in the **Trusted Senders** book (the senders whose images always load) don't count as contacts. Trust contacts doesn't change the label: a contact's mail from outside is still marked External.

With several accounts signed in, each message is judged by its own account: its domain or group settings and its addresses. A message sent from another account's address is checked with that account's settings.

## What users see

The chip is small and sits next to the sender's name, so it fits next to the sender check's warning and on a phone's narrow header. It shows when any From address of a message is outside the organisation, and when a From address has no domain at all (`CEO <ceo>`). It goes by the From address: a forged From with an internal address isn't labelled External. Bulwark's own sender check warns about that with **Sender check failed** or **Unverified sender**, as it does without these settings.

The confirm comes after Bulwark's other checks (missing attachment, empty subject, unfilled placeholders), once per send, with every external recipient in To, Cc and Bcc. The automatic Bcc of an address (set in the account's identities) isn't listed. **Back** returns to the message unsent, with the text of a quick reply kept.

For meetings, the confirm comes when the event is saved with invitations on, and lists only the people who are newly invited. **Back** keeps the event open and saves nothing.

## Per domain or group

Every setting on the section can be set per domain or group. For example, to keep the confirm for everyone but drop the label for a subsidiary on its own domain, add a domain entry for that domain on **Domains and groups**, pick it in **Applies to**, and turn **Label external senders** off. Users of that domain then get no label; everyone else keeps it.

## Moving from the External Mail Warning plugin

Bulwark does what the External Mail Warning plugin did, so the plugin is retired:

1. Click **Import from the plugin** to copy the plugin's admin safe domains into the list. It's a change on the page; save to keep it.
2. Turn on the switches you want.
3. Remove the plugin in Extensions > Plugins.

The plugin steps back one switch at a time: with **Confirm external recipients** on, it no longer asks before sending; with **Label external senders** on, it shows no banner and no new-mail toast. Version 1.6.0 and later do this themselves; for older copies, Bulwark skips those parts of the plugin. The section says **Update or remove the External Mail Warning plugin** while an older copy is installed.

Two things don't carry over: each user's own safe domains in the plugin's settings, and its banner for failed SPF, DKIM or DMARC checks. Bulwark's sender check shows **Sender check failed** or **Unverified sender** for those.

## In policy.json

The settings are stored in `organisation.externalMail` in `policy.json`, and per entry in `scopes[].policy.organisation.externalMail`:

```json
{
  "organisation": {
    "externalMail": {
      "senderLabel": true,
      "recipientWarning": true,
      "domains": ["partner.example", "sister-company.example"],
      "trustContacts": true
    }
  },
  "scopes": [
    {
      "id": "subsidiary",
      "label": "Subsidiary",
      "match": { "domains": ["subsidiary.example"] },
      "policy": { "organisation": { "externalMail": { "senderLabel": false } } }
    }
  ]
}
```

| Key | Default | Meaning |
| --- | --- | --- |
| `senderLabel` | `false` | Show the External chip |
| `recipientWarning` | `false` | Confirm before sending to external recipients |
| `domains` | `[]` | More internal domains; users' own domains always count |
| `trustContacts` | `true` | Don't ask about recipients in the user's contacts |

Domains are bare names like `example.com`; `@example.com` and `*.example.com` are read as `example.com`, and international names are stored in their `xn--` form. Entries that aren't domains are dropped when the file is loaded.

Plugins can ask which of these are on through `api.host.features.externalSenderLabel` and `api.host.features.externalRecipientWarning` (see the [plugin guide](https://github.com/bulwarkmail/plugins/blob/main/WRITING_PLUGINS.md#apihost)).

<div class="lite-callout">Bulwark Lite reads the same <code>organisation.externalMail</code> settings from <code>policy.json</code> next to <code>index.html</code>, scopes included. The label and the confirm work the same.</div>

## What isn't possible

- **Users can't turn either off.** They are the organisation's warnings, so there are no user options and nothing to lock.
- **Only Bulwark warns.** The label and the confirm are part of Bulwark, not of the mail server. Mail read or sent with other apps (phone mail apps, Thunderbird) gets neither. Stalwart doesn't add an External tag to messages, and Bulwark doesn't change the subject or body of mail it receives.
- **Some sends aren't checked.** Mail a plugin sends itself (through the plugin API, not the composer) and the unsubscribe message Bulwark sends for a newsletter's List-Unsubscribe link go out without the confirm.
- **No per-user safe lists.** The plugin let each user add domains; core keeps one list per domain or group, set by the admin.
