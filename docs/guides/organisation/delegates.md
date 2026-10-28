---
title: Delegates
description: Let users give a colleague access to their mail, calendars and contacts in one step, and limit what they can give.
order: 8
edition: both
---

# Delegates

Users find **Settings > Sharing > Delegates**. **Give access** opens one dialog where they pick a person or group, choose what to share, and choose the rights:

- **Mail**: all folders, the Inbox only, or none.
- **Calendars**: the default calendar, all calendars, or none.
- **Contacts**: the default address book, all address books, or none.
- **Rights**: read, or read and write. Read and write lets the delegate file, flag and delete mail and change events and contacts. Neither lets them rename or delete the folders themselves, share them on, or send. On Stalwart 1.0, "mark as read" and flags are one right on a folder, so read delegates can flag mail too; the dialog says so there.

Bulwark applies it to every folder, calendar and address book in one batch. If the server refuses some of them, the dialog lists those with the server's reason and offers to try them again.

**Who has access** lists everyone the user shared something with from their own account, grouped by person: folders, calendars, address books and files.

- **Change** opens the dialog with what the person has now. A type only starts at a choice when the person's grants match it exactly, for example every folder for "All folders" or exactly the default calendar. Anything else, such as a folder created since, one other folder, free/busy only or manager rights, starts at **Keep as it is**, and Save leaves that type alone. What the user changes on purpose replaces what the person had for that type. Shared files stay as they are.
- **Remove access** takes the person off everything shared from the user's own account: mail, calendars, contacts and files.

If Bulwark can't read part of the user's sharing, Change and Remove access wait, with a button to try again, so they never act on half the picture.

Calendars, contacts and files only take part while they are turned on for the user.

It works without any configuration. You only need to act if you want to hide it or limit the rights.

## Hide it or limit the rights

On **Admin > Organisation > Sharing**, the **Delegates** section has two settings. Pick **Everyone** or a domain or group in the **Applies to** bar first.

- **Delegates: Hide** removes Settings > Sharing for those users.
- **Rights users can give**: untick **write** and every share dialog in Bulwark offers read access only: Delegates, and sharing a single folder, calendar, address book or file. A grant that already gives more stays as it is and is shown, but users can't choose it again. "Set by your organisation" says why.

In `policy.json` they are the restrictions `delegation` and `sharingRights`:

```json
{
  "restrictions": {
    "sharingRights": { "allowedValues": ["read"] }
  },
  "scopes": [
    {
      "id": "interns",
      "label": "Interns",
      "match": { "groups": ["interns@example.com"] },
      "policy": { "restrictions": { "delegation": { "hidden": true } } }
    }
  ]
}
```

`allowedValues` takes `read` and `write`. An empty list limits nothing. A list with neither value allows read only.

Both settings limit what Bulwark offers. Stalwart doesn't enforce them, so a user can still share through another client.

## Directory lookups on Stalwart 1.0

To pick a person, Bulwark searches Stalwart's directory. Stalwart 1.0 turns directory queries off by default. Then the dialog lists only the user's groups and the people who already shared something with them, and for anyone else it says: "Your administrator has to turn on directory lookups in Stalwart before you can add someone new." Typing a full address doesn't help either, because Stalwart refuses to look it up.

To let users pick anyone, turn on directory queries in Stalwart's sharing settings. Stalwart 0.16 allows them, so the dialog searches everyone and takes a typed address. Note that on 0.16 users then see the users of every domain on the server.

With directory queries off, Stalwart also won't tell Bulwark the name of someone the user shared with. **Who has access** shows the name the user picked in this browser, or the person's address when they share something back; otherwise it shows "Unknown person" and Stalwart's id.

## What delegates can't do

Delegates can read and organise mail and calendars. Stalwart doesn't let them send as the user or on the user's behalf, and the dialog says so. For an address several people answer from, such as info@ or support@, set up a shared mailbox (a Stalwart group) instead.

Delegates only covers what the user shares from their own account. Who can use a group's shared mailbox is set by the admin in Stalwart, not here.

Delegation shares the folders, calendars and address books that exist now. A folder the user creates later isn't shared until they give access again or share it from the folder's menu.

## Bulwark Lite

Delegates works the same in Lite, since it only talks to Stalwart. Put the restrictions in the `policy.json` next to `index.html`. Bulwark keeps the names of the people who have access in the browser, per account, and deletes them when the account is removed or everyone signs out.
