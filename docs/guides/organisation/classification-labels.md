---
title: Classification labels
description: Let users mark outgoing mail as Internal, Confidential or VS-NfD, require a label, and show the label of received mail.
order: 12
edition: both
---

# Classification labels

Classification labels mark how a message should be handled, such as Public, Internal or Confidential. The admin defines them; users pick one in the composer. Bulwark writes the label into the message's headers and, if you want, in front of the subject. Received mail with a known label shows it next to the sender.

<div class="bw-note"><b>Important.</b> A label only marks the message. It doesn't make mail meet the VS-NfD handling rules of the German Verschlusssachenanweisung (VSA § 50, § 55): that needs IT approved for it and encryption with a product the BSI approved. Bulwark's S/MIME and PGP plugins and Stalwart are not approved products. Use the VS-NfD label to mark mail, not to send VS-NfD over channels that aren't approved for it.</div>

## Set it up

1. Open **Admin > Organisation > Classification**.
2. Pick who it is for in the **Applies to** bar. Everyone is the usual start.
3. Under **Start from a preset**, pick one:
   - **Generic**: Public, Internal, Confidential and Strictly confidential, with Internal as the default. Confidential and Strictly confidential set Sensitivity and a subject prefix.
   - **German public sector**: OFFEN and VS-NfD, with OFFEN as the default. VS-NfD writes the marking "VS-NUR FÜR DEN DIENSTGEBRAUCH" and the prefix `VS-NfD`. Higher grades (VS-VERTRAULICH and up) need IT approved for them and aren't offered.
4. Change the labels if you like (see below), pick the **Default label**, and turn on **Require a label** if every message needs one.
5. Save. Users get the change the next time Bulwark loads.

Remove every label to turn the feature off. With no labels, the composer shows no picker and nothing is written.

## The fields of a label

| Field | What it does |
| --- | --- |
| Name and colour | What users see in the picker and on received mail. |
| Description | Shown under the label in the picker. |
| Marking | The text in the `SIO-Label` header. Empty uses the name. Received mail is matched by it. |
| Sensitivity | The `Sensitivity` header (RFC 2156) Outlook shows above the message: none, Personal, Private or Company-Confidential (Outlook calls it Confidential). |
| Subject prefix | Added in front of the subject when the message goes out, for example `[Confidential]`. |
| Extra header value | The value of your extra header for this label, when you set one. |

The **Extra header** setting names one header of your own that each label can set, for a mail gateway or DLP rule, for example `X-Classification`. For Microsoft Purview you can name it `msip_labels` and put the tenant's label string in each label's value. It can't be a header Bulwark already writes (Subject, Sensitivity, SIO-Label and the like), and not one the server refuses or that says how mail travelled (`Content-*`, `List-*`, `Resent-*`, `ARC-*`, `Auto-Submitted`, `Precedence`).

## What users see

The composer has a label chip at the end of the subject line; on a phone it sits under the subject. It opens a list of the labels with their descriptions. Arrow keys move the pick, Enter or Escape closes it. The composer's **Options** menu lists the labels too.

- A new message starts with the default label.
- A reply or forward starts with the original's label, else the default. The original's label only counts when it is one of yours, came from a sender inside the organisation, and isn't below the default: anyone outside can write these headers. "Below" follows the order of the list, from least to most protected.
- A reopened draft keeps the label it was saved with, and so does a message brought back by Undo send, Cancel and edit, or edit as new.
- With **Require a label** on and nothing picked, **Send** doesn't send. It says "Pick a classification label before sending." and opens the list. "No label" isn't offered then.

A quick reply has no picker. It sends with the original's label (by the same rule), else the default. If a label is required and there is neither, **Send** opens the full composer with the typed text, so the user can pick one.

A message from a plugin's forward (`api.email.forward`, used by the e-invoice plugin) gets the original's label or the default the same way. If a label is required and there is neither, the forward isn't sent and the user is told to forward it from the composer.

Received mail with a known label shows a coloured chip next to the sender, in the reader and in conversations, for example "Classification: Confidential". The message list doesn't show it. Anyone can write these headers, so the chip is information only: Bulwark never relaxes anything because of a received label.

## What goes into the message

For a label Confidential with the generic preset:

```
Subject: [Confidential] Re: Budget
SIO-Label: marking="CONFIDENTIAL"; fgcolor=#000000; bgcolor=#d97706
Sensitivity: Company-Confidential
```

- `SIO-Label` follows RFC 7444 in its marking form, with the label's colours. A marking with characters outside ASCII uses RFC 2231: `marking*=utf-8''VS-NUR%20F%C3%9CR%20DEN%20DIENSTGEBRAUCH`. Bulwark doesn't write `SIO-Label-History`.
- `Sensitivity` only when the label sets one.
- Your extra header only when you named one and the label has a value for it.
- The subject prefix goes in front once. Bulwark takes any known label prefix out of the leading `Re:` and `Fwd:` chain first, so replies don't pile them up and a changed label replaces the old prefix: a reply to `[Confidential] Budget` labelled Strictly confidential goes out as `[Strictly confidential] Re: Budget`.

The label is added after plugins changed the message (`onTransformOutgoingEmail`), so a plugin can't drop it or set these headers itself. With the S/MIME or PGP plugin, the label headers go into the outer header block, outside the signed or encrypted part, and the plugin gets the prefixed subject. Scheduled and delayed sends keep the label.

While labels are on, Bulwark takes label headers out of every raw message a plugin sends (`api.jmap.sendRaw` and `submitRaw`) and writes its own. The composer gives a plugin that takes the send over a `labelToken` in the request; a plugin that passes it back with its raw send gets that message's label. Plugins that don't pass it yet are matched by the sending address, and when two such sends are open at once from the same address, Bulwark refuses rather than guess. A raw send outside the composer gets the default label, or is refused when a label is required.

These don't carry a label: calendar invitations and replies to them, read receipts, unsubscribe mails, and [phishing reports](/docs/guides/organisation/phishing-reports).

## Domains and groups

The labels of a domain or group scope replace Everyone's as a whole: list, default, requirement and extra header together. In a scope, click **Set labels for this scope** to start from Everyone's labels and change them, or **Use Everyone's labels** to go back.

The labels come from the account and address the message goes out from. A user who sends from a group mailbox whose group has its own scope gets the group's labels; in the Pro interface, a message from another account's identity gets that account's labels.

## The policy file

The section is `organisation.labels` in `policy.json`:

```json
{
  "organisation": {
    "labels": {
      "list": [
        { "id": "internal", "name": "Internal", "color": "#2563eb", "marking": "INTERNAL" },
        {
          "id": "confidential", "name": "Confidential", "color": "#d97706", "marking": "CONFIDENTIAL",
          "sensitivity": "Company-Confidential", "subjectPrefix": "[Confidential]", "extraHeaderValue": "Confidential"
        }
      ],
      "defaultId": "internal",
      "required": true,
      "extraHeader": "X-Classification"
    }
  }
}
```

Each label also takes `description`. `sensitivity` is `""`, `Personal`, `Private` or `Company-Confidential`. An empty `list` turns labels off; `required` is ignored then, and a `defaultId` that isn't in the list is dropped.

## What isn't possible

- **Mail from other clients isn't labelled.** IMAP clients and Stalwart's own interface send without a label, required or not.
- **No label in the message list**, and no search by label: Stalwart can't filter by these headers.
- **No enforcement on the server.** The requirement is checked in Bulwark. Someone who sends through the JMAP API directly can leave the label out.
- **Outlook shows Sensitivity, not SIO-Label.** Thunderbird and Gmail show neither.

## Bulwark Lite

It works the same in Lite, with the labels in the `policy.json` next to `index.html`.
