---
title: Out-of-office
description: Block users' calendars while their out-of-office reply is on.
order: 13
edition: both
---

# Out-of-office

## Block the calendar

When a user sets an out-of-office reply with a start and an end in **Settings > Out of office**, a **Block my calendar** checkbox shows under the dates. It is on by default. While the reply is on, Bulwark keeps one busy event for that time in the user's calendar, so colleagues see them as busy and Suggest times leaves the time out.

### Lock it

By default users choose. To decide for them:

1. Open **Admin > Organisation > Calendars**.
2. Pick **Everyone**, or a domain or group, in the **Applies to** bar.
3. Under **Out-of-office**, set **Out-of-office blocks the calendar** to **Always block the calendar** or **Never block the calendar**.
4. Click **Save**.

Users then see the checkbox set as you chose, with **Set by your organisation**.

### The event

- It goes into the account's default calendar, found again by a fixed UID, `bulwark-ooo-<account id>`.
- It is busy, visible to everyone who sees the calendar, has no attendees and never sends invitations.
- Its title is the reply's subject, or "Out of office".
- It is timed, or all-day when both the start and the end are midnight in the user's time zone.

Bulwark remembers the times it wrote. If the user or another app moved or changed the event, Bulwark leaves it alone from then on.

When the reply's dates change, the event moves with them. When the user switches the reply or the checkbox off, an event that hasn't started is removed and one that has started ends now. A reply that simply runs out leaves its past event in place. An event someone deleted stays deleted until the reply's dates change.

For a mailbox the user manages for someone else, the event goes into that account's calendar. The user needs write access to it; without it the checkbox says the calendar can't be blocked.

Bulwark updates the event when the switch, the dates or the subject change, whether the change came from the settings page or a plugin, and once each time Bulwark loads and reads the reply. A reply changed in another app is caught up on the next time the user opens Bulwark.

### Replies set in other apps

Stalwart keeps the out-of-office reply as a Sieve script named `vacation`, and Bulwark reads it through JMAP (`VacationResponse`). Other JMAP apps use the same, and Bulwark follows them. An app that writes its own Sieve script with a vacation action is invisible to Bulwark, so no event is made for it.

Stalwart runs one Sieve script at a time. Turning the reply on switches the user's filter script off, unless Bulwark can keep it running next to the reply. Bulwark does that for filter scripts it can read. For a script it can't read (edited by hand, or on a server without the Sieve `include` extension), the reply switch shows: "Turning this on switches off your own filter script while the reply is active."

### The policy file

The lock is the restriction `vacationBlockCalendar`, with the value users get:

```json
{
  "restrictions": {
    "vacationBlockCalendar": { "locked": true, "value": true }
  },
  "scopes": [
    {
      "id": "contractors",
      "label": "Contractors",
      "match": { "groups": ["contractors@example.com"] },
      "policy": { "restrictions": { "vacationBlockCalendar": { "locked": true, "value": false } } }
    }
  ]
}
```

Leave it out to let users choose.

### Bulwark Lite

It works the same in Lite: the reply and the event are plain JMAP. Put the restriction in the `policy.json` next to `index.html`.

### What isn't possible

- **An "out of office" status:** an event can't be marked as out of office in Stalwart's free/busy, so it shows as busy.
- **Without Bulwark:** the event is made by Bulwark in the browser. A reply set only in another app, and never seen in Bulwark, gets no event.
