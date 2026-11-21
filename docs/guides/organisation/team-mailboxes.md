---
title: Team mailboxes
description: Let the members of a shared mailbox write notes beside its messages, mention each other, assign messages and mark them done.
order: 9
edition: both
---

# Team mailboxes

People who share a mailbox, such as `info@` or `support@`, can talk about a message right next to it: "my job", "passed this to Josh", "waiting for feedback from Mabel". They assign a message to a member, mark it done and mention a colleague with @. Nobody outside the team sees any of it, and nothing goes to the customer.

A team mailbox is a Stalwart group with its own mailbox. Members see it in Bulwark's sidebar as a shared mailbox. A folder one person shared with another isn't a team mailbox.

## Turn it on

1. In **Admin > Organisation > Team mailboxes**, turn on **Notes and assignment in team mailboxes**.
2. Click **Save**. Users get it within 15 minutes.

That is all. There is nothing to set up in Stalwart, no folder to create and nothing for users to set up.

<img class="theme-light-only" src="/screenshots/light-admin-team-mailboxes.webp" alt="Admin, Organisation, Team mailboxes with the Support team scope picked and Notes and assignment in team mailboxes turned on" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-team-mailboxes.webp" alt="Admin, Organisation, Team mailboxes with the Support team scope picked and Notes and assignment in team mailboxes turned on" width="5120" height="2880" />

To turn it on for one team only, pick that group in the scope bar at the top of the page first. A group scope applies to that group's mailbox only: someone who is in two groups gets the feature in the group it is on for, not in the other. A domain scope applies to every team mailbox of the people in that domain.

In `policy.json`:

```json
{
  "organisation": { "teamMailboxes": { "enabled": true } }
}
```

or for one group:

```json
{
  "scopes": [
    { "id": "support", "label": "Support", "match": { "groups": ["support@example.com"] },
      "policy": { "organisation": { "teamMailboxes": { "enabled": true } } } }
  ]
}
```

## What users get

In the folders of a team mailbox:

- A note line above the reply box, always open, and **Note** next to Reply, Reply all and Forward (in the reader's toolbar and More menu, and on phones in the bar at the bottom), which puts the cursor in it. Enter saves the note, Shift+Enter starts a new line, Escape leaves the line and keeps the text.
- Notes appear between the messages of the conversation, in time order, as yellow cards with the writer's name and picture. "Only your team sees this" stands above the first one. Above the message a line says how many notes there are and shows the newest.
- Under the subject: who has the message (several people can), each with an × to take them off, plus **Assign** and **Done**. **Assign to me**, **Assign to…**, **Unassign me**, **Unassign**, **Mark done** and **Reopen** are in the message's menus, each only where it applies. Every change leaves a grey line in the conversation, such as "Linus assigned this to Josh".
- On list rows: the number of notes, a dot when there is a note the user hasn't seen, who the message is assigned to, and a **Done** mark.
- Filters above the list: **Open**, **Assigned to me**, **Mentions me** and **With notes**.
- Typing @ in a note offers the team's members, then the directory where you allow directory lookups. The person mentioned is added to the message's assignees and gets a notification in Bulwark and, where push notifications are set up, on their phone or computer. Nobody else is notified about a note.

<img class="theme-light-only" src="/screenshots/light-team-mailbox-notes.webp" alt="A message in the Support mailbox: under the subject who has it, Assign and Done; under the message the team's notes, a grey line saying Bob assigned it to Nora and yellow note cards from Bob and Alice; at the bottom the note line above the reply box. The list shows who has each message, note counts, a Done mark and the Open, Assigned to me, Mentions me and With notes filters" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-team-mailbox-notes.webp" alt="A message in the Support mailbox: under the subject who has it, Assign and Done; under the message the team's notes, a grey line saying Bob assigned it to Nora and yellow note cards from Bob and Alice; at the bottom the note line above the reply box. The list shows who has each message, note counts, a Done mark and the Open, Assigned to me, Mentions me and With notes filters" width="5120" height="2880" />

See [Team mailboxes](/docs/features/team-mailboxes) for the user's side.

Users can delete their own notes (with Undo) and write a new one. Notes can't be edited, and nobody can delete someone else's note in Bulwark.

## Who can be picked

Stalwart doesn't tell members who else is in a group, so **Assign to…** and the @ list offer the people Bulwark knows are in the team: everyone who has opened the team mailbox, written a note there or been assigned something, plus the server's directory where you allow directory lookups. A new member shows up for the others once they have opened the team mailbox.

On Stalwart 1.0 that list is kept in the group Inbox's shared settings. Stalwart 0.16 has no shared settings, so there each member leaves a small "Team member" entry in the **Team notes** folder the first time they open the team mailbox.

## How notes are stored

Each note is a small plain-text message in a folder called **Team notes** in the group's mailbox. Bulwark creates the folder when the first note is written and gives it the same sharing as the Inbox, so whoever can read the team mailbox can read its notes. Bulwark never lists the folder: it isn't in the sidebar, in search, in counts or in any folder picker. Mailbox export includes it, because it is part of the mailbox.

Assignment is kept on the message itself, as the keywords `$assigned:<member id>` (one per person) and `$done`, the same as the Team inbox plugin used, so nothing is lost when you switch from the plugin. The plugin kept one person per message; Bulwark keeps any number. Messages with notes also carry `$bulwark-notes`, and `$bulwark-mention-<member id>` for each person mentioned, for the filters.

Good to know:

- **Other mail apps** (Thunderbird, Outlook, phones) show **Team notes** as an ordinary folder under the group's shared folders, with each note as a message from its writer. Bulwark creates it unsubscribed, so mail apps that show only subscribed folders, such as Thunderbird by default, keep it out of sight.
- **Anyone who can write to the team mailbox through IMAP can forge or delete notes there.** Stalwart doesn't check who a note is from. Team notes are for working together, not an audit log.
- **Notes count against the group mailbox's quota**, about 1 KB each. When the mailbox is full, Bulwark says so and keeps the note in the field.
- A folder that someone created by hand with the exact name **Team notes** at the top of a shared mailbox is hidden in Bulwark too.
- If you share the team mailbox's Inbox with someone later, open the team mailbox once as a member: Bulwark brings the notes folder's sharing in line with the Inbox.

## Read-only members

Someone the team mailbox is shared with read-only sees the notes and the assignment, but no note line, no Note button and no assignment buttons. Under the notes a line says "You can read notes here but not write them." They see new notes within 20 seconds; members see them within seconds.

## Push notifications for mentions

Mentions reach phones and computers through the push set-up Bulwark already has. With **Push without sender and subject** on under [Devices](/docs/guides/organisation/device-policies), the notification says only "You were mentioned in a team mailbox".

- **Stalwart 0.16:** every note wakes each member's device for a moment. Bulwark checks whether that member was mentioned: the mentioned person gets the notification, everyone else gets nothing to see or hear.
- **Stalwart 1.0:** Stalwart sends no push for a note, so a mention reaches people while Bulwark (in the browser or the desktop app) is open, as a notification in the app. It isn't sent to phones while Bulwark is closed.

## Moving from the Team inbox plugin

Bulwark's team mailboxes replace the [Team inbox plugin](/docs/guides/organisation/team-inbox). Assignments made with the plugin stay, and its names list is read too.

Once the switch is on for one of a user's team mailboxes, the plugin steps back for that user in all of them: Bulwark hides its buttons, chips and filters, and the plugin's last version stops on its own. So turn the switch on for every team that used the plugin at the same time, then remove the plugin.

## Bulwark Lite

Lite has notes, assignment, mentions in the open app and the filters. It has no push notifications, so mentions show only while Lite is open. Lite reads the switch from the same `policy.json`.

## What isn't possible

- Notes on mail in a user's own mailbox, or in a folder one person shared with another.
- Editing a note. Delete it and write a new one.
- Notes in the native mobile app. It shows the **Team notes** folder like other mail apps would.
- Pro folder tabs show the notes, chips and marks but have no filter chips; the filters are in the normal list.

## Next step

Back to [Organisation settings](/docs/guides/organisation) for the other settings.
