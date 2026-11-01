---
title: Offline mode
description: Keep recent mail on your device, read and write without a connection, and send what waited from the outbox.
order: 6
edition: full
editionNote: "Offline mode needs Bulwark's service worker. Bulwark Lite doesn't have it."
---

# Offline mode

With **Keep mail on this device** turned on, Bulwark keeps your recent mail in the browser. On a train, a plane or a bad connection you can still read it, flag it, move it and write new mail. What you write waits in the outbox and goes out when you're online again.

## Turn it on

Open **Settings > Backup & reset** and turn on **Keep mail on this device** under **Offline**. It applies to the account you're signed in with, in this browser only. Bulwark then saves the last 30 days of your Inbox and of the folders you open, up to 250 MB, and keeps it up to date while you're online. Below the switch you see how much space it uses.

Turn it on only on your own device. Anyone who can use this browser profile can read the mail it keeps. The data is encrypted, but that only helps against someone who copies the browser's files.

If you don't see the switch, your organisation doesn't allow keeping mail on devices, and the section says so. Bulwark Lite has no offline mode.

## Offline

When the connection is gone, a line at the top says you're offline and that you see the mail kept on this device.

- **Read:** messages from the last 30 days of your Inbox and the folders you opened, with their attachments and images.
- **Flag, mark read or unread, tag, move, delete to Trash:** works at once and is sent when you're online again.
- **Write:** new messages, replies and quick replies. Your organisation's checks still apply when you click Send: a required classification label, warnings about recipients outside the organisation, and send checks. After Send the message goes to the outbox.
- **Not possible offline:** search, deleting for good, emptying a folder, calendar, contacts and files. Bulwark tells you when you try.

You can also open Bulwark without a connection: it starts with the mail it kept. Once you're online again, it asks you to reload, which signs you in and sends what waited.

## The outbox

The line at the top says how many messages wait, and links to the outbox in **Settings > Backup & reset > Offline**. Each message shows its subject, recipients and state:

- **Waiting for a connection:** it goes out by itself when you're online.
- **Couldn't be sent:** the server refused it, with the reason. Fix what you can and click **Send again**, or **Delete** it.
- **The connection broke while sending:** it may have gone out. Check Sent before you click **Send again**.

When you're online again, Bulwark first sends your changes (read, flags, moves), then the messages, oldest first, and tells you about each one it sent.

## Signing out

Signing out removes everything offline mode kept on this device, the outbox included, and turns the switch off. If messages haven't been sent yet, Bulwark asks first. If you're signed out automatically after a time without activity, it can't ask: the sign-in page then names the messages that were deleted unsent.

## Next step

Admins: see [Offline mode](/docs/guides/organisation/offline-mode) for what a device keeps, how it is protected and how to forbid it.
