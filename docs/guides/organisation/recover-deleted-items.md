---
title: Recover deleted items
description: Let users bring back mail they deleted for good, from Stalwart's archive of deleted items.
order: 9
edition: both
---

# Recover deleted items

When a user empties Trash, or Trash is cleaned up after its retention time, the mail is gone for good. Stalwart Enterprise can keep it for a while longer in an archive. Bulwark lets users browse that archive and put messages back, so they don't have to ask you to restore a backup.

Users get **Settings > Recover deleted items**. The page lists the messages they deleted for good, newest first, with the sender, the subject, the message's date and when it was deleted. They tick the ones they want and click **Restore**. A large archive is read 2000 items at a time, with **Show older** for the rest.

<img class="theme-light-only" src="/screenshots/light-recover-deleted.webp" alt="Settings, Recover deleted items: messages deleted for good, listed with sender, subject and deletion date, one of them just restored" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-recover-deleted.webp" alt="Settings, Recover deleted items: messages deleted for good, listed with sender, subject and deletion date, one of them just restored" width="5120" height="2880" />

Stalwart puts each restored message back in the Inbox, unread, sorted by its original date, so it may land far down the list. It restores in the background, so a message can take a moment to show up.

When the archive holds at least one message inside the days limit, the user's Trash folder also shows a line that leads to the page.

## What Stalwart needs

Two things, both in Stalwart, not in Bulwark:

1. **An Enterprise license.** The archive is a Stalwart Enterprise feature. Without a license Stalwart refuses every request for it.
2. **Archiving turned on.** In Stalwart's admin, under **Data Retention > Archiving**, set **Archived Items** (`archiveDeletedItemsFor`) to how long deleted mail should be kept, for example 30 days. It is off by default, and then nothing is archived.

Mail deleted before archiving was on can't be recovered.

Bulwark asks Stalwart once per account whether the archive is available, after the user's policy has loaded. If Stalwart says no, because there is no license or the server isn't Stalwart, users see nothing: no Settings entry and no line in Trash. Bulwark asks again after half an hour, so a license you install later shows up without users signing out. If an error says nothing about the server (a network problem), it asks again after two minutes. The answer is forgotten when everyone signs out.

With a license but archiving off, Stalwart answers with an empty archive. Users then see the Settings page, which says that deleted mail only shows up there if the administrator turned on archiving in Stalwart, and no line in Trash.

Users don't need any extra rights. Stalwart's default roles let users and groups read and restore their own archived items.

## Limit how far back users see

By default the page lists everything Stalwart still keeps. To show less, open **Admin > Organisation > Sharing**, pick **Everyone** or a domain or group in the **Applies to** bar, and set **Show deleted mail of the last** to a number of days. Leave it empty for everything.

This only filters the list. How long mail is kept is Stalwart's `archiveDeletedItemsFor`; Bulwark can't make it longer.

## Hide it

In the same section, **Recover deleted items: Hide** removes the Settings page and the Trash line for those users, and Bulwark doesn't ask Stalwart at all. Use it per domain or group, for example to keep the feature for one customer on a shared instance.

Hiding it in Bulwark doesn't stop the archive in Stalwart. A user can still restore through Stalwart's own web interface or the JMAP API.

## The policy file

In `policy.json` the days are `organisation.recovery.days` (0 is everything the server keeps) and hiding is the restriction `deletedItemsRecovery`:

```json
{
  "organisation": {
    "recovery": { "days": 30 }
  },
  "scopes": [
    {
      "id": "students",
      "label": "Students",
      "match": { "domains": ["students.example.edu"] },
      "policy": { "restrictions": { "deletedItemsRecovery": { "hidden": true } } }
    }
  ]
}
```

To turn it off for everyone, put `"deletedItemsRecovery": { "hidden": true }` in the top-level `restrictions`. In full Bulwark the instance switch `STALWART_FEATURES=false` turns it off as well.

## What isn't possible

- **Only mail.** Stalwart also archives files, events, contacts and Sieve scripts, but it can only restore mail. Bulwark lists mail only.
- **Back to the Inbox, not the old folder.** Stalwart doesn't record which folder a message was in, so every restored message lands in the Inbox. Its flags and tags aren't kept either.
- **Your own account only.** The page shows the archive of the account the user signed in to. A shared mailbox or a group has its own archive, which Bulwark doesn't show.
- **A restore leaves the archive at once.** Stalwart takes the message off the list when it accepts the restore and puts it back in the background. It retries temporary errors. If it can't restore the message for good, for example because the mailbox is full, the message is lost, and Bulwark can't tell.
- **Already gone.** If a message was restored from another browser, or Stalwart stopped keeping it, Restore takes it off the list and says it was no longer in the archive.
- **Admins see only their own mail.** An account with Stalwart's impersonation right could get the archive of every account. Bulwark asks for the signed-in account only and drops any other account's items.

## Bulwark Lite

It works the same in Lite, since Bulwark only talks to Stalwart for it. Put the settings in the `policy.json` next to `index.html`.
