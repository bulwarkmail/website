---
title: Link and send checks
description: What the dialogs mean when your organisation checks links before they open and messages before they go out.
order: 5
edition: full
---

# Link and send checks

Your organisation can have Bulwark check links before they open and messages before they are sent. You see these checks only when your administrator turned them on. They come from the plugins described for admins in [Link check](/docs/guides/organisation/link-check) and [Send checks](/docs/guides/organisation/send-checks).

## When you open a link

Links to your organisation's own domains open as usual. Any other link shows **Open external link?** with the domain the link really goes to and its full address. Look at the domain: that is where you end up, whatever the link text says.

- **"Checked: no known threats."** Your organisation's check service knows nothing bad about the address. It can still be a site you don't want to visit.
- **"The link text says bank.example.com, but the link goes to …"** The text you clicked names another site than the one it opens. That is a common phishing trick.
- **"This link may be dangerous"** The check service flagged it, often with a reason. Choose **Go back** unless you are sure. Your organisation may not offer **Open anyway** at all; then you see **Link blocked** with only **Close**.
- **"Couldn't check this link."** The check service didn't answer. You may continue, or, if your organisation chose so, the link can't be opened until the check works again ("Link couldn't be checked"). Try again in a moment.
- **Suspected dangerous site** with **Advisory provided by Google**: Google Safe Browsing suspects the site. These warnings aren't always right.

After **Continue** you can choose to always trust that domain on this device.

The check covers links in mail, in the reader view, in calendar events, on contact cards, in notifications, the unsubscribe link of newsletters, and middle-clicks. It doesn't cover the browser's own menu ("Open link in new tab", "Copy link address").

## When you send

Bulwark looks at what you wrote (not the quoted message you reply to), the subject and your attachments.

- **"Check before sending"** lists what it found, for example "IBAN DE89 … 3000" or "Card number ending 4242". Numbers are shown masked. Choose **Send anyway** if it is meant to go out, or **Go back** to change the message.
- **"This message can't be sent"** Your organisation doesn't allow what it lists. Remove it and send again.
- **"This file can't be attached"** Your organisation doesn't allow that kind of file, or it is too large. Renaming a program doesn't get it past the check.
- **"This message couldn't be checked"** The check couldn't finish. Try again in a moment; if it keeps happening, tell your administrator.
- A message that some checks only count because it goes outside your organisation says so.

## When a check isn't running

If a check your organisation requires hasn't started yet, Bulwark waits a few seconds when you press Send and then shows "Not sent. A check your organisation requires isn't running. Try again in a moment." If it has stopped working, the message says to reload the page, or to tell your administrator if that doesn't help. Your message stays in the composer either way.

Mail you send from other mail apps (Outlook, Thunderbird, your phone) isn't checked by Bulwark. Bulwark Lite has no plugins, so it shows none of these checks.
