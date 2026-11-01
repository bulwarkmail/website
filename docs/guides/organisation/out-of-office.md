---
title: Out-of-office
description: Reply templates users fill in, and blocking users' calendars while their out-of-office reply is on.
order: 13
edition: both
---

# Out-of-office

## Reply templates

Give users reply texts to start from, so out-of-office replies say the same things across the company: who to write to instead, when the person is back, the company name.

1. Open **Admin > Organisation > Templates**.
2. Pick **Everyone**, or a domain or group, in the **Applies to** bar.
3. Under **Out-of-office replies**, click **Add reply**, give it a name and, if you like, a category or language ("Holiday", "Parental leave", "Deutsch").
4. Write the subject and the text with placeholders. **Also an HTML version** adds a formatted one.
5. Click **Save**.

Users then get **Use a template** in **Settings > Out of office**. They pick a template, type their deputy's address if the text names one, and click **Use this text**. Bulwark fills in the placeholders, puts the result into the subject and text below, and saves it like any change on that page. Users can change the text afterwards.

### Placeholders

Placeholders use single braces, like the [organisation signature](/docs/guides/organisation/signatures), not the double braces of mail templates.

| Placeholder | Filled with |
| --- | --- |
| `{name}` | The user's name, from their identity |
| `{email}` | Their address |
| `{company}` | The company name from Branding |
| `{start}` | The first day away |
| `{end}` | The end of the absence |
| `{deputy}` | The address of a colleague, typed by the user when they pick the template |
| `{deputy_name}` | That colleague's name, typed by the user |

Dates are written in the user's language and time zone, the day alone when the time is midnight ("Monday 4 January 2027"), else with the time. A line whose placeholders are all empty is left out, so "I am back on {end}." disappears when the user sets no end.

When a template uses `{deputy}` or `{deputy_name}`, nothing changes until the user has typed the deputy. A half-filled reply is never saved.

Stalwart takes at most 511 bytes of subject and 2047 bytes of text (and of HTML). The admin page warns when a template, filled with a typical name and dates, is longer, because users couldn't save it.

For a mailbox the user manages for someone else, the template is filled with that mailbox's address.

### Per domain or group

A scope's replies add to Everyone's. **Change for this scope** on one of Everyone's replies makes a copy that replaces it for that scope only.

### The policy file

Templates are `organisation.vacationTemplates.library`:

```json
{
  "organisation": {
    "vacationTemplates": {
      "library": [
        {
          "id": "holiday",
          "name": "Holiday",
          "category": "English",
          "subject": "Out of office until {end}",
          "text": "Thank you for your message. I am away until {end}.\nFor urgent matters, please write to {deputy_name} at {deputy}.\n\n{name}\n{company}",
          "html": ""
        }
      ]
    }
  }
}
```

In Lite the templates come from the `policy.json` next to `index.html`, which anyone can read.

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

The event carries the category `bulwark-out-of-office`, which other calendar apps show. Bulwark treats the event as its own while its times are the ones Bulwark last wrote, or the reply's dates before the change at hand. The second rule covers a reply changed on another device, by a delegate, in Lite or with settings sync off. On a device that has no record yet, an event with the category found when the reply is loaded counts as Bulwark's too. If the user or another app moved or changed the event otherwise, Bulwark leaves it alone.

When the reply's dates change, the event moves with them. When the user switches the reply or the checkbox off, an event that hasn't started is removed and one that has started ends now. A reply that simply runs out leaves its past event in place. An event someone deleted stays deleted until the reply's dates change. On a device that never had a record of it (a new browser, Lite in another browser), Bulwark can't tell a deleted event from one never made, and adds it again once.

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
