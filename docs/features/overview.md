---
title: All features
description: The complete feature list of Bulwark Webmail, section by section.
order: 0
edition: both
---

# All features

One line per feature, grouped by area, with links to the pages that explain them. The note in parentheses says what a feature needs beyond Bulwark and a supported Stalwart server, when it needs anything:

- **not in Lite**: Bulwark Lite leaves it out, because it needs the Node.js server. The full list is under [what Lite leaves out](/docs/getting-started/lite#what-is-off).
- **Stalwart 1.0**: it needs Stalwart v1.0.0 or later; on 0.16 it is missing.
- **Stalwart Enterprise licence**: Stalwart only answers with a licence.
- **plugin**: it comes from a plugin, which an admin installs. Plugins don't run in Lite.

## Mail

Related pages: [Email](/docs/features/email), [Composing](/docs/features/email/composing), [Search](/docs/features/email/search), [Keyboard shortcuts](/docs/guides/keyboard-shortcuts).

- **Composer**: rich text (Tiptap) with inline images, drag-and-drop embedding and tables, or plain text; reply, reply-all, forward and Reply-To
- **Conversations**: Gmail-style threads, expanded inline; the conversation view can be switched off
- **Unified mailbox**: one Inbox, Sent, Drafts, Junk, Archive and Trash for the active account, its shared mailboxes and the folders shared with it, off until you turn it on; across all your accounts only if the admin allows it ([how it works](/docs/guides/multi-account#unified-inbox))
- **All mail, Unread and Starred**: views across your folders, narrowed to the folders you pick, each row naming its folder (each one only if the admin allows it)
- **Search**: full-text search with a filter panel, search chips and searches across folders and the unified views; `word*` prefix search (Stalwart 1.0)
- **Drafts**: saved as you type, keeping the identity, the HTML body and the reply headers
- **Attachments**: upload, download, drag out to the desktop, open on click in the composer, thumbnails in the list, and inline preview of images and PDFs on desktop and mobile
- **Forgotten attachments**: a warning when the text mentions an attachment and none is attached
- **Scheduled send and send delay**: send later, or hold each message for a moment before it leaves; the delay is off by default (needs a server with delayed sending)
- **Subject check**: sending without a subject asks first instead of refusing; the question can be switched off
- **Read receipts**: ask for and answer them (MDN, RFC 8098)
- **Quoted text**: lands in an editable block that keeps the original layout
- **Batch actions**: select several messages to archive, delete, move or tag them
- **Archive**: directly, by year or by month
- **Tags**: colours, drag to reorder, drop a message on a tag to assign it, optional nesting, and each tag shown always, only with unread mail, or never
- **Tags in other clients**: tags are JMAP keywords on the message, names and colours are kept in the browser, and a scan adds back keywords no local tag explains
- **Stars and read state**: star or unstar, and a mark-as-read delay you can set
- **List order**: presets (unread, starred or tagged first) or up to three sort levels, sorted on the server, for the Inbox or every folder
- **Large mailboxes**: the list scrolls virtually, and the first page of mail loads at sign-in
- **Refresh**: from the list's ⋮ menu or right-click menu, F5, Ctrl+R or pull-to-refresh; Mountain View has a toolbar button
- **Quick actions**: quick reply, hover actions and recipient popovers
- **Sender pictures**: contact photos, BIMI logos or the sender's website icon (logos and icons not in Lite)
- **Sender address**: override the From header; with "Reply from the address it was sent to" on, a reply to an alias on your domain uses that alias, even without an identity for it
- **Booking cards**: bookings, parcels and orders with schema.org markup show as a card ([booking cards](/docs/features/email/booking-cards))
- **Unsubscribe**: one click for newsletters that offer it (RFC 2369)
- **`.eml` files**: import them from the folder right-click menu, and forward a message as an `.eml` attachment named by your filename template
- **Awkward attachments**: `winmail.dat` (TNEF) is unpacked, and attached messages (`message/rfc822`) open as nested mail
- **Folders**: icons, nesting and counts in the sidebar
- **Print** from the viewer, and browser back and forward through mail history

## Calendar

Related pages: [Calendar](/docs/features/calendar).

- **Views**: month, week, day, agenda and tasks, with a mini-calendar in the sidebar
- **Drag to edit**: move an event, click-drag to create one, pull an edge to resize; everything snaps to 15 minutes
- **Recurring events**: edit or delete this occurrence, this and following, or all
- **Invitations**: sent by email through Stalwart's scheduling (iMIP, RFC 6047), with an organizer and attendee panel and an RSVP that checks whether the invitation can be trusted
- **`.ics` in mail**: answer or import an invitation without leaving the message
- **Import**: iCalendar files preview first, then import in bulk without duplicates (by UID)
- **Subscriptions**: iCal and webcal feeds, editable, with batch import (not in Lite)
- **Birthday calendar**: made from your contacts, turned on in Settings → Calendar
- **Video links**: video-conference URLs are event fields of their own
- **Tasks**: due date, priority and status, once "Enable tasks" is on in Settings → Calendar
- **Shared calendars**: calendars others share with you show up, each in a colour you pick for yourself
- **CalDAV addresses**: listed in Settings → Calendar for other apps (not in Lite)
- **Display and alerts**: week numbers, hover preview, and notifications with a sound picker
- **Live updates**: JMAP push keeps the calendar in sync

## Contacts

Related pages: [Contacts](/docs/features/contacts).

- **Sync**: over JMAP (RFC 9553 / 9610), with local storage as a fallback
- **Address books**: several, with drag-and-drop between them
- **Groups**: with member management
- **People and organisations**: an organisation card needs no personal name; the organisation's name fills vCard's `FN`
- **vCard**: import and export (RFC 6350), with duplicates flagged
- **Trusted senders**: kept in an address book of their own
- **Autocomplete**: on To, Cc and Bcc

## Filters & templates

Related pages: [Email](/docs/features/email), [Composing](/docs/features/email/composing).

- **Filters**: server-side Sieve scripts over JMAP (RFC 9661)
- **Rule builder**: conditions on From, To, Cc, Subject, headers, size, body and attachments, and actions such as move, copy, forward, star, tag, mark read, reject or discard, with an optional date range per rule
- **Other clients' rules**: survive the round trip
- **Raw Sieve editor**: with syntax checks
- **Vacation responder**: can be scheduled to a date range
- **Templates**: with placeholders; `{{date}}`, `{{day_of_week}}` and `{{sender_name}}` fill in by themselves, `{{recipient_name}}` and `{{company}}` are asked for on insert

## Files

Related pages: [Files](/docs/features/files).

- **Folder tree**: Stalwart's JMAP FileNode storage as real folders; older flat-named files move into folders on first load
- **Upload**: files and whole folders, with progress, straight to Stalwart, within the server's own limits
- **Browse**: grid or list, sorted by name, size or date; cut, copy, paste, duplicate, starred items, recent files
- **Preview**: images, PDFs, text, Markdown, HTML, `.eml`, audio and video
- **Office editing**: open office documents in Collabora or ONLYOFFICE (needs Collabora or ONLYOFFICE, connected by the admin; not in Lite)
- **Sharing**: share files and folders with a user or group as Read only, Read & write or Manager (RFC 9670); what others share with you is under "Shared with me"

## Security & privacy

Related pages: [Account security](/docs/guides/account-security), [S/MIME](/docs/guides/smime), [Authentication](/docs/getting-started/configuration/authentication), [Embedded SSO](/docs/guides/embedded-sso).

- **Remote content**: blocked until you allow it, and trusted senders are remembered
- **Sanitized HTML**: through DOMPurify
- **S/MIME**: manage certificates, sign, encrypt, decrypt and verify, legacy 3DES and PBE keys included, with keys kept apart per account (plugin; not in Lite)
- **Encryption at rest**: add S/MIME or PGP public keys and turn on Stalwart's encryption at rest against one of them (not in Lite)
- **Sender checks**: SPF, DKIM and DMARC results, with the "via" badge dropped on spoofed mail
- **Single sign-on**: OAuth2 / OIDC with PKCE against Keycloak, Authentik or Stalwart's own provider, OAuth-only mode, OAuth app passwords, and silent sign-in for embedded use (not in Lite, except Lite installed on Stalwart)
- **Two-factor**: TOTP codes at sign-in
- **Password and 2FA**: change your password and set up two-factor in Settings → Security, through Stalwart's account API (password sign-ins only; not in Lite)
- **Sessions**: kept in an encrypted httpOnly cookie (AES-256-GCM); every sign-in is remembered unless the admin shows a "Remember me" box
- **Browser hardening**: a CSP with a nonce per request, SSRF checks on redirects, sandboxed HTML and `.eml` previews, and protection against spoofed client IPs
- **Plugin safety**: plugins run in a sandbox, uploads are checked for risky code, and plugins users upload need admin approval (not in Lite)

## Interface

Related pages: [Customization](/docs/guides/customization), [Keyboard shortcuts](/docs/guides/keyboard-shortcuts).

- **Layouts**: split three-pane, focused list, or reading pane at the bottom, with resizable columns; for desktop, tablet and phone
- **Dark mode**: email colours are remapped by luminance, so dark-on-white mail stays readable
- **Themes**: Flat fields, Qui, Nord, Catppuccin, Solarized, Roundcube Elastic and Aurora Glass, each previewed as a small mailbox in its own colours
- **Keyboard**: full keyboard navigation
- **Drag and drop**: to file mail and assign tags
- **Guided tour**: for first-time users
- **Menus and undo**: right-click menus, and toasts that offer an undo
- **Links to every screen**: messages, threads, folders, calendar days, events, contacts, file folders and settings pages each have a URL, and "Copy link" is in the message, conversation and event menus
- **Branding**: toolbar position, favicon and login page
- **Sidebar apps**: add your own and reorder them in Settings → Add-ons; admins can pin apps for everyone (not in Lite)
- **Settings sync**: settings follow you to other devices, stored encrypted on the webmail server, once the admin turns it on (not in Lite)
- **Storage quota**: shown in the app

## Accessibility

Related pages: [Accessibility](/docs/features/accessibility), [Presets and locks for admins](/docs/features/accessibility/admin), [Accessibility law for operators](/docs/legal/accessibility).

- **Presets**: for screen readers, low vision, dyslexia, focus, keyboard and motor, motion and seizure safety, and deaf and hard of hearing users, on an Accessibility page in Settings
- **Follows the device**: contrast, motion, transparency and large targets, until you choose otherwise; text size from 87.5% to 200%
- **Quick panel**: on Alt+Shift+A, as an optional button in the side navigation rail, and on the sign-in page
- **Keys**: single-key shortcuts can be turned off, F6 moves between panes, Ctrl+Z undoes the last mail actions
- **Reading**: incoming mail as plain text, in your own fonts, colours and text size, fitted to the window, with animated images paused
- **Writing**: image descriptions in the composer, and an accessible example template
- **Screen readers**: landmarks, headings, skip links and announcements
- **For admins**: preset every option, and lock single-key shortcuts, the confirmations before sending, deleting and archiving, a minimum notification duration, and the font and size for new messages

## Internationalization

Related pages: [Environment reference](/docs/getting-started/configuration/environment-reference).

29 languages: Català · Česky · Dansk · Deutsch · Eesti · English · Español · Français · Italiano · Latviešu · Magyar · Nederlands · Norsk bokmål · Polski · Português · Română · Slovenčina · Türkçe · Монгол · Русский · Українська · עברית · العربية · فارسی · ไทย · 한국어 · 日本語 · 简体中文 · 繁體中文

- **Right-to-left**: Arabic, Hebrew and Persian flip the layout
- **Language choice**: the browser's `Accept-Language` picks the first one, and each user's choice is kept
- **Defaults**: `NEXT_PUBLIC_DEFAULT_LOCALE` sets the fallback language and `NEXT_PUBLIC_LOCALE_PREFIX` the URL prefix (build-time settings: rebuild the Docker image to change them)

## Identity & multi-account

Related pages: [Multiple accounts](/docs/guides/multi-account), [Stalwart setup](/docs/getting-started/stalwart-setup).

- **Several accounts**: signed in at once, switched instantly, each with its own session; up to 5 over HTTP/1.1 and up to 50 over HTTP/2 or HTTP/3
- **Account switcher**: shows connection status and a default account
- **Identities**: several sender addresses, each with its own signature, synced and badged in the viewer and the list
- **Signature position**: before or after the quoted text, one setting for all identities (Settings → Composing)
- **Sub-addressing**: `user+tag@domain.com`, with a configurable delimiter and tag suggestions
- **Shared mailboxes**: a Stalwart group's mailbox, and folders others share with you, sit next to your own folders; you read, file, archive and send from them ([shared mailboxes](/docs/features/email#shared-mailboxes))
- **Shared mail in the unified mailbox**: "Include group inboxes" merges shared mailboxes into it, with unread counts kept in step
- **Several JMAP servers**: per deployment, optionally picked by the address's domain
- **Custom JMAP server**: typed on the login form, when `ALLOW_CUSTOM_JMAP_ENDPOINT` allows it

## Organisation

Related pages: [Organisation settings](/docs/guides/organisation), [Roll Bulwark out to an organisation](/docs/guides/organisation/rollout). Admins set or limit these in the admin console; Bulwark Lite reads the same settings from a `policy.json` written by hand.

- **Locks and defaults**: switch features off, lock settings at a value or preset them; users see "Set by your organisation" next to a locked setting ([user policy](/docs/guides/admin#user-policy))
- **Per domain or group**: different settings for some mail domains or Stalwart groups, with a view of the policy one address gets ([domains and groups](/docs/guides/organisation/domains-and-groups))
- **Organisation signature**: filled in with each user's details, per domain or group, optionally locked ([signatures](/docs/guides/organisation/signatures))
- **Disclaimer**: a legal footer added to every message when it is sent ([signatures](/docs/guides/organisation/signatures))
- **Template library**: read-only templates from the organisation, per domain or group ([templates](/docs/guides/organisation/templates))
- **Team templates**: templates the members of a shared mailbox share (Stalwart 1.0) ([templates](/docs/guides/organisation/templates))
- **Own templates in the account**: users' templates are stored in their account, so every browser has them (Stalwart 1.0) ([templates](/docs/guides/organisation/templates))
- **External mail**: an "External" label on mail from outside, and a question before sending or inviting outside ([external mail](/docs/guides/organisation/external-mail))
- **Sign-out times**: sign users out after a time without activity or a fixed time after sign-in ([sign-out times](/docs/guides/organisation/sessions))
- **No third-party traffic**: one switch stops every connection to services outside your own servers ([third-party traffic](/docs/guides/organisation/third-party-traffic))
- **Shared tags**: the members of a shared mailbox see the same tag names and colours (Stalwart 1.0) ([shared tags](/docs/guides/organisation/shared-tags))
- **Delegates**: users give a colleague read or read-and-write access to their mail, calendars and contacts in one step ([delegates](/docs/guides/organisation/delegates))
- **Recover deleted items**: users bring back mail deleted for good from Stalwart's archive (Stalwart Enterprise licence, archiving turned on) ([recover deleted items](/docs/guides/organisation/recover-deleted-items))
- **Team inbox**: assign messages in a shared mailbox to a member and mark them done (plugin, uploaded as a ZIP until it is in the directory; not in Lite) ([team inbox](/docs/guides/organisation/team-inbox))

## Admin console

Related pages: [Admin console](/docs/guides/admin), [Configuration](/docs/getting-started/configuration). None of this is in Lite.

- **Setup wizard**: on a fresh install without `JMAP_SERVER_URL`, asks for the setup token from the server log, then walks through JMAP servers, OAuth/OIDC, the session secret, settings sync and telemetry, logging, branding and the admin password; it writes to the admin config directory, not `.env.local`
- **Admin console**: at `/admin`, one page per area: server, authentication, branding, user policy, organisation, plugins, themes, marketplace, updates, usage stats and the audit log
- **Admin sign-in**: Stalwart administrators sign in without a separate admin password
- **Unified mailbox switches**: All mail, Unread and Starred each on or off for everyone, and the cross-account mode on its own switch (off by default, turned on at upgrade for installs that already used it); a view that is allowed still follows the user's own toggle
- **Config and state apart**: `ADMIN_CONFIG_DIR` holds what the operator writes and can be mounted read-only after setup; `ADMIN_STATE_DIR` holds the audit log and login times
- **Secrets from files**: `passwordHashFile`, `sessionSecretFile` and `oauthClientSecretFile` read Docker and Kubernetes secrets
- **Search engines**: a switch for the robots meta tag, off by default, so pages say `noindex`

## Plugins and themes

Related pages: [Plugins](/docs/guides/plugins), [Marketplace](/docs/guides/marketplace), [Extensions](/docs/extensions/introduction). None of this is in Lite.

- **Plugins**: add buttons, panels, banners, hooks and settings to mail, calendar and contacts, run in a sandbox, and are off until an admin turns them on; the hooks, surfaces and APIs are on the [Plugins](/docs/guides/plugins) page
- **Marketplace**: browse and install plugins and themes from a directory in the admin console, the official one or your own (`EXTENSION_DIRECTORY_URL`)
- **Users' own plugins**: users upload them in Settings → Add-ons when the admin allows it, and an admin approves each one
- **Themes**: uploaded as ZIP bundles, and admins can enforce one
- **Plugins from the directory**: such as Jitsi Meet for video calls in calendar events
- **Plugin development**: load a plugin from a dev folder (`PLUGIN_DEV_DIR`), rebuilt from `src/` on each page load; the [extension docs](/docs/extensions/introduction) cover the manifest and publishing

## Operations

Related pages: [Installation](/docs/getting-started/installation), [Docker](/docs/deployment/docker), [Bulwark Lite](/docs/getting-started/lite), [Install on Stalwart](/docs/deployment/stalwart-app), [Progressive Web App](/docs/features/pwa), [Anonymous usage stats](/docs/features/telemetry), [Updating](/docs/deployment/updating).

- **Progressive Web App**: installs from the browser, with a dynamic manifest and install screenshots per domain; the install prompt and the notification prompt never compete, and neither shows on login, setup or settings screens
- **Web push**: new-mail notifications through a push relay, the hosted one or your own (not in Lite)
- **Update check**: logs new releases on the server, puts a dot on the admin button and a tag in the settings About card, and the sign-in page says "New version available", or "Security update available" in red; `BULWARK_UPDATE_CHECK=off` stops it (not in Lite)
- **Logs**: `text` or `json` with one level (`LOG_LEVEL`), and a debug mode in the browser with categories to switch
- **Anonymous telemetry**: off until you turn it on in the admin console, the installer or with `BULWARK_TELEMETRY=on`; no addresses, hostnames or IPs ([what it sends](/docs/features/telemetry))
- **Docker images**: on GHCR, `webmail` for releases and `webmail-beta` built from `main`, plus `webmail-lite` and `webmail-lite-beta`
- **Bulwark Lite**: the client as static files (`bulwark-lite-<version>.zip` on every release) for any static host, with `config.json` read at runtime and cookie-free token sign-in against Stalwart ([Bulwark Lite](/docs/getting-started/lite))
- **Lite on Stalwart**: `bulwark-lite-stalwart.zip` installs as a Stalwart Application and is served by Stalwart on the same origin; password sign-in needs no setup, and sign-in at an identity provider needs the bundle's redirect URI registered there ([Install on Stalwart](/docs/deployment/stalwart-app))
- **Sub-path**: `NEXT_PUBLIC_BASE_PATH` mounts the app below a path behind a reverse proxy (set at build time)
- **Demo mode**: runs on sample data, no mail server needed ([demo mode](/docs/getting-started/demo-mode))

To see the main parts in use, start with [Email](/docs/features/email). To run Bulwark yourself, go to [Installation](/docs/getting-started/installation).
