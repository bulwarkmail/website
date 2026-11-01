---
title: Announcements and retention notice
description: Show users a message across the top of every app, and tell them how long Trash and Junk keep mail.
order: 14
edition: both
---

# Announcements and retention notice

Both live on **Admin > Organisation > Notices**.

## Announcement

An announcement is one message across the top of mail, calendar, contacts, files, settings and plugin pages: planned maintenance, an outage, a new rule. It shows for everyone in scope, from a start time to an end time, in the user's language.

To write one:

1. Open **Admin > Organisation > Notices**.
2. Pick **Everyone**, or a domain or group, in the **Applies to** bar.
3. Click **Write an announcement** and type the text. Web addresses in it become links.
4. Pick a **Severity**: Information (grey), Warning (amber) or Critical (red).
5. Set **Show from** and **Show until** if it should start or end on its own. Empty means right away and until you remove it.
6. Click **Save**.

The preview on the admin page shows the strip as users will see it.

### Languages

The text is per language. **Add a language** adds a text for another language, and **Fallback language** is the one users get when there is no text in theirs. A user whose interface is in Portuguese (`pt`) gets the `pt` text, then a text for another Portuguese variant, then the fallback language, then the first text there is.

### Closing it

With **Users can close it** on (the default), the strip has a close button. Closed stays closed for that account in that browser until you change its text or severity, which shows it again. Moving the start or end doesn't. Turn the switch off for something everyone must see.

### When users see a change

Open tabs fetch the policy again every 15 minutes and when the user comes back to the tab, so a new or changed announcement shows up without a reload. An announcement with an end time disappears at that time in open tabs, and one with a start time appears then.

Screen readers read the announcement out once per page load: critical ones interrupt, information and warnings wait for a pause. The Pro interface shows it once above all its tabs. Links open through the same link check as links in mail, if your organisation set one up.

### Per domain or group

A scope that sets an announcement replaces Everyone's as a whole: users in it see the scope's announcement instead. Click **Set an announcement for this scope** to start from a copy of Everyone's, or **Use Everyone's announcement** to go back. A scope with an empty announcement shows none, which hides Everyone's for it.

## How long Trash and Junk keep mail

Mail servers delete mail from Trash and Junk after a while. Bulwark can show one quiet line in those folders: "Messages here are deleted 30 days after they were moved here." It shares the line with **Recover deleted items** when that shows.

To turn it on:

1. Open **Admin > Organisation > Notices**.
2. Under **Trash and Junk**, set **Trash keeps mail for** and **Junk keeps mail for** to the number of days.
3. Click **Save**.

Empty shows no line.

### Enter what Stalwart does

Bulwark only shows the number. It can't read Stalwart's value: that needs admin rights, and Bulwark works with each user's own sign-in. Enter the value from Stalwart:

- Stalwart uses one setting for both folders: **Data Retention > Trash** (`expungeTrashAfter`), 30 days unless you changed it.
- It counts from when a message was moved into Trash or Junk, not from when it arrived.
- It covers the Trash and Junk folders Stalwart created. A folder a mail app created later and named Trash isn't cleaned up by Stalwart.

Give Junk a smaller number only when something else deletes it sooner, such as a filter or a clean-up job.

The line shows in every Trash and Junk folder of the user, shared and group mailboxes included, and in the Pro interface's folder tabs.

## The policy file

The announcement is `organisation.announcement`, the days are `organisation.retention`:

```json
{
  "organisation": {
    "announcement": {
      "id": "maint-1101",
      "severity": "warning",
      "text": {
        "en": "Mail maintenance tonight from 22:00. Details: https://status.example.com",
        "de": "Heute ab 22 Uhr Wartung am Mailserver. Details: https://status.example.com"
      },
      "fallbackLocale": "en",
      "startsAt": "2026-11-01T08:00:00Z",
      "endsAt": "2026-11-02T06:00:00Z",
      "dismissible": true
    },
    "retention": { "trashDays": 30, "junkDays": 30 }
  }
}
```

- `id` names the announcement. Bulwark remembers a closed announcement by its id and a hash of its text and severity, so a new id or an edit of either shows it again. The admin page makes a new id for each new announcement.
- `text` maps a language (`en`, `de`, `pt`, `zh-TW`) to plain text. `{}` shows nothing.
- `startsAt` and `endsAt` are ISO times, or `""` for no limit.
- `trashDays` and `junkDays` of 0 show no line.

## Bulwark Lite

Both work in Lite, from the `policy.json` next to `index.html`. Two things differ:

- **Anyone can read it.** policy.json is a public file, so the announcement text and every scope are readable without signing in. Don't put anything confidential in it.
- **Lite inside Stalwart** loads policy.json with the build's id in its address, and Stalwart serves bundle files as never changing. A changed announcement there needs a new bundle upload. A Lite on its own web server picks up the change at the next fetch.

## What isn't possible

- **One announcement at a time.** For a second message, edit the first.
- **Formatting.** The text is plain, with links. No bold, no images.
- **Signed out.** The announcement shows only after sign-in. The login page doesn't show it.
- **Retention from the server.** Bulwark can't read Stalwart's retention as a user, so the line says what you entered, even if the server does something else.
