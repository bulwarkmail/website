---
title: Company calendars
description: Give every user in a domain or group read-only calendars such as holidays, office closures or company events.
order: 15
edition: both
---

# Company calendars

A company calendar is an ICS feed you list once. Every user it applies to sees it in Calendar under **Organisation**, read-only. Users can hide it by clicking its name in the sidebar (on phones, in the calendar list of the toolbar). With settings sync on, the choice follows them to other devices; in Lite or with sync off it stays in that browser. They can't remove it, edit it or add events to it.

## Set it up

1. Open **Admin > Organisation > Calendars**.
2. In the **Applies to** bar, pick **Everyone**, or a domain or group to give only those users the calendar.
3. Under **Company calendars**, click **Add calendar** and enter a name, the ICS address and a colour. `webcal://` addresses are saved as `https://`.
4. Set **Refresh every** if the feed changes rarely. The shortest interval is 60 minutes.
5. Click **Save**.

Users get the calendar the next time Bulwark loads. A calendar without a name or a usable address isn't saved.

A domain or group adds its calendars to Everyone's. A calendar with the same id as one of Everyone's replaces it for that domain or group.

## How the feed gets to users

In full Bulwark, Bulwark's server fetches the feed. The browser asks for it by its id through `/api/fetch-ical`, and the server looks the id up in that user's own policy, with their domain and their groups read from their mail session on the server. So a user only gets the feeds of the scopes they are in, and the feed address never reaches the browser: the policy users get has every company calendar address emptied. An address with a token in it stays private.

The server keeps each feed for its refresh interval, so a hundred users cost one fetch. After the interval it asks the feed host again with `If-None-Match` and `If-Modified-Since`. When the feed host is down, users keep the last copy.

A feed may be on your intranet. Bulwark normally refuses to fetch from private addresses (`localhost`, `.internal`, `10.0.0.0/8` and the like). For a company calendar it makes an exception when the host you entered names the intranet itself:

- an intranet IP address: `10.x`, `172.16.x` to `172.31.x`, `192.168.x`, `100.64.x` to `100.127.x`, or an IPv6 unique local address
- a name ending in `.local`, `.internal` or `.localdomain`
- a name without dots, such as `intranet`

Only that host, on that port, gets the exception: not a redirect to another port or host. Loopback (`127.x`, `localhost`), link-local and cloud metadata addresses are never reached. A public name such as `calendar.example.com` gets no exception, also if its DNS points to a private address; give the feed an intranet name instead. The answer must be a calendar (start with `BEGIN:VCALENDAR`), or users get an error.

A feed that can't be fetched keeps showing what it had. A feed that failed and was never fetched answers with its error for a minute before Bulwark asks again. Users whose scope no longer has the feed lose its events the next time their calendar checks it.

The hosts stay reachable with [No third-party traffic](/docs/guides/organisation/third-party-traffic) on, and **Organisation > Security** lists each one under **Still reachable** as "Company calendar".

## The upload limit

Bulwark has no calendar parser of its own. It hands the feed to Stalwart (`CalendarEvent/parse`), which means one upload to Stalwart for each user who has Calendar open, each time the feed changed. Stalwart allows 1000 uploads or 50 MB an hour per user by default. A feed whose text didn't change isn't uploaded again, and the parsed events are kept in the browser per account (in IndexedDB), so a reload costs nothing. Keep feeds small and the interval long. The browser copy is deleted when everyone signs out.

## The policy file

In `policy.json` the calendars are `organisation.calendars.feeds`. Each has an `id`, a `name`, a `url`, a `color` (`#rrggbb`) and `refreshMinutes` (60 or more; less is raised to 60):

```json
{
  "organisation": {
    "calendars": {
      "feeds": [
        { "id": "holidays", "name": "Public holidays", "url": "https://calendar.example.com/holidays.ics", "color": "#16a34a", "refreshMinutes": 1440 }
      ]
    }
  },
  "scopes": [
    {
      "id": "sales",
      "label": "Sales",
      "match": { "groups": ["sales@example.com"] },
      "policy": {
        "organisation": {
          "calendars": {
            "feeds": [
              { "id": "sales-events", "name": "Sales events", "url": "https://intranet.example.com/sales.ics", "color": "#ea580c", "refreshMinutes": 120 }
            ]
          }
        }
      }
    }
  ]
}
```

Members of `sales@example.com` see both calendars; everyone else sees the holidays.

Company calendars need Bulwark's session secret (`SESSION_SECRET`, or the one it writes on first start): the server fetches a feed for the signed-in user it reads from their session. Without a secret, users get the feeds without addresses and can't load them; only the admin console sees the addresses.

## Bulwark Lite

Lite has no server, so the browser fetches the feed address itself:

- The feed host must allow it with CORS (`Access-Control-Allow-Origin` for your Lite origin). Most public calendar services don't send that header.
- `policy.json` is a public file in Lite: anyone who can load the site can read the addresses. Don't put tokens in them.
- A Lite build made with `LITE_NO_THIRD_PARTY_TRAFFIC=true` carries a page security policy that allows only the JMAP server. A feed on another host is refused there. Put the feed on the same host as Lite or the JMAP server, or make the build without that option and set your own policy in the web server.
- An intranet host works if the browser can reach it.

## What isn't possible

- **Other colours per user:** every user sees the admin's colour.
- **Free/busy:** the events live only in the browser, so they don't make anyone busy for Suggest times or other people's free/busy. That is on purpose: a holiday calendar shouldn't block everyone.
- **Answering:** attendees in a feed are dropped. A company calendar shows events, never invitations to answer.
- **Other apps:** the calendars exist only in Bulwark. Phone and desktop calendar apps that use CalDAV don't see them; subscribe to the feed there instead.

## Next step

Go on to [Find a time](/docs/guides/organisation/find-a-time).
