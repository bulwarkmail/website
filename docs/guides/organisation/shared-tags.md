---
title: Shared tags
description: Give the members of a group mailbox the same tag names and colors, and decide who may change them.
order: 7
edition: both
---

# Shared tags

In a group mailbox every member sees the same tags on a message: Stalwart keeps one set of keywords per message for the whole group. With shared tags they also see the same names and colors. Someone tags a message "Urgent" in red, and everyone in the group sees "Urgent" in red.

Shared tags need Stalwart v1.0.0 or later. There is no fallback for older servers. Nothing to set up: every Stalwart group with a mailbox gets them.

## What users see

- **Settings > Folders & tags > Shared tags** lists each group mailbox the user is a member of, with its tags. Members add, rename, recolor and delete them there.
- In the sidebar, the group's tags are listed under its folders in **Shared**, each with the number of messages in that group mailbox that carry it (Trash and Spam not counted). Clicking one lists the group mailbox's messages with that tag, and only those. The user's own tags further down keep listing their tagged mail across all mailboxes, as before.
- When users tag a message in a group mailbox, the tag list shows the group's tags, marked "Shared with everyone in this mailbox". Their own tags stay in their own mailbox. When several messages from the same group mailbox are selected, the list shows that group's tags too.
- Tags that are on the group's messages but have no shared name yet (set by another mail client, or before shared tags existed) are listed too, under a name made from the keyword. Members can give them a proper name in Settings. A tag that is on a message is always shown.
- In the unified inbox each message shows the tags of its own mailbox.

When a member changes a tag, the others see the change within a few seconds through Stalwart's push, or when they come back to the tab or reload.

Each change is saved for that one tag, so two members editing different tags at the same time both keep their change. Deleting a shared tag removes its name and color for everyone; Bulwark asks first. The tag stays on its messages and shows up again as a tag without a name.

If the server doesn't take a change, Bulwark says so, keeps the change and sends it again when the server answers.

## Who may change them

Members change shared tags when Stalwart lets them change the metadata of the group's Inbox. That is the case for every member of a Stalwart group unless you restricted the group's rights. A member without that right sees the tags and can use them, but can't change them.

To keep the list fixed, lock **Shared tags** on **Admin > Organisation > Sharing**. Users can still tag messages with the shared tags, but can't add, rename or delete them, and see **Set by your organisation** in Settings. For example, lock it for Everyone and leave it unlocked for a "Team leads" group entry, so only the leads look after the list. See [domains and groups](/docs/guides/organisation/domains-and-groups) for entries.

Bulwark only shows shared tags for accounts that Stalwart reports as groups. A mailbox another person shared keeps the user's own tags.

## In policy.json

The lock is a restriction:

```json
{
  "restrictions": {
    "sharedTags": { "locked": true }
  },
  "scopes": [
    {
      "id": "leads",
      "label": "Team leads",
      "match": { "groups": ["leads@example.com"] },
      "policy": {
        "restrictions": { "sharedTags": {} }
      }
    }
  ]
}
```

An empty restriction in an entry unlocks what Everyone locks.

The tags themselves aren't in `policy.json`. They live with the group's Inbox on the mail server, in the metadata entry `org.bulwarkmail.tags`, as a map by tag id:

```json
{ "tags": { "urgent": { "label": "Urgent", "color": "red" } } }
```

Every member's Bulwark reads the same entry. Other fields in it are kept when Bulwark changes a tag.

## Bulwark Lite

Lite shows and edits shared tags like full Bulwark, on Stalwart v1.0.0 or later. The lock comes from the `policy.json` next to `index.html`.

## What isn't possible

- **Servers older than Stalwart v1.0.0.** Stalwart 0.16 keeps no metadata, so there are no shared tags and no editor; Settings says that the server can't keep them. Group mailboxes show each user's own tag names, and the tags on the messages still show.
- **About 100 tags per group.** Stalwart keeps at most 8 KB in one metadata entry. Bulwark says so when a new tag doesn't fit.
- **Mailboxes a person shared.** Only group mailboxes get shared tags.
- **Other mail clients** see the keywords (such as `$label:urgent`) but not the shared names and colors.
