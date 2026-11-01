---
title: Device policies
description: Make copying mail out of Bulwark harder with no downloads, no export, no printing, no install prompt, push without sender and subject, and a watermark. Weak protection, and why.
order: 19
edition: both
---

# Device policies

**Admin > Organisation > Devices** has switches that make it harder to copy mail out of Bulwark on the devices people use. Each is off until you turn it on, for everyone or for a domain or group.

<div class="bw-note"><b>This is weak protection.</b> These settings make copying harder in Bulwark. They don't stop screenshots, a phone camera, other mail apps (IMAP, Outlook, Thunderbird, the mail app on a phone), or someone who knows the browser's developer tools. The browser fetches mail from Stalwart directly with the user's own sign-in, so Bulwark's server can't see or stop most of it. Use them to keep honest people from saving files by habit, not to keep mail from someone who wants it. If mail must not leave a device, that takes device management and a mail server that only that device can reach.</div>

To turn a switch on:

1. Open **Admin > Organisation > Devices**.
2. Pick **Everyone**, or a domain or group, in the **Applies to** bar.
3. Switch on what you need.
4. Click **Save**.

## What each switch does

| Switch | What users get | Checked by |
| --- | --- | --- |
| **No downloads** | Attachments and files open in the preview only. There is no Download, Download all, Open in new tab, Save to Files or dragging out, PDFs show without the browser's PDF viewer (which has its own download button), and video and audio show without a download button where the browser allows it. The Files app has no downloads either, so Save to Files can't get around it. A file that can't be previewed doesn't open at all. | The browser; in the office editor the server |
| **No export** | No saving a message as `.eml`, no **View source**, no dragging messages out to the desktop, and no exporting a folder or the whole account (mbox, ZIP). An export that is running, or waiting to be downloaded, stops and its file is deleted when you switch this on. Importing mail stays. | The browser; in the office editor the server |
| **No printing** | No Print buttons in mail, calendar and contacts. Ctrl+P and the browser's menu can't be stopped, so the page then prints only "Printing is turned off by your organisation." | The browser; in the office editor the server |
| **No install prompt** | Bulwark doesn't offer to install itself as an app, and holds back the browser's own install banner. The browser's menu can still install Bulwark. | The browser |
| **Push without sender and subject** | Browser notifications, on the desktop and from Bulwark installed on a phone's home screen, say only "New mail" or "3 unread messages". The Bulwark mobile app isn't covered yet: its notifications still show sender and subject. | The server |
| **Watermark** | The user's address and the date, repeated faintly across the message, the conversation view, previews of attachments and files (pictures in the Files app too), and every printout: mail, calendar, contacts and plugin printouts. | The browser; in the office editor the server |

## What the server enforces

Two things are checked on Bulwark's server, so they hold even for a user who blocks requests in the browser or runs an old Bulwark version:

- **The push text.** Notifications get their text from Bulwark's server (`/api/push/preview`). Under **Push without sender and subject** it asks Stalwart for the message's id only, so the sender, subject and text never leave the server for the notification. What the push service (Google, Apple, Mozilla) carries was already ids only. This is the web app's push path; the Bulwark mobile app reads mail for its notifications itself and doesn't follow the switch yet.
- **The office editor.** When a document opens in Collabora or ONLYOFFICE, Bulwark's server tells the editor what this user may do: under **No printing** it turns printing off (`DisablePrint`, `HidePrintOption`), under **No downloads** or **No export** it turns export, "save a copy" and copying off (`DisableExport`, `HideExportOption`, `HideSaveOption`, `DisableCopy`), and **Watermark** sets `WatermarkText`. Collabora reads all of these. Other editors may ignore some of them, `WatermarkText` in particular; check yours.

For both, the server works out the user's domain and groups from their own JMAP session. Every group or shared mailbox in that session counts as a group here, so a scope matches rather more often than less. When the session can't be read (the mail server doesn't answer, an office editor link outlived its sign-in), every switch that Everyone or any scope turns on applies, and when the policy itself can't be read the editor turns everything off.

Everything else is checked in the browser only. Bulwark hides the buttons, and the code that hands out a file refuses as well, but someone who knows the browser's tools can fetch the mail from Stalwart themselves.

## With several accounts

Each message follows the policy of the account it belongs to. In a unified inbox with a restricted work account and an unrestricted second account, attachments of the work account's mail can't be downloaded and those of the other account can.

What isn't about one message follows the strictest account signed in: the install prompt, Ctrl+P, the watermark on calendar and contacts printouts, and the Files app.

## Plugins

Plugins can't get around the switches through Bulwark: under **No downloads** or **No export** a plugin can't save a file (`ui.downloadFile`), and under **No printing** it can't print (`ui.print`). A plugin with network access could still send what it reads somewhere else; only install plugins you trust. Plugins can also show their own notifications with any text, so **Push without sender and subject** doesn't cover them.

## The policy file

The switches are `organisation.devices`:

```json
{
  "organisation": {
    "devices": {
      "noDownloads": false,
      "noExport": true,
      "noPrint": false,
      "noInstallPrompt": false,
      "pushWithoutContent": true,
      "watermark": false
    }
  },
  "scopes": [
    {
      "id": "finance",
      "label": "Finance",
      "match": { "groups": ["finance@example.com"] },
      "policy": { "organisation": { "devices": { "noDownloads": true, "noPrint": true, "watermark": true } } }
    }
  ]
}
```

Keys a scope leaves out come from Everyone. `noOffline` in the same section belongs to offline mode.

## Bulwark Lite

Lite has no server of its own, so every switch is checked in the browser. Lite has no push notifications and no office editor, so those two parts don't apply. The install prompt switch works in Lite.

## What isn't possible

These stay out of reach of the switches:

- **Forwarding.** Users can forward a message, attachments included, to any address. Restrict outgoing mail in Stalwart (sending rules, allowed recipient domains) if that matters.
- **Printing to a PDF.** With only **No downloads** on, the browser's print dialog can still save a message as a PDF. Turn on **No printing** too.
- **Copying to another account.** "Copy to" another account signed in to Bulwark is offered only into an account whose switches are at least as strict, but mail copied by another app isn't covered.
- **Pictures the message loads from the web.** Under **No downloads** a right-click on a picture in a message offers no "Save image as", and pictures can't be dragged out; a picture that comes from a web address can still be opened at that address. Long-pressing a picture on some phones still offers to save it.

- **Stopping screenshots or other apps.** See the note at the top.
- **Stopping Ctrl+P.** Browsers don't let a page stop printing; Bulwark can only make the printout blank.
- **Contacts and events.** **No export** covers mail. Contacts can still be exported as vCard and events as `.ics`.
- **The user's own files.** Under **No downloads** users can still upload files and attach them; they can't download them again from Bulwark.
- **A watermark that can't be removed.** It is drawn over the page by Bulwark; the browser's tools can remove it, and it isn't part of the message.
