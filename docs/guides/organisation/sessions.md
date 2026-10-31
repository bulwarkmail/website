---
title: Sign-out times
description: Sign users out after a time without activity, or a fixed time after they signed in.
order: 5
edition: both
---

# Sign-out times

On **Admin > Organisation > Security**, the **Sessions** section has two limits. Both are off until you set them.

- **Sign out after inactivity** signs users out after this many minutes without activity.
- **Maximum session length** signs users out this many hours after they signed in, whether they were active or not.
- **Warning before signing out** is how long a countdown shows before either limit signs users out. The default is 60 seconds.

## Set it up

1. Pick who it is for in the **Applies to** bar: Everyone, or a domain or group from [Domains and groups](/docs/guides/organisation/domains-and-groups).
2. Enter the minutes, the hours, or both. An empty field is **Off**.
3. Save. Users get the change the next time Bulwark loads.

## What users see

Activity is any click, mouse move, key press, touch or scroll wheel in any Bulwark tab of the browser, or the browser window coming back into focus. Working in one tab keeps the others signed in. Typing in the office editor or in a plugin panel isn't seen, because those run in frames Bulwark can't look into. Users working there for longer than the limit get the warning on top of the editor and can choose **Stay signed in**.

When the warning time is reached, a dialog counts down. For the inactivity limit it offers **Stay signed in**, which starts the time again. Moving the mouse doesn't close it: the user has to answer. The maximum session length can't be extended, so its dialog only says when the session ends.

At zero, Bulwark:

1. saves every open message as a draft, including a minimised one and text typed into a quick reply, and lets a message that is being sent finish (it waits up to 8 seconds for all of it),
2. signs out of every account in the browser,
3. shows the login page with the reason, for example "You were signed out after 15 minutes without activity." If a draft couldn't be saved in time, the login page says so as well.

Bulwark doesn't keep a copy of unsaved text in the browser. The limits are there for shared computers, so mail text must not stay behind on them.

A computer that slept through the limit signs out as soon as it wakes up. A tab opened or reloaded after a long pause starts from the pause, not from the page load.

## Several accounts in one browser

A user can be signed in to several accounts at once, each with its own domain and groups. Bulwark follows the strictest of them: the shortest inactivity limit any of them has, and the first maximum session length to run out. It then signs out all accounts, not only the one whose limit ran out.

To exempt a domain or group from a limit that Everyone has, set the limit to Off for that entry.

## How the maximum session length is enforced

Mail requests go from the browser straight to Stalwart, so the browser does the signing out. The Bulwark server adds a second check: it refuses to bring back a remembered sign-in, or to renew a single sign-on token, once the session is older than the limit, and clears its cookies. "Remember me" doesn't exempt anyone.

- **A maximum set on a group entry is enforced by the browser only.** The server knows a user's address, not their groups, so it applies the value of Everyone and of the user's domain entries.
- Sessions that existed before the update, and sign-ins whose recorded sign-in time is missing, count as signed in at the moment the server first enforced the limits. That moment is recorded once in the admin state directory (`ADMIN_STATE_DIR`); if the server can't write there, it counts from its own start.
- When the server can't tell which account a single sign-on token belongs to, it applies the strictest maximum of Everyone and all domain entries.
- The browser ends the session a minute before the server would refuse it, so a clock that is slightly off still shows the warning first.
- The server check needs a session secret (`SESSION_SECRET`, or the one Bulwark generates on first start). Without one, only the browser's timer applies.

## What Bulwark can't do

- **Stalwart's own token lifetimes are separate.** The lifetime of access and refresh tokens is set in Stalwart (or your identity provider), not here. Bulwark can end a session earlier than Stalwart would, never later. For a hard limit that also covers other mail apps, set the token lifetimes in Stalwart.
- Signing out after a limit doesn't end the session at your identity provider. Bulwark shows its login page instead of signing straight back in, but while the provider's own session lasts, anyone at that browser can sign in again with one click on **Sign in with SSO**.
- A password stays valid after the sign-out. Bulwark only forgets it.
- Other mail apps (Thunderbird, phone apps) aren't affected, and a browser that has been changed to skip the timer isn't stopped while its tokens are valid.

## In policy.json

The settings are stored in `organisation.session` in `policy.json`, and per entry in `scopes[].policy.organisation.session`:

```json
{
  "organisation": {
    "session": { "idleMinutes": 30, "maxHours": 12, "warnSeconds": 60 }
  },
  "scopes": [
    {
      "id": "front-desk",
      "label": "Front desk",
      "match": { "groups": ["frontdesk@example.com"] },
      "policy": { "organisation": { "session": { "idleMinutes": 5 } } }
    },
    {
      "id": "it",
      "label": "IT",
      "match": { "domains": ["it.example.com"] },
      "policy": { "organisation": { "session": { "idleMinutes": 0 } } }
    }
  ]
}
```

| Key | Default | Meaning |
| --- | --- | --- |
| `idleMinutes` | `0` | Minutes without activity before signing out. `0` is off. At most 10080 (a week). |
| `maxHours` | `0` | Hours after sign-in before signing out. `0` is off. At most 8760 (a year). |
| `warnSeconds` | `60` | Seconds the countdown shows first. `0` signs out without a warning. At most 600. |

Older versions had a user setting `sessionTimeout` that did nothing. When the top level of a `policy.json` locks or presets it to a number of minutes, Bulwark moves that number to `idleMinutes` when it loads the file, unless `idleMinutes` is already set. A `sessionTimeout` inside a domain or group entry isn't moved.

<div class="lite-callout">Bulwark Lite reads the same <code>organisation.session</code> settings from <code>policy.json</code> next to <code>index.html</code>, scopes included. The inactivity limit works the same. Lite has no server, so <strong>the maximum session length in Lite is enforced by the browser only</strong>, for domain and group entries alike: it signs users out on time, but someone with access to the browser's storage could get around it. Use Stalwart's token lifetimes when you need a hard limit.</div>
