---
title: Mobile
description: Bulwark on a phone - the installable PWA, the native app, and the push relay behind both.
order: 6
---

# Mobile

There are two ways to read your mail on a phone, and they suit different people.

The **PWA** is the webmail itself, installed to the home screen. It is the same code as the desktop app, it is finished, and it needs nothing beyond the server you already run. For most self-hosters this is the answer.

The **native app** is a separate React Native client. It is in beta, Android-only in practice, and parts of it are stubs. It exists because notification behaviour and offline handling are better on a real app than a service worker, and because some people want an icon that behaves like every other icon on the device.

## The PWA

Any modern browser will offer to install Bulwark once it has read the manifest. On Android that is Chrome's install prompt, on desktop it is the icon in the address bar, and on iOS it is Share → Add to Home Screen, because Safari does not offer anything else.

Installed, it launches without browser chrome, shows an OS splash screen in your configured colors, and receives web push for new inbox mail even with the tab closed. The whole manifest (name, description, icons, colors, install screenshots) is generated from runtime configuration, so rebranding it does not mean rebuilding the image.

[Progressive Web App](/docs/features/pwa) covers the configuration, the reverse-proxy paths that must stay reachable, and what to do when the install option doesn't appear.

## The native app

Source and APK builds: [github.com/bulwarkmail/native](https://github.com/bulwarkmail/native).

It signs in to any JMAP server, handles multiple accounts, and does mail, threading, composing, basic calendar and basic contacts, with push notifications through the relay below. It updates itself by sideloading from GitHub Releases.

What it does not do yet: filters, S/MIME, plugins, themes, and file storage are UI stubs. Calendar editing is partial. There is no Play Store listing, so installation means sideloading an APK. The iOS build is untested, because signing it needs hardware the project does not currently have.

Do not make it your only mail client yet. The README is blunt about this and so are we.

## The push relay

A phone can't hold a JMAP push connection open indefinitely without ruining the battery, so the platform push services do that job instead. Reaching them requires Firebase credentials, and asking every self-hoster to create a Firebase project to receive their own mail would be absurd.

The relay solves that. Your mail server sends it a JMAP `PushSubscription` notification; it forwards a wake-up through Firebase Cloud Messaging; your phone wakes and fetches the actual mail over its own JMAP connection, directly from your server.

What the relay holds is a device push token, an optional label you chose so you can tell accounts apart, and timing metadata. What passes through it is a change type and a set of changed object ids. Subjects, senders, recipients, bodies and attachments never reach it, because the notification carries no mail, only the news that mail exists.

One hosted instance serves everyone by default. To run your own, the source is at [github.com/bulwarkmail/relay](https://github.com/bulwarkmail/relay); point the webmail at it with `NEXT_PUBLIC_PUSH_RELAY_URL` (a build-time variable) and the mobile app at it in its own settings.

Retention, the exact fields, and the Firebase hop are all written up in the [privacy policy](/docs/legal/privacy).

## Related pages

- [Progressive Web App](/docs/features/pwa)
- [Privacy policy](/docs/legal/privacy)
