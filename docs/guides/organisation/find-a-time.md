---
title: Find a time
description: What Suggest times needs from Stalwart, and how to share every user's free/busy with a group.
order: 12
edition: both
---

# Find a time

In the event editor, **Suggest times** next to the attendees proposes up to five slots in the next ten working days in which nobody Bulwark could check is busy. It looks at the organiser's working days and day hours from **Settings > Calendar** (8:00 to 20:00 and Monday to Friday when those aren't usable), on a 30-minute grid, in the user's time zone. The meeting keeps its length. Tentative time counts as busy.

It needs two things from Stalwart that are off on a fresh server: directory queries, and free/busy shared with the organiser.

## Directory queries

Bulwark looks attendees up by address with `Principal/query`. In Stalwart 1.0 that needs **Allow Directory Queries** under **Settings > Files & Sharing > Sharing** in the web admin (`x:Sharing.allowDirectoryQueries`, off by default).

With it off, Stalwart 1.0.1 still answers free/busy for people the user already shares an account with, but it refuses to turn any other address into a person. Those attendees are listed as "not found on this server", with "Bulwark can't look up people on this server. Your administrator can turn on directory queries in Stalwart." Stalwart 0.16 lets normal users look people up whatever the setting says.

## Free/busy has to be shared

Stalwart shows a person's busy times only from calendars shared with the person asking, with free/busy or read access, by name or through a group they are in. For everyone else it answers with no busy time at all, which looks exactly like a free day. So Bulwark never counts an attendee without any busy time as free, unless the organiser can see their calendar. It lists them under **Not checked** as "busy times unknown" and still suggests slots for the others.

Attendees outside the organisation can't be checked at all and are listed as "outside your organisation".

### Share every user's free/busy with a group

1. Open **Admin > Organisation > Calendars**.
2. Under **Free/busy sharing**, enter a group everyone is in, for example `staff@example.com`, in **Share free/busy with**.
3. Click **Save**.

When a user signs in, Bulwark shares their default calendar with that group, free/busy only: the members see when they are busy, not what their events are. It does this once per page load and account. It only adds: shares the user made stay as they are, and if the group already had a share, Bulwark only adds free/busy to it. The share is an ordinary one, so users see it in their calendar's sharing list. A user who removes it gets it back at the next sign-in. The address must be a group in Stalwart's directory (or one of the user's group accounts); a person's address is ignored, so a typo can't share everyone's free/busy with one person.

Users who never sign in to Bulwark, because they only use phone or desktop calendar apps, aren't covered. Share their calendars in Stalwart, or ask them to sign in once.

Like every Organisation setting it can differ per domain or group: pick one in the **Applies to** bar first.

### Users can share themselves

Without an admin group, users can share their own free/busy with one of their groups under **Settings > Calendar > Free/busy**. The same button shows under Suggest times when some attendees' busy times are unknown.

## The availability limit

Stalwart 1.0 allows 100 free/busy lookups per account a minute (`x:Calendar.availabilityRateLimit`). A search costs one lookup per attendee plus one for the organiser. Bulwark counts the lookups each tab made and doesn't start a search that would go over: users see "Too many lookups in the last minute. Try again in a minute." Other tabs and devices of the same user spend from the same limit. Stalwart 0.16 has no limit.

## The policy file

The group is `organisation.calendars.freeBusyGroup`, a group address; empty turns it off:

```json
{
  "organisation": {
    "calendars": { "freeBusyGroup": "staff@example.com" }
  }
}
```

## Bulwark Lite

Both work the same in Lite: the lookups and the share are plain JMAP from the browser. Put the setting in the `policy.json` next to `index.html`.

## What isn't possible

- **People outside your server:** JMAP can only ask for the free/busy of accounts on the same server.
- **Telling free from not shared:** Stalwart's answer is the same for both, so an attendee without visible busy time stays "unknown".
- **Working hours of the attendees:** only the organiser's hours count. Stalwart doesn't publish other people's working hours.

## Next step

Go on to [Out-of-office](/docs/guides/organisation/out-of-office).
