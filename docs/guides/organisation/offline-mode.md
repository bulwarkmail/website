---
title: Offline mode
description: What Bulwark keeps on a device when users turn on offline mode, how it is protected, when it is deleted, and how to forbid it.
order: 20
edition: full
editionNote: "Offline mode needs Bulwark's service worker, which Bulwark Lite doesn't register. Lite has no offline mode."
---

# Offline mode

Users can turn on **Keep mail on this device** in **Settings > Backup & reset > Offline**. Bulwark then keeps their recent mail in the browser, so they can read it, flag it, move it and write new mail without a connection. What they write waits in an outbox and goes out when the device is online again.

It is off on every device until the user turns it on there. The switch belongs to the browser and the account: it isn't synced to other devices, and every sign-out turns it off again. You don't have to do anything for it to work. If people in your organisation must not keep mail on their devices, forbid it (below).

## What a device keeps

- The last 30 days of the Inbox, and of the folders the user opened, at most 500 messages from the Inbox and 200 from each other folder (up to 10 folders).
- The text of those messages, and their attachments and inline images up to 5 MB each. Other files (a folder export, a file opened from the Files app) are never kept.
- The folder list, the user's sending addresses, and the session details Bulwark needs to start without the server (no password or token).
- Messages written offline, with their attachments, until they are sent.
- The app itself (the pages and files of the Bulwark version that runs), so the app also opens without a connection.

All of it together takes at most 250 MB per browser. When it is full, the oldest messages go first, with their text and attachments. The outbox doesn't count against this and is never removed to make room.

## How it is protected

Everything Bulwark keeps is encrypted with AES-GCM in the browser's IndexedDB. The key is made by the browser as non-extractable: scripts can use it, but nobody can read it out. Dates, sizes and message ids stay readable, so Bulwark can find the oldest messages without decrypting everything.

This protects against someone who copies the browser profile's files, for example from a backup or a stolen disk, and can't run the webmail in that profile. **It does not protect against someone who can use the unlocked browser profile**: they can open Bulwark offline and read the mail, just as the user can. Ask people to use offline mode only on their own devices, and use disk encryption.

## What works offline

| | Offline |
| --- | --- |
| Folder list, kept messages, threads | Yes |
| Read, unread, flag, tags, move, delete to Trash | Yes, sent in order once online |
| New message, reply, quick reply, forward from the composer | Yes, through the outbox |
| S/MIME and PGP | Yes, in a tab that was open before the connection went: signed and encrypted when the user clicks Send. Not after Bulwark was opened without a connection (see below) |
| Search | No (needs the server) |
| Delete for good, empty a folder | No, refused with a message |
| Calendar, contacts, files | No |
| Phishing reports, invitation answers, unsubscribe, sends from plugins | No, refused like any action that needs the server |

## The outbox and your checks

A message in the outbox has been through everything a normal send does: your [classification labels](/docs/guides/organisation/classification-labels) (a required label still stops it), the external recipient warning, the organisation signature and disclaimer, [send checks](/docs/guides/organisation/send-checks) (a check that isn't running still holds the message back), and S/MIME or PGP with the user present. Only the finished message waits. Sending it later can't skip a check.

Plugins only run when the browser could load them. After Bulwark was opened without a connection none can, so no message goes to the outbox while any plugin the user has on isn't running: the composer says "Your signing or encryption plugin isn't running offline. Send this when you're back online." That way a message never goes out unsigned, unencrypted or unchecked.

Before the outbox sends anything, Bulwark fetches the policy again. If your rules got stricter while a message waited (a label is now required and it has none, or a send check is now required), the message isn't sent: it stays in the outbox, marked, and the user deletes it and writes it again.

When the device is online again, Bulwark sends the changes (read, flags, moves) and the messages in the order they were made. A change the server refuses, for example because the message was deleted meanwhile, is dropped: the server's state wins. A message the server refuses stays in the outbox, marked with the reason, and the user can send it again or delete it.

Only one tab sends at a time, and each message is taken for sending once, so two open tabs don't send it twice. A message goes back to waiting only when the connection broke before Bulwark handed it to the server. If it broke while the message was on its way, Bulwark can't tell whether it went out: it marks the message and doesn't send it again by itself. The user checks Sent and then sends it again or deletes it. The same goes for a message whose tab was closed while it was being sent.

An undo-send delay that passed while the message waited is dropped: the message goes at once.

## When it is deleted

- **Every sign-out.** Signing out of all accounts deletes everything offline mode kept on the device, the outbox included. If messages haven't been sent, Bulwark asks first ("1 message hasn't been sent. Signing out deletes them.").
- **The automatic sign-outs:** after inactivity or the maximum session length ([sign-out times](/docs/guides/organisation/sessions)), and when the server ends a session. They don't ask. The sign-in page then names the messages that were deleted unsent (or a notice does, when another account stays signed in).
- **Signing out one account** of several deletes that account's data only.
- **Turning it off** in Settings deletes that account's data. With unsent messages Bulwark asks first.
- **When you forbid it** (below).

## Forbid it

Open **Admin > Organisation > Devices**, pick **Everyone** or a domain or group in the **Applies to** bar, and turn on **Don't let people keep mail on their devices**. Users in the scope no longer see the switch; Settings says that the organisation doesn't allow it, with **Set by your organisation**.

A device that already keeps mail deletes it, unsent messages included, at its next policy fetch: when the tab is opened, reloaded or focused (at most once a minute), every 15 minutes while it stays open, and before the outbox sends anything once the connection is back. The user is told. For an account other than the one shown, Bulwark decides once it knows that account's groups.

With several accounts signed in, each account follows its own scope: forbidding it for one doesn't delete another account's data.

In `policy.json` the switch is `organisation.devices.noOffline`:

```json
{
  "organisation": {
    "devices": { "noOffline": true }
  }
}
```

Or for a group only:

```json
{
  "scopes": [
    {
      "id": "field-staff",
      "label": "Field staff",
      "match": { "groups": ["field@example.com"] },
      "policy": { "organisation": { "devices": { "noOffline": true } } }
    }
  ]
}
```

## Started offline

When the browser opens Bulwark without a connection (or the mail server can't be reached at all) and the account keeps mail on the device, Bulwark starts from what it kept: the app from the service worker, the mail from the device, and the organisation's settings from the last policy it fetched (never the defaults, so a lock can't be lifted by going offline). Changes wait as usual; new mail only when the user has no plugins on (see above). When the server answers again, Bulwark signs in by itself and sends what waited. If a message is being written at that moment, it asks the user to reload instead, so the message isn't lost.

## Updates

The service worker keeps the files of each Bulwark version apart. A tab that is open while you deploy a new version keeps working with its own files and offers **A new version of Bulwark is ready. Reload**. That prompt shows to every user after a deploy, with offline mode on or off. A version's files are deleted once no open tab uses them.

## What isn't possible

- **No protection against the unlocked profile:** see above. Bulwark doesn't ask for a password to open the mail kept offline.
- **Not everything:** older mail, folders the user never opened, search, calendar, contacts and files need the server.
- **Browser storage can be cleared:** a browser that runs low on space, or a user who clears site data, deletes the cache and an unsent outbox. Bulwark asks the browser to keep it, but browsers decide.
- **Other mail apps:** this only concerns the Bulwark web app. The Bulwark mobile app and other mail clients have their own storage.

## Bulwark Lite

Lite has no offline mode: it registers no service worker. The switch doesn't show there. The reload prompt after a deploy does work in Lite; it compares the build with `lite-build.json`.

## Next step

Go back to [device policies](/docs/guides/organisation/device-policies) for the other switches on the Devices page.
