---
title: Team inbox
description: Let teams assign messages in a shared mailbox to a member and mark them done, with the Team inbox plugin.
order: 10
edition: full
editionNote: "The team inbox is a plugin, and plugins run in Bulwark (not Lite)."
---

# Team inbox

The official **Team inbox** plugin lets the members of a shared mailbox (a Stalwart group with its own mailbox, such as `support@example.com`) assign a message to one of them and mark it done. Everyone in the team sees the same state.

## Set it up

Team inbox is coming to the extension directory; it isn't listed there yet. Until then you install it from its ZIP:

1. Download `team-inbox.zip` from the [plugins repository](https://github.com/bulwarkmail/plugins/tree/main/team-inbox).
2. In **Admin > Extensions > Plugins**, make sure **Plugins** is on under **Plugin policy**. Plugins are off until an admin turns them on.
3. Click **Upload plugin** and pick the ZIP.
4. Open **Team inbox** in the plugin list and turn on **Force on for everyone** under **Availability**, so every user gets it without being asked and can't turn it off. The plugin has no settings.

It needs Bulwark 1.19 or later and works with Stalwart 0.16 and 1.0.

## What users get

In the folders of a shared mailbox:

- **Assign to me**, **Assign to…**, **Unassign**, **Mark done** and **Reopen** in a message's right-click menu, its hover buttons and the reader toolbar. On phones they are in the row menu and the reader's **More** menu. Each appears only where it applies: Reopen on done messages, Unassign on assigned ones.
- On each row, a chip with the assignee's name and a **Done** mark.
- **Assigned to me** and **Open** chips in the list header. Tap one to filter the list, tap it again to remove the filter. Both can be on at once.

<img class="theme-light-only" src="/screenshots/light-team-inbox.webp" alt="The Support mailbox with the team inbox plugin: rows with the assignee's name and Done marks, and the Assigned to me and Open filters" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-team-inbox.webp" alt="The Support mailbox with the team inbox plugin: rows with the assignee's name and Done marks, and the Assigned to me and Open filters" width="5120" height="2880" />

Nothing changes in a user's own mailbox, or in a mailbox another person shared with them.

Members answer from the team's address as in any [shared mailbox](/docs/features/email#shared-mailboxes).

<img class="theme-light-only" src="/screenshots/light-shared-mailbox-reply.webp" alt="The composer replying to a message in the Support mailbox, sending from support@ in the From field" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-shared-mailbox-reply.webp" alt="The composer replying to a message in the Support mailbox, sending from support@ in the From field" width="5120" height="2880" />

## How it is stored

On the message itself, as keywords, so it works in every Bulwark, on every device, and IMAP clients show it as flags:

| Keyword | Meaning |
| --- | --- |
| `$assigned:<principal id>` | Assigned to that member, one at a time. The id is the member's Stalwart account id. |
| `$done` | Dealt with. |

In a shared mailbox, Stalwart keeps one read state for everyone: when one member opens a message, it is read for the whole team. That is why **Open** means "not marked done", never "unread".

## Names

The keywords carry ids, not names. The plugin finds names in three places:

- Each user's own name comes from their session.
- With directory lookups allowed in Stalwart, the plugin names the assignees on rows from the directory, and **Assign to…** searches it and can assign any typed address. This uses the plugin's `directory:read` permission. Stalwart 1.0 has directory lookups off by default; 0.16 has them on.
- On Stalwart 1.0 and later, the plugin keeps a short list of names in the shared mailbox (the Inbox's metadata, entry `org.bulwarkmail.plugin.team-inbox`, under 3.5 KB; the oldest names go first). Every member who uses the plugin adds themselves, and whoever assigns a message adds the assignee.

Without a directory and on Stalwart 0.16, other members show as **Assigned** until their name is known, and **Assign to…** offers the user, and members messages were assigned to lately. To make a colleague assignable there, they assign one message to themselves once.

## What isn't possible

- **No notification to the assignee.** Plugins can't send push notifications or mail on their own. Members see their work with the **Assigned to me** filter.
- **Shared mailboxes only.** A folder one person shared with another doesn't count. A Stalwart group without a mailbox isn't visible to Bulwark.
- **No admin settings and no policy keys.** Install and enable it as above. To take it away from everyone, disable or remove the plugin.
- **Bulwark Lite** has no plugins, so there is no assignment there. Keywords set elsewhere stay on the messages.
