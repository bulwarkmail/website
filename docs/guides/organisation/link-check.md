---
title: Link check
description: Check links when users click them, with your company's own service or Google Safe Browsing, and always show where a link really goes.
order: 13
edition: full
---

# Link check

The **External Link Warning** plugin asks before a link opens a domain that isn't on your trusted list. From version 2.0 it can also check each link at the moment a user clicks it: with a link check service your company runs, with Google Safe Browsing, or with both. The dialog always names the domain the link really goes to, also when the link text claims another one.

## Set it up

1. Install **External Link Warning** 2.0.0 or later under **Admin > Extensions > Plugins** (from the marketplace, or upload its ZIP). It needs Bulwark 1.20.0.
2. Open it in the plugin list and turn on **Force on for everyone** under **Availability**, so every user has it and can't turn it off.
3. On the plugin's page, set **Check links before they open** to **Company link check service**, **Google Safe Browsing** or **Both**, and fill in the service address or the API key (see below).
4. Leave **When a link can't be checked** on **Let users continue (fail open)** unless your security team wants links to stay closed while the service is down.
5. Add your own domains to **Trusted domains (organisation-wide)**. Links to them open without a dialog and, with **Don't check trusted domains** on (the default), without a check.

Settings are global: the plugin can't use different settings per domain or group.

## What users see

- A link to a trusted domain opens as before.
- Any other link shows "Open external link?" with the domain and the full address. When a check answered that the link is safe, the dialog adds "Checked: no known threats." The user can continue, and is then asked whether to always trust that domain on this device.
- A link a check flags shows "This link may be dangerous" with the domain, the address and the service's reason, and **Open anyway** or **Go back**. With **When a check flags a link** set to **Block**, only **Close**.
- A Google verdict says what Google suspects, in Google's careful wording ("may be a phishing site"), with the link **Advisory provided by Google**.
- When the link text looks like an address but the link goes elsewhere, the dialog says "The link text says bank.example.com, but the link goes to login.example.net."
- When the check fails (the service is down, answers late or wrongly):
  - **Fail open** (the default): the normal dialog with "Couldn't check this link." and Continue.
  - **Fail closed**: "Link couldn't be checked" with only **Close**. The user tries again later.

Each check gets 3 seconds. Answers are kept in the browser's memory for as long as the service allows, never on disk, so Bulwark keeps no list of clicked links.

## Where links are checked

Every link Bulwark opens goes through the check: a click or middle-click in a message (reader, conversation view, Pro tabs, booking and parcel cards), the reader view, links in calendar events (description, location, meeting link), web addresses on contact cards, links in notifications, the unsubscribe page of a newsletter, and links other plugins open.

## What each service receives

| Service | Receives | Sent by |
| --- | --- | --- |
| Your company service | The full address of the link and its host name, and the token you set | Your Bulwark server |
| Google Safe Browsing | Only the first 4 bytes of the SHA-256 hashes of the link's host and path combinations (at most 30 per link), and the IP address of your Bulwark server. Never the address, never the user's IP address | Your Bulwark server |

Both requests go through Bulwark's plugin proxy: the token and the API key stay on the server, and neither the plugin nor the browser ever sees them. Bulwark's log records the plugin, the user and the service's host for each request, never the link.

## The company service

Any service that answers this contract works, for example a small wrapper around your mail gateway's URL reputation, a commercial threat feed or Google Web Risk.

```http
POST https://linkcheck.example.com/check
Content-Type: application/json
Authorization: Bearer <token>

{"url": "https://login.example.net/reset?id=42", "host": "login.example.net"}
```

The answer is HTTP 200 with:

```json
{"verdict": "unsafe", "reason": "Known phishing kit", "cacheSeconds": 600}
```

- `verdict`: `safe`, `unsafe` or `unknown` (no opinion; with **Both**, Google's answer decides).
- `reason` (optional): shown to users with an unsafe verdict.
- `cacheSeconds` (optional): how long Bulwark may reuse the answer, at most an hour.

Any other status, a body that isn't such an object, or no answer within 3 seconds counts as a failed check. The token is optional; without one Bulwark sends no `Authorization` header.

The address should use https; an https service on your own network works as it is. A service on plain http works only when you list its origin in the server's `PLUGIN_PROXY_PRIVATE_ORIGINS` environment variable, for example `PLUGIN_PROXY_PRIVATE_ORIGINS=http://linkcheck.internal:8080`.

Bulwark hands the service, Google and the dialog the address exactly as the browser reads it, and opens that same address. A link such as `http://evil.example\@bank.example/` is checked, shown and opened as evil.example.

## Google Safe Browsing

Bulwark uses the Safe Browsing API v5 `hashes:search` method in Google's no-storage real-time mode. Create a Google Cloud project, turn on the Safe Browsing API, create an API key and paste it into **Google Safe Browsing API key**.

<div class="bw-note"><b>Note.</b> Google allows the Safe Browsing API for non-commercial use only ("not for sale or revenue generating purposes"). A company should use Google Web Risk instead and put it behind the company service above. Web Risk's own hash lookup costs per call, so most wrappers use its URL lookup, which sends the full address to Google.</div>

Like every list, Safe Browsing misses some dangerous sites and can be wrong about others. Users see that in the dialog.

## No third-party traffic

With [No third-party traffic](/docs/guides/organisation/third-party-traffic) on, the plugin keeps running:

- The trusted-domain warning works as before.
- The company service still answers, because you typed its address yourself. **Admin > Organisation > Security** lists it under **Still reachable** as "Plugin External Link Warning". An address a plugin brings as its own default doesn't count: only one you typed on the plugin's admin page, and the plugin can't change it itself.
- Google Safe Browsing is off. That doesn't count as a failed check, so fail closed doesn't block every link because of it. The Security page says that `safebrowsing.googleapis.com` stays off.

## The policy file

The plugin's settings aren't in `policy.json`. They are stored with the plugin and set on its admin page. Force-enabling it is in `policy.json`:

```json
{
  "forceEnabledPlugins": ["external-link-warning"]
}
```

## Bulwark Lite

Lite has no plugins, so it has no link check.

## What isn't possible

- **Copy link address and the browser's own menu.** The browser's context menu ("Open link in new tab", "Copy link address") and dragging a link out of the window bypass the check. Bulwark only sees the links it opens itself.
- **Mail in other apps.** Links in mail read in Outlook, Thunderbird or a phone's mail app aren't checked.
- **Per domain or group.** Plugin settings are global.
- **A guarantee.** A check service only knows the dangerous sites it has seen. The check adds a warning; it doesn't replace a filtering proxy.

## Next step

Go on to [Send checks](/docs/guides/organisation/send-checks).
