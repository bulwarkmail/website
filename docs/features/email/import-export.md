---
title: Import and export mail
description: Bring in mail from Thunderbird, Outlook, Gmail or .eml files, and save a folder or your whole mailbox as a file.
order: 4
edition: both
---

# Import and export mail

You can move old mail into Bulwark from files, and save your mail as files to keep or to open in another program. Everything runs in your browser: the files go straight between your computer and your mail server.

## Import

Right-click the folder the mail should go into and choose **Import mail…**, or open **Settings > Backup & reset** and click **Import…** next to **Import mail**. Then click **Choose files…** and pick one or more files:

| File | Where it comes from | What is kept |
| --- | --- | --- |
| `.eml` | One saved message from almost any mail program | The message, its date; read and flagged state if Thunderbird saved it |
| `.zip` | A ZIP of `.eml` or `.mbox` files, such as Bulwark's own export | The messages and their folders |
| `.mbox` | Thunderbird, Apple Mail, Google Takeout, mutt and most other programs | Date, read, flagged and answered state, tags |
| `.pst`, `.ost` | Outlook (File > Open & Export > Import/Export > Export to a file) | Folders, dates, read and flagged state, attachments and inline pictures |

Pick the folder under **Import into**. For an Outlook file or a ZIP with folders, **Recreate the folders from the file** builds the file's folders inside that folder. Choose **Top level** to put them next to your own folders: Inbox, Sent Items and Deleted Items then go into yours, and folders with a name you already have are used again.

Click **Import**. The dialog shows how far it got. **Run in background** hides it while you go on with your mail; a small chip in the corner shows the progress and opens the dialog again. When it is done, the dialog lists what was imported, what was left out and why (for example contacts and calendar items from Outlook, or messages Thunderbird had deleted), and the messages that failed.

<div class="bw-note"><b>Note.</b> Mail servers take only so much at once. With the usual settings that is about 1000 messages or 50 MB an hour. A larger import pauses, says until when, and goes on by itself. Ask your administrator to raise the limit if you are moving a large mailbox.</div>

**Cancel import** stops it. What was imported stays. To go on later, even after closing the browser, import the same file into the same folder again: Bulwark offers to continue where the last import stopped, so no message comes in twice.

## Export

Right-click a folder and choose **Export folder…** to save that folder, or open **Settings > Backup & reset** and click **Export…** next to **Export all mail** to save every folder of your account.

Pick a format:

- **mbox file** (a ZIP with one mbox file per folder for the whole account): Thunderbird, Apple Mail and most mail programs open it, and read, flagged and answered state and the arrival time come along. Bulwark imports it back as it was.
- **ZIP of .eml files**: one file per message, in folders like yours. Any mail program opens them, but read state isn't stored in them.

Where the file goes depends on the browser. Chrome and Edge ask where to save it first and write into it as the export runs, so even a very large mailbox works. Firefox and Safari download the file when the export is done. A browser that can do neither keeps the export in memory and stops at 200 MB; export folder by folder there.

The export can run in the background like the import, and **Cancel export** stops it and deletes the unfinished file.

If your organisation turned export off, the export entries aren't shown.

## Good to know

- An Outlook message that came by mail keeps its original headers. Mail you sent from Outlook is rebuilt from what Outlook stored, so it looks the same but its signatures don't verify any more.
- Messages attached to Outlook messages can't be read and are left out.
- Importing the same file again (not continuing an import that stopped) gives you a second copy of each message.
- A folder of a shared mailbox imports and exports in that mailbox. **Export all mail** saves your own mailbox only.
