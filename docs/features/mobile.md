---
title: Mobile apps and push
description: The Bulwark Mobile beta for Android and iOS, linking it to the webmail, and push through the relay or UnifiedPush.
order: 6
---

# Mobile apps and push

On a phone you have two choices. **Bulwark Mobile** is a separate app for Android and iOS, still a beta. The **webmail** itself runs in the phone's browser and can be installed to the home screen as a web app. Both get new-mail notifications through the same push relay, described further down.

## Bulwark Mobile

<div class="bw-note bw-note-warning"><b>Beta.</b> Bulwark Mobile 0.1.86 is a pre-1.0 beta. Its own README says to expect bugs, missing features and breaking changes between releases, and not to rely on it for your primary email yet.</div>

Where to get it:

- **Android**: the APK on [GitHub releases](https://github.com/bulwarkmail/native/releases), with a `.sha256` file next to it. It is built for 64-bit ARM phones (arm64-v8a) only, so it doesn't run on 32-bit phones or x86 emulators. The app updates itself from GitHub releases.
- **Google Play**: the app is in a closed test there. There is no public store listing yet.
- **iPhone and iPad**: the public beta on [TestFlight](https://testflight.apple.com/join/rumcjNSp). It isn't in the App Store.

The source is at [github.com/bulwarkmail/native](https://github.com/bulwarkmail/native).

The app signs in to any JMAP server, such as Stalwart, and handles several accounts with a unified inbox. It does mail with threads and composing, calendar, contacts and files, and server-side filters, out of office, templates and identities. On Android it also syncs contacts and calendars both ways with the phone's own apps (Settings → Contacts or Calendar → Sync to this device) and has home-screen widgets.

What it doesn't do yet:

- S/MIME, plugins and themes are only stubs in the interface, and there is no PGP.
- Calendar editing is partial and contacts editing is basic.
- There is no offline mode beyond queueing actions until the connection is back.
- On iPhone and iPad, client certificates and syncing with the phone's contacts and calendars are missing; they are Android only so far.

## Link the app from the webmail

Instead of typing a password on the phone, you can sign the app in from the webmail with a QR code. In the webmail, open **Settings > Security**. Under **Other apps and devices**, **Link the mobile app** has a **Show QR code** button. Bulwark asks for your password first, and your two-factor code if you use one. Where single sign-on is set up, **Use single sign-on instead** confirms it through the identity provider. In the app, tap **Scan a sign-in code** on the sign-in screen, or **Add account** → **Scan a sign-in code** if you're already signed in, and point the camera at the code. Without a camera, **Copy sign-in link** and paste it in the app with **Paste sign-in link**.


The code works once and expires after a short time; **Show a new code** makes another. The phone gets its own sign-in, so signing out in the browser doesn't sign the phone out.

What it needs:

- Bulwark (not Lite). Bulwark Lite has no server to pair through.
- A session secret. Bulwark generates one on first start if `SESSION_SECRET` isn't set; without one the page says linking isn't set up.
- The **Security** page, which shows while the Stalwart features are on (the default).
- On Stalwart 1.0, the app signs in through the `bulwark-mobile` client that [Auto-configure OAuth](/docs/guides/admin#oauth-auto-setup) registers.
- With several Bulwark replicas, sticky sessions: a pending code lives in the memory of the replica that made it.

## Push notifications

A phone can't keep a connection to the mail server open all day without draining the battery, so the platform push services wake it instead: Firebase Cloud Messaging on Android, Apple's push service on iOS, Web Push in browsers, or UnifiedPush on Android without Google services. Talking to those services needs keys that a self-hoster doesn't have, so Bulwark uses a relay in between.

It works like this:

1. The app or the browser registers a JMAP push subscription on Stalwart that points at the relay.
2. When mail arrives, Stalwart posts the change to the relay.
3. The relay forwards a wake-up through the platform's push service.
4. The device fetches the new mail from Stalwart itself.

The relay holds a push address for each device (an FCM token, a Web Push subscription or a UnifiedPush endpoint), an optional label to tell accounts apart, a one-time verification code while a subscription is set up, and timestamps. What passes through is the account id and either the changed data types with their state strings or the ids of new messages. Subjects, senders, bodies and attachments never reach it. Subscriptions without traffic for 90 days are deleted. The [privacy policy](/docs/legal/privacy) has the details.

### The hosted relay

By default the webmail and the app use the relay the project runs at `https://notifications.relay.bulwarkmail.org`. There is nothing to set up. Push to the iOS app goes through this relay's Apple push connection.

Turning on [No third-party traffic](/docs/guides/organisation/third-party-traffic) drops the hosted relay. Push then only works through a relay you added yourself.

### What Stalwart has to reach

Stalwart posts to the relay, so it needs outbound HTTPS to the relay's public name. For push you don't open any port on your side: nothing connects in to Stalwart or Bulwark.

Stalwart checks the relay's address:

- It must be `https`, without a user name or password in the URL.
- Stalwart 0.16 refuses local and reserved IP addresses written in the URL.
- Stalwart 1.0 also refuses names without a public suffix, such as `.lan`, `.local` or `home.arpa`, and doesn't deliver to a name that resolves to a private address.

So a relay on your LAN at a private address doesn't work. That matters only for a relay you run; the hosted one is public.

Fetching the mail is a different connection: the phone talks to Stalwart's JMAP directly. To read mail away from home, the phone has to reach Stalwart over HTTPS, or through a VPN.

On Stalwart 0.16.16 and newer, mail filed as spam doesn't trigger a notification.

### A relay you run

The relay's source is at [github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay). It is pre-1.0 (0.1.0) and has no releases or published image, so you build it from source, for example with its Dockerfile. It needs your own keys:

```env
# Web Push (browsers and the installed web app)
VAPID_PUBLIC_KEY=...    # generate with: npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:postmaster@example.com
# Firebase Cloud Messaging (Android app)
FCM_SERVICE_ACCOUNT_JSON=/data/fcm-service-account.json
```

<div class="bw-note"><b>Note.</b> The published app is tied to the project's Firebase project and to the hosted relay's Apple push connection. A relay you run can't push to the published app through Google or Apple. From your own relay, Android phones get push through UnifiedPush only, and iPhones not at all. Web push in the browser works with your own VAPID keys.</div>

To offer your relay in the webmail, add it in the admin console under **User policy > Push relays**, and make it the default or lock users to it; no rebuild is needed. Users pick a relay under **Settings > Notifications > Push relay**. In the app, set the relay in its notification settings. `NEXT_PUBLIC_PUSH_RELAY_URL` changes the built-in entry, but only at build time.

### UnifiedPush on Android

For phones without Google Play services, the Android app can push through UnifiedPush. Install a distributor app such as [ntfy](https://ntfy.sh), then pick it as the UnifiedPush distributor in the app's notification settings. It works with the hosted relay and with a relay you run. UnifiedPush is Android only and as much a beta as the app.

## In the browser

Bulwark (not Lite) can show a system notification with the sender and subject of new mail while the tab is closed. Turn it on under **Settings > Notifications > Background notifications** with **Enable**, and choose the **Push relay** there if your admin offers more than one. Mailboxes others share with you don't send these notifications. Calendar reminders show inside the app only.

<img class="theme-light-only" src="/screenshots/light-settings-notifications.webp" alt="Settings, Notifications: background notifications turned on for this device, with the push relay to use" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-settings-notifications.webp" alt="Settings, Notifications: background notifications turned on for this device, with the push relay to use" width="5120" height="2880" />

Web push needs:

- HTTPS. Browsers only allow it on secure pages (`http://localhost` excepted).
- On iPhone and iPad, the webmail installed to the home screen first (Share → Add to Home Screen). Safari only delivers web push to installed web apps.
- Bulwark (not Lite). Lite registers no service worker, so it gets no web push and no unread badge.

Installed to the home screen, the webmail opens without browser chrome and shows the unread count on its icon where the browser supports it. It doesn't work offline: the service worker caches nothing, so every page and all mail come from the server. On a phone the mail list has a search-first header, and swiping a row left or right runs a quick action (archive, delete, read, star or spam, set per direction).

[Progressive Web App](/docs/features/pwa) covers the install, the branding of the installed app and the reverse-proxy paths push needs.

## Next step

Install the webmail on your phone with the [Progressive Web App](/docs/features/pwa) guide, or check what has to be reachable from where in [Requirements and sizing](/docs/deployment/requirements).
