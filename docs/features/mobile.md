---
title: Mobile
description: Bulwark on a phone - the installable PWA, the native app, and the push relay behind both.
order: 6
edition: both
---

# Mobile

There are two ways to read your mail on a phone, and they suit different people.

The **PWA** is the webmail itself, installed to the home screen. It is the same code as the desktop app, it is finished, and it needs nothing beyond the server you already run. For most self-hosters this is the answer.

The **native app** is a separate React Native client. It is a pre-1.0 beta and parts of it are still stubs. Android gets the full feature set; on iPhone and iPad it runs as a TestFlight beta without push notifications, client certificates or phone contacts/calendar sync. It exists because notification behaviour and offline handling are better on a real app than a service worker, and because some people want an icon that behaves like every other icon on the device.

## The PWA

Any modern browser will offer to install Bulwark once it has read the manifest. On Android that is Chrome's install prompt, on desktop it is the icon in the address bar, and on iOS it is Share → Add to Home Screen, because Safari does not offer anything else.

Installed, it launches without browser chrome, shows an OS splash screen in your configured colors, and gets push notifications for new mail through the push relay even with the tab closed (on iOS only once it's on the home screen). The whole manifest (name, description, icons, colors, install screenshots) is generated from runtime configuration, so rebranding it does not mean rebuilding the image.

On a phone the mail list gets a search-first header instead of a second toolbar row, and swiping a row left or right runs a quick action (archive, delete, read, star or spam, configurable per direction and mirrored for right-to-left languages).

<div class="bw-note"><b>Note.</b> Bulwark Lite on a phone is the same layout, minus web push: Lite registers no service worker. The native app below is unaffected, since it talks to the relay on its own.</div>

[Progressive Web App](/docs/features/pwa) covers the configuration, the reverse-proxy paths that must stay reachable, and what to do when the install option doesn't appear.

## The native app

Source, Android APKs and the iOS TestFlight link: [github.com/bulwarkmail/native](https://github.com/bulwarkmail/native).

It signs in to any JMAP server, handles multiple accounts, and does mail, threading, composing, basic calendar and basic contacts, with push notifications through the relay below. On Android it syncs contacts and calendars both ways with the phone's own apps, and push works over UnifiedPush (for example ntfy) on devices without Google Play services. It updates itself by sideloading from GitHub Releases.

What it does not do yet: S/MIME, plugins and themes are UI stubs. Calendar editing is partial and contacts editing is basic. There is no Play Store or App Store listing: on Android you sideload the APK from GitHub Releases, on iOS you join the TestFlight beta.

Do not make it your only mail client yet. The README is blunt about this and so are we.

## The push relay

A phone can't hold a JMAP push connection open indefinitely without ruining the battery, so the platform push services do that job instead. Reaching Android's needs Firebase credentials, and asking every self-hoster to create a Firebase project to receive their own mail would be absurd.

The relay solves that. Your mail server sends it a JMAP `PushSubscription` notification; the relay forwards a wake-up through Firebase Cloud Messaging (Android app), Web Push (the installed PWA or an open browser) or UnifiedPush (Android without Google Play services); the device wakes and fetches the actual mail over its own JMAP connection, directly from your server. Push to the iOS app isn't available yet.

What the relay holds is a push address for the device (an FCM token, a Web Push subscription or a UnifiedPush endpoint), an optional label you chose so you can tell accounts apart, a one-time verification code while a subscription is being set up, and timestamps. Subscriptions without traffic for 90 days are deleted. What passes through it is the account id and either the changed data types with their state strings or the ids of new messages. Subjects, senders, recipients, bodies and attachments never reach it, because the notification carries no mail, only the news that mail exists.

One hosted instance serves everyone by default. To run your own, the source is at [github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay). Add it in the admin console under User policy → Push relays and make it the default (you can also pin users to it); no rebuild is needed. Users pick a relay under Settings → Notifications → Push relay. `NEXT_PUBLIC_PUSH_RELAY_URL` still repoints the built-in entry, but only at build time. With third-party traffic switched off, the built-in relay is dropped and push only works through a relay you added. Point the mobile app at your relay in its notification settings.

Retention, the exact fields, and the Firebase hop are all written up in the [privacy policy](/docs/legal/privacy).

## Related pages

- [Progressive Web App](/docs/features/pwa)
- [Privacy policy](/docs/legal/privacy)
