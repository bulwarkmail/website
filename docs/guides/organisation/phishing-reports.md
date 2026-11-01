---
title: Phishing reports
description: Give users a Report phishing action that sends a suspicious message to your security team and moves it to Junk.
order: 11
edition: both
---

# Phishing reports

With a report address set, users get **Report phishing…** in the message menus. Bulwark sends the message to that address and moves it to Junk. Your security team gets the original, unchanged, with all its headers.

## Turn it on

1. Open **Admin > Organisation > Security** and go to **Phishing reports**.
2. Pick who it is for in the **Applies to** bar: Everyone, or a domain or group from [Domains and groups](/docs/guides/organisation/domains-and-groups).
3. Enter the address under **Send reports to**, for example `security@example.com` or the address of your ticket system.
4. Pick the **Report format** (see below). Leave it on **Forward as an attachment** unless your tool asks for ARF.
5. Save. Users get the action the next time Bulwark loads.

Empty the address to turn reporting off again.

Don't use `postmaster@`. Stalwart analyses mail to that address as reports itself.

## What users see

**Report phishing…** shows in the reader's **More actions** menu (the phone's More panel too), in a message's right-click menu, in the menu of a conversation, and in the selection bar and menu when several messages are selected. It isn't offered in Sent, Drafts or Scheduled, nor for a message reported already. It isn't a swipe, because it sends mail.

Each report asks first: "Report phishing? The message goes to security@example.com and moves to Junk." After **Report**:

- Bulwark sends one report per message, also for a selection. Report desks such as Microsoft Defender drop reports that carry several messages, and RFC 5965 asks for one message per report.
- No copy lands in Sent. The live phishing message shouldn't sit there to be clicked again; your mailbox is the record.
- The message moves to Junk with the keywords `$junk` and `$phishing` and is marked read. On Stalwart, `$junk` also trains the spam filter.
- A toast says "Reported to security@example.com and moved to Junk." with **Undo**. Undo moves the message back and clears the marks. The report was already sent, and the toast says so.

A message with `$phishing` shows a banner, "You reported this message as phishing. Its links are turned off.", and its links can't be clicked or opened. Booking and parcel cards don't show for it either. That holds in the reader, in conversations and in Pro tabs. IMAP clients see the keyword as `$Phishing` (RFC 9051).

## The two formats

**Forward as an attachment** (the default) sends a short message with the subject `Phishing: <original subject>` and the original as an `.eml` attachment (`message/rfc822`). Security mailboxes, ticket systems, KnowBe4-style report mailboxes and Microsoft Defender's user-reported mailbox read this. Bulwark attaches the message by its stored copy on the server, so nothing is uploaded and the upload quota isn't touched. Stalwart sends that attachment base64-encoded; mail programs and report tools decode it, and the message inside is byte for byte the one the user received.

**Abuse report (ARF)** sends a feedback report as defined in RFC 5965: `multipart/report` with `report-type=feedback-report`, a short text, a `message/feedback-report` part with `Feedback-Type: fraud`, `User-Agent: Bulwark/<version>`, `Version: 1`, `Arrival-Date`, `Original-Rcpt-To` and `Reported-Domain`, and the original as `message/rfc822`. Use it for abuse desks and tools that parse feedback reports. Bulwark downloads the original and uploads the report, so it counts against the upload quota and Stalwart's maximum upload size.

## What the report skips

The report goes to your address and isn't the user's own mail, so it skips:

- the confirm for recipients outside the organisation,
- the organisation signature and disclaimer,
- [classification labels](/docs/guides/organisation/classification-labels),
- plugin send checks (`onBeforeEmailSend` isn't called for it).

## Shared mailboxes and several accounts

A message in a group or shared mailbox is reported from the user's own account. Bulwark copies the message to that account first, then moves the original to the shared mailbox's Junk. The user needs the right to remove messages there; without it, the report still goes out and the toast says the message couldn't be moved.

In the unified inbox, each message follows the policy of the account it belongs to. A domain or group scope with its own report address gets its own reports.

## The policy file

The setting is `organisation.phishingReport` in `policy.json`. An empty `address` turns it off; `format` is `forward` or `arf`.

```json
{
  "organisation": {
    "phishingReport": { "address": "security@example.com", "format": "forward" }
  },
  "scopes": [
    {
      "id": "abuse-desk",
      "label": "Hosting customers",
      "match": { "domains": ["customers.example.net"] },
      "policy": { "organisation": { "phishingReport": { "address": "abuse@example.net", "format": "arf" } } }
    }
  ]
}
```

## What isn't possible

- **Users can't set their own address.** The address comes from the policy only.
- **Mail from other clients isn't covered.** A message moved to Junk in an IMAP client or Stalwart's own interface sends no report.
- **Defender's own checks.** Microsoft's reporting mailbox reads extra X-MS headers that only mail that passed through Microsoft 365 has. Reports of other mail still arrive, as user-reported messages.

## Bulwark Lite

It works the same in Lite: the address comes from the `policy.json` next to `index.html`, and everything else happens between the browser and Stalwart.
