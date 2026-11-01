---
title: Mail import and export
description: What to set on Stalwart so users can move their mail in from mbox, PST or EML files, and how export can be turned off.
order: 11
edition: both
---

# Mail import and export

Users can bring old mail into Bulwark themselves and save their mail as files. There is nothing to turn on in Bulwark. What an admin may want to change is Stalwart's upload limit, which a large import runs into.

- **Import** reads `.eml` files, ZIP archives of `.eml` or `.mbox` files, mbox files (Thunderbird, Apple Mail, Google Takeout, mutt) and Outlook data files (`.pst`, `.ost`). Outlook folders and the folders inside a ZIP can be recreated under a folder the user picks.
- **Export** saves one folder as an mbox file or a ZIP of `.eml` files, or the whole account as a ZIP with one mbox file per folder or with `.eml` files in the folder tree.

Users start either from a folder's right-click menu (**Import mail…**, **Export folder…**) or from **Settings > Backup & reset**. The user guide is [Import and export mail](/docs/features/email/import-export).

All of it happens in the browser. The files never pass through Bulwark's server: messages are uploaded straight to Stalwart and downloaded straight from it, as everything else in the mail view is.

## The upload limit

Stalwart counts every upload of a user for an hour, whether the message is imported or not. With its defaults a user can upload **1000 messages or 50 MB per hour**, whichever comes first. A 3 GB PST is therefore about 60 hours of importing.

When the limit is reached, Bulwark pauses the import and shows until when, for example "Paused until 14:00". It goes on by itself when the hour is over. The user can keep working meanwhile, close the dialog (a small chip in the corner shows the progress) or cancel. If the tab is closed, importing the same file into the same folder again continues where it stopped, so nothing is imported twice.

For a migration, raise the limit on Stalwart before users start:

- **For a few users:** give them, or a role they have, the **Unlimited uploads** permission (`UnlimitedUploads`). By default Stalwart gives it to administrators only.
- **For everyone:** raise `maxUploadCount` (files per window, default 1000) and `uploadQuota` (bytes per window, default 50 MB) in Stalwart's JMAP settings. `uploadTtl` is the length of the window (one hour).

Put the values back once the migration is done. The limit also protects the server from a user who uploads in a loop.

Two more Stalwart limits matter:

- **One message may be at most `maxSizeUpload`** (50 MB by default, shown in the JMAP session). Bigger messages are skipped and counted in the import summary.
- **Requests at a time:** Stalwart 1.0 counts downloads against `maxConcurrentRequests` (4 by default). Export and import keep two requests free for the rest of the app and stay well under the 1000 requests a minute Stalwart allows per user, so the mail view stays usable while they run.

## Turn export off

**Admin > Organisation > Devices > No export** hides **Export folder…**, **Export all mail** and the other ways to save mail as files, for everyone or for a domain or group. Import stays. In `policy.json` it is `organisation.devices.noExport`:

```json
{
  "organisation": {
    "devices": { "noExport": true }
  }
}
```

Like every device policy this is a browser setting. Users can still read their mail with another client, through IMAP or JMAP, and save it there. See [Device policies](/docs/guides/organisation/device-policies).

## Bulwark Lite

Import and export work the same in Lite. The Outlook reader is a separate file, `pst-worker.js`, in the Lite build; the browser only loads it when someone imports a PST file. On Stalwart's own web server the file is asked for with the build id in its address, so a new version is never mixed with an old reader.

## What isn't possible

- **Outlook contacts, calendar items and tasks** in a PST are counted and left out. Only mail is imported.
- **Messages attached to Outlook messages** (an `.msg` inside a message) can't be read and are counted in the summary.
- **PST files with high encryption** can't be read. Ask the user to export the mail from Outlook to a new PST file without it. Outlook's usual compressible encryption works, and a PST password doesn't stop the import (Outlook doesn't encrypt with it).
- **Rebuilt Outlook messages:** a PST stores the parts of a message, not the message as it arrived. Bulwark keeps the original headers where Outlook kept them (received mail) and builds the rest from the bodies and attachments. Signatures (DKIM, S/MIME) of such messages don't verify any more.
- **No duplicate check:** the same file imported twice into a different folder, or after the earlier import finished, gives two copies. Stalwart doesn't detect duplicates on import.
- **Very large files in old browsers:** Chrome and Edge write an export straight into the file the user picks; Firefox and Safari write it to the browser's private storage first and then download it. A browser that has neither keeps the export in memory and stops at 200 MB.
- **Read state in .eml exports:** a ZIP of `.eml` files holds the messages exactly as the server stores them, without read or flagged state. mbox exports keep the state and the arrival time.
- **Shared mailboxes:** a folder of a shared mailbox imports and exports in that mailbox's account. **Export all mail** covers the user's own account only.
