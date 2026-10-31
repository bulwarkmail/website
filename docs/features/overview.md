---
title: All features
description: The complete feature list of Bulwark Webmail, section by section.
order: 0
edition: both
---

# All features

This page lists everything Bulwark does, grouped by area, with links to the pages that explain each part. Bulwark Lite has every feature that runs in the browser. The parts that need the Node.js server, such as the admin console, plugins, settings sync, web push and the account security tab, are listed under [what Lite leaves out](/docs/getting-started/lite#what-is-off). Sign-in through an identity provider works only in the Lite bundle for Stalwart.

## Mail

Related pages: [Email](/docs/features/email), [Composing](/docs/features/email/composing), [Search](/docs/features/email/search), [Keyboard shortcuts](/docs/guides/keyboard-shortcuts).

- Read, compose, reply, reply-all, and forward in a Tiptap rich-text editor that handles inline images, drag-and-drop embedding, and tables
- Gmail-style threading, expanded inline, with a conversation toggle you can switch off
- The Unified Mailbox combines Inbox, Sent, Drafts, Junk, Archive, and Trash. By default it stays inside the active account and its shared/group folders; an admin can unlock a cross-account mode that spans every connected account. The combined folders show up once there is something to combine: cross-account mode is on with two or more accounts connected, "Include group inboxes" is on and a group inbox exists, or one of All mail, Unread and Starred is switched on.
- All mail, Unread, and Starred obey that same account boundary and can be narrowed to a per-account folder selection. Every row names the folder its message came from. Each of the three is a separate admin policy gate (see [Admin & extensibility](#admin--extensibility)). Their toggles are under Settings → Account → Multiple accounts, which shows once you have two accounts connected or a shared or group mailbox. They appear after you turn on the Unified mailbox, and only for the views your admin has enabled. Ask your admin to enable the ones you need.
- Search runs across all unified views; the per-role mailboxes add the full filter panel on top
- Three mail layouts: split three-pane, focused list, or reading pane at the bottom
- Drafts auto-save, keeping the chosen identity, the HTML body, and correct `In-Reply-To` / `References` headers on replies
- Attachments upload, download, drag out to the file system, and preview inline. Images and PDFs render on desktop and mobile, composer attachments open on click, and `.eml` (`message/rfc822`) parts display as a nested email. There are list thumbnails, and a warning when you mention an attachment and forget it.
- Scheduled send, plus an optional delay (off by default) before a message leaves; both need a server that supports delayed sending
- Sending without a subject asks for confirmation instead of refusing, and the prompt can be switched off
- Read receipts (MDN, RFC 8098)
- Quoted text lands in an editable island that keeps the original layout
- Full-text search with a JMAP filter panel, search chips, `word*` prefix search on Stalwart 1.0, and searches across folders
- Multi-select for batch archive, delete, move, and tag
- Archive directly, by year, or by month
- Tags carry color labels, reorder by drag, and can be assigned by dropping a message onto them
- Tags optionally nest: pick a parent when you create one and the sidebar turns them into a tree
- Each tag can be shown always, only when it has unread mail, or never
- Tag names and colors live in the browser, while the tags themselves ride on your messages as JMAP keywords. A scan finds keywords no local tag explains and adds them back.
- Star or unstar, with a configurable mark-as-read delay
- Configurable message-list order: presets (unread first, starred first, tagged first) or up to three custom sort levels, applied server-side through the JMAP sort so the whole folder is ordered, for the Inbox only or every folder
- Large mailboxes scroll virtually, and the first page of mail prefetches at login
- Refresh from the list's ⋮ menu or its right-click menu (Mountain View has a toolbar button that spins while it loads), or with F5, Ctrl+R or pull-to-refresh
- Quick reply, hover actions, sender avatars from contact photos, BIMI logos or the sender's website icon, recipient popovers
- Plain-text composer mode and Reply-To
- The signature goes before or after the quoted text (one setting for all identities, in Settings → Composing)
- Override the From header in the composer. With "Reply from the address it was sent to" on, a reply to an alias on a domain you own auto-fills it as the sender, even when no identity exists for it.
- Import `.eml` files from the folder right-click menu
- Forward a message as an `.eml` attachment, from the viewer or the list right-click menu, named by your filename template
- TNEF (`winmail.dat`) extraction and `message/rfc822` unwrapping
- Folders take an icon, nest, and show counts in the sidebar
- Print from the viewer
- Browser back and forward move through mail history

## Calendar

Related pages: [Calendar](/docs/features/calendar).

- Month, week, day, agenda and task views, with a mini-calendar in the sidebar
- Drag an event to reschedule it, click-drag to create one, pull an edge to resize. Everything snaps to 15 minutes.
- Recurring events edit and delete by scope: this occurrence, this and following, or all
- Invitations and updates go out by email through Stalwart's scheduling (iMIP, RFC 6047), with an organizer/attendee panel and RSVP that checks whether the invitation can be trusted
- `.ics` attachments are detected in the email viewer, so you can RSVP or import without leaving the message
- iCalendar import previews first, then bulk-creates, deduplicating on UID
- iCal / webcal subscriptions, editable, with batch import
- A birthday calendar generated from your contacts (turn it on in Settings → Calendar)
- Virtual locations (video-conference URLs) are first-class event fields
- Tasks with due dates, priority and completion status, once "Enable tasks" is on in Settings → Calendar
- Calendars other people share with you show up over JMAP, each with a colour you can change for yourself. Settings → Calendar lists CalDAV addresses for other apps.
- Week numbers, hover preview, notifications with a sound picker
- JMAP push keeps everything in sync

## Contacts

Related pages: [Contacts](/docs/features/contacts).

- JMAP sync (RFC 9553 / 9610), falling back to local storage
- Several address books, with drag-and-drop between them
- Groups with member management
- A card can be a person or an organization. Organization cards need no personal name; the org name carries the card and fills vCard's mandatory `FN`.
- vCard import/export (RFC 6350) that flags duplicates
- Trusted senders live in their own JMAP address book
- Autocomplete on To, Cc, and Bcc

## Filters & templates

Related pages: [Email](/docs/features/email), [Composing](/docs/features/email/composing).

- Server-side filters as JMAP Sieve Scripts (RFC 9661)
- A visual rule builder: conditions on From, To, Cc, Subject, headers, size, body and attachments (most of them matching several values), actions such as move, copy, forward, star, tag, mark read, reject or discard, and an optional date range per rule
- Rules written in other clients survive the round-trip
- Raw Sieve editor with syntax validation
- A vacation responder you can schedule to a date range
- Templates with placeholders: `{{date}}`, `{{day_of_week}}` and `{{sender_name}}` fill in by themselves, and `{{recipient_name}}` or `{{company}}` are asked for when you insert the template

## Files

Related pages: [Files](/docs/features/files).

- Browse Stalwart's native JMAP FileNode storage as a real folder tree. Legacy flat-named files migrate into nested `FileNode` folders on first load.
- Upload files and whole folders with progress, straight to Stalwart over JMAP
- Upload limits follow the server's own configuration
- Grid or list, sorted by name, size, or date
- Preview images, PDFs, text, Markdown, HTML, `.eml`, audio and video; edit office documents in Collabora or ONLYOFFICE when your admin has connected one (not in Lite)
- Cut, copy, paste, duplicate; starred items; recent files
- JMAP sharing (RFC 9670) for files and folders. Pick a user or group from the principal picker and grant Read only, Read & write, or Manager. Shared items get an indicator, and anything other principals share with you appears under "Shared with me".

## Security & privacy

Related pages: [Account security](/docs/guides/account-security), [S/MIME](/docs/guides/smime), [Authentication](/docs/getting-started/configuration/authentication), [Embedded SSO](/docs/guides/embedded-sso).

- External content stays blocked until you say otherwise, and trusted senders are remembered
- HTML sanitized through DOMPurify
- S/MIME through the S/MIME plugin from the extension directory: manage certificates, then sign, encrypt, decrypt, and verify. Legacy 3DES / PBE is supported, and keys stay separate per account. An administrator has to turn plugins on and install it; Bulwark Lite has no plugins.
- Add S/MIME or PGP public keys per account, then turn on Stalwart's encryption at rest against one of them. The algorithm, whether new mail is encrypted on upload, and whether spam training runs before encryption are all configurable.
- SPF / DKIM / DMARC indicators surface the most severe SPF result and drop the "via" badge on spoofed mail
- OAuth2 / OIDC with PKCE against Keycloak, Authentik, or the built-in provider, plus OAuth-only mode, OAuth app passwords, and non-interactive SSO for embedded deployments
- TOTP two-factor authentication
- Change your password and set up 2FA from Settings → Security, through Stalwart's own account API (password sign-ins only)
- Encryption at rest, 2FA and password changes need Stalwart 0.16 or later and the full edition, not Lite
- Sessions are kept in an AES-256-GCM encrypted httpOnly cookie. Admins can show a "Remember me" box so users choose; by default every sign-in is remembered.
- CSP is enforced with a per-request nonce, alongside SSRF redirect checks, sandboxed HTML and `.eml` previews, and protection against spoofed client IPs
- Plugins run in a sandbox. Uploads are checked for risky code, and plugins users upload need admin approval.
- Newsletter unsubscribe (RFC 2369)

## Interface

Related pages: [Customization](/docs/guides/customization), [Keyboard shortcuts](/docs/guides/keyboard-shortcuts).

- Split three-pane, focused list, or bottom reading pane, columns resizable
- Dark and light themes. Email colors are remapped by luminance, so a mail hard-coded to dark-on-white stays readable on a dark background.
- Bundled themes: Flat fields, Qui, Nord, Catppuccin, Solarized, Roundcube Elastic and Aurora Glass. Each theme card renders as a miniature mailbox built from that theme's own colors, with chips for the light and dark variants.
- Layouts for desktop, tablet, and mobile
- Full keyboard navigation
- Drag and drop to organize mail and assign tags
- A guided tour for first-time users
- Right-click menus, and toasts that offer an undo
- Every screen has a permalink. `/mail/message/<id>`, `/mail/thread/<id>`, `/mail/folder/inbox`, `/calendar/day/2026-08-06`, `/calendar/event/<id>`, `/contacts/<id>`, `/files/<folder>`, and `/settings/<tab>` all open directly, the address bar follows what you are looking at, and "Copy link" is in the message, conversation, and event menus. Dashboards and launchers can link straight to a message; browser back and forward walk the mail UI.
- Toolbar position, favicon, and login branding are configurable
- Add your own sidebar apps and reorder them in Settings → Add-ons; admins can pin apps for everyone
- Settings sync between devices, stored encrypted on the webmail server (the admin turns it on)
- Storage quota display

## Accessibility

Related pages: [Accessibility](/docs/features/accessibility), [Presets and locks for admins](/docs/features/accessibility/admin), [Accessibility law for operators](/docs/legal/accessibility).

- An Accessibility page in Settings with presets for screen readers, low vision, dyslexia, focus, keyboard and motor, motion and seizure safety, and deaf and hard of hearing users
- Contrast, motion, transparency and large targets follow the device until you choose otherwise; text size scales the browser's own size from 87.5% to 200%
- A quick panel on Alt+Shift+A, an optional button in the side navigation rail, and a small panel on the sign-in page
- Single-key shortcuts can be turned off; F6 moves between panes, Ctrl+Z undoes the last mail actions
- Incoming mail as plain text, with its own text size and minimum, in your fonts and colours, fitted to the window, with animated images paused
- Image descriptions in the composer and an accessible example template
- Landmarks, headings, skip links and announcements for screen readers
- Admins can preset every option, and lock single-key shortcuts, the confirmations before sending, deleting and archiving, a minimum notification duration, and the font and size for new messages

## Internationalization

Related pages: [Environment reference](/docs/getting-started/configuration/environment-reference).

29 languages: Català · Česky · Dansk · Deutsch · Eesti · English · Español · Français · Italiano · Latviešu · Magyar · Nederlands · Norsk bokmål · Polski · Português · Română · Slovenčina · Türkçe · Монгол · Русский · Українська · עברית · العربية · فارسی · ไทย · 한국어 · 日本語 · 简体中文 · 繁體中文

- Arabic, Hebrew, and Persian render right-to-left; document direction and logical layout flip automatically
- The browser's `Accept-Language` picks the first language, and the choice persists per user
- `NEXT_PUBLIC_DEFAULT_LOCALE` sets the fallback language and `NEXT_PUBLIC_LOCALE_PREFIX` the URL prefix; both are build-time settings, so the Docker image has to be rebuilt to change them

## Identity & multi-account

Related pages: [Multiple accounts](/docs/guides/multi-account), [Stalwart setup](/docs/getting-started/configuration/stalwart-setup).

- Run several accounts at once and switch instantly, each keeping its own session. Up to 5 accounts at once over HTTP/1.1, and up to 50 when the server speaks HTTP/2 or HTTP/3.
- An account switcher showing connection status, and a default account
- Multiple sender identities, each with its own signature, synced automatically and badged in the viewer and list
- Signatures before or after the quoted text, one setting for all identities
- Sub-addressing (`user+tag@domain.com`), delimiter configurable, with tag suggestions drawn from context
- Shared folders across accounts
- Shared and group (delegated) accounts put their folders next to your own, and "Include group inboxes" merges them into the Unified Mailbox. You can open, mark read, flag as spam or not-spam, move, delete, and archive their messages from there, and folder unread counts stay in step.
- Several JMAP servers per deployment, optionally auto-picked by email domain
- Custom JMAP endpoints on the login form, when `ALLOW_CUSTOM_JMAP_ENDPOINT` permits it

## Admin & extensibility

Related pages: [Admin dashboard](/docs/guides/admin), [Plugins](/docs/guides/plugins), [Marketplace](/docs/guides/marketplace), [Extensions](/docs/extensions/introduction).

- On a fresh install without `JMAP_SERVER_URL`, a setup wizard asks for the setup token from the server log and walks through JMAP servers, OAuth/OIDC, the session secret, settings sync and telemetry, logging, branding (uploads included) and the admin password. It writes to the admin config dir, so `.env.local` stays untouched.
- An admin dashboard at `/admin` with one page per area: server, authentication, branding, user policy, organisation, plugins, themes, marketplace, updates, usage stats and the audit log. Stalwart administrators can open it without a separate admin password.
- Admin policy gates for the Unified Mailbox: turn All mail / Unread / Starred on or off org-wide, and gate cross-account capability separately (off by default, auto-enabled on upgrade for instances already using it). A gated view still respects the user's own toggle.
- Admin storage splits in two. `ADMIN_CONFIG_DIR` is operator-authored and can be mounted read-only once setup finishes; `ADMIN_STATE_DIR` holds the runtime audit log and login timestamps.
- JSON config can read secrets from files (`passwordHashFile`, `sessionSecretFile`, `oauthClientSecretFile`) for Docker and Kubernetes secret mounts
- An admin toggle controls search-engine indexing through the robots meta tag (off by default, so pages say `noindex`)
- Plugin system: a schema-driven config UI, render and intercept hooks, `onAvatarResolve`, `onBeforeEmailSend`, `composer-sidebar`, `email-banner`, `calendar-event-actions` / `-detail` / `-form` and `contact-cryptokeys` slots, i18n APIs (sandboxed plugins localize through manifest locales and `api.i18n.t`), an `/api/translate` proxy, email-body access, and managed policy enforcement
- Plugin APIs reach contacts (`api.contacts.get` / `list` / `search` / `create` / `update` / `remove`), the signed-in user (`api.user.getAccounts`, `getIdentities`, `logout`, plus `onBeforeLogout` / `onAfterLogout` hooks) and, on the privileged tier, public keys and encryption at rest. The data calls need their own consent permissions, such as `contacts:read` or `identity:read`.
- `onBeforeBlobUpload` can divert an attachment to external storage before it reaches the server, and `api.http.post` takes binary `Blob` / `File` bodies to get it there
- Plugins load from a dev folder (`PLUGIN_DEV_DIR`), rebuilt from `src/` through esbuild on each page load, and can request `http:fetch` scoped by `httpOrigins`
- Themes upload as ZIP bundles, and admins can enforce one
- An extension marketplace in the admin dashboard browses and installs plugins and themes from a configurable directory (`EXTENSION_DIRECTORY_URL`). Users can upload their own plugins in Settings → Add-ons if the admin allows it, pending approval.
- Plugins from the directory, such as Jitsi Meet for calendar video calls

## Operations

Related pages: [Installation](/docs/getting-started/installation), [Docker](/docs/deployment/docker), [Bulwark Lite](/docs/getting-started/lite), [Install on Stalwart](/docs/deployment/stalwart-app), [Progressive Web App](/docs/features/pwa), [Anonymous usage stats](/docs/features/telemetry), [Updating](/docs/deployment/updating).

- Progressive Web App: service worker, install prompt, web push for new mail sent through a push relay (the hosted default or your own), a dynamic manifest, and install screenshots configurable per domain
- The install prompt and the background-notification prompt are sequenced, so the two never compete for the same moment. Neither appears on login, setup, or settings screens.
- Update checks run on their own (`BULWARK_UPDATE_CHECK=off` stops them) and log new releases on the server. A new release puts a dot on the admin button and a tag next to the version in the settings About card, and the sign-in page's version line reads "New version available", or "Security update available" in red.
- Server logs as `text` or `json` with one log level (`LOG_LEVEL`), plus a debug mode in the browser with switchable categories
- Anonymous instance telemetry, off unless you enable it through the admin UI, the installer, or `BULWARK_TELEMETRY=on`. It reports a random instance id, version and build, platform, Node and OS family, bucketed account counts, extension and theme counts, uptime and which features are on. No addresses, hostnames or IPs.
- Docker images on GHCR: `webmail` for releases and `webmail-beta` built from `main`, plus `webmail-lite` and `webmail-lite-beta` for Lite
- Bulwark Lite: a static export of the client (`npm run build:lite`, `bulwark-lite-<version>.zip` on every release) for plain static hosts; runtime `config.json`, cookie-free token login against Stalwart, no admin/plugin/sync features
- Bulwark Lite for Stalwart: `bulwark-lite-stalwart.zip` installs as a Stalwart `Application` (served by Stalwart itself under any prefix, on the same origin). Password sign-in needs no configuration; accounts that sign in at an external identity provider need the bundle's redirect URI registered there.
- `NEXT_PUBLIC_BASE_PATH` mounts the app at a subpath behind a reverse proxy (set at build time)
- Demo mode runs on fixture data, no mail server required
