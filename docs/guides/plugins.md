---
title: Plugins
description: What plugins can add to Bulwark, and how admins install and control them.
order: 6
edition: full
editionNote: "Plugins and sidebar apps need the sandbox routes and the admin server, so the static export pins both off. Its built-in themes still work."
---

# Plugins

A plugin adds something to the interface that isn't in the box, such as an extra button on a calendar event, a panel down the side of the composer or a bridge to some service you already pay for. Each one ships as a ZIP bundle holding a manifest, optional settings and configuration schemas, translations and the frontend code itself.

This page is the overview for admins and plugin authors. The full reference for writing a plugin, with every hook, surface, API method and the permission each one needs, is [Writing plugins for Bulwark](https://github.com/bulwarkmail/plugins/blob/main/WRITING_PLUGINS.md) in the plugins repository. Its tables are generated from the webmail source.

## Lifecycle

1. **Turn plugins on:** plugins are off for the whole instance until an admin turns them on in the admin console.
2. **Install:** an admin uploads a plugin ZIP from the admin console or installs it from the [extension marketplace](/docs/guides/marketplace). If the admin allows user uploads, users can also upload a plugin under Settings > Add-ons.
3. **Validate:** on upload, Bulwark checks the manifest, the file types and sizes in the ZIP, and refuses unknown permissions or a plugin that needs a newer webmail (`minAppVersion`). When the code contains `eval(`, `new Function(`, `document.cookie`, `document.write` or an `innerHTML` assignment, an admin upload or marketplace install is refused; a user's own upload installs with a warning.
4. **Consent or approval:** a plugin an admin installed is managed: users aren't asked to consent, and the admin can force it on for everyone or leave it for each user to turn on. A user upload shows the user a consent dialog with the plugin's permissions. When the admin requires approval (the default), a user's plugin only runs after the admin approved that exact package. The approval is pinned to a hash of the manifest and the code, so a changed package needs approving again.
5. **Configure:** users set a plugin's own settings on its page under Settings > Add-ons, admins set its admin configuration on the plugin's page in the admin console. Both forms are generated from schemas in the manifest.
6. **Run:** the enabled plugin loads in a sandboxed frame, registers its hooks, actions and slots, and talks to the app only through the host API.

## Development workflow

Plugins can be developed with hot reload outside the registry:

- Set `PLUGIN_DEV_DIR=/path/to/plugins-src` to load every subfolder of that directory as a plugin.
- Bulwark bundles the plugin's `src/` entry point with **esbuild** on each request, so a browser reload picks up changes. No separate build step is needed.
- Dev plugins show up in the admin plugin list next to installed ones and are enabled the same way.
- Try a plugin in a production build before you release it. In `next dev` the plugin frames get `allow-same-origin` so the dev server can hydrate them, and things that work there can fail in the real sandbox.

The plugins repository has a build script that packages a plugin into its ZIP, a fake `api` for unit tests, Playwright helpers for end-to-end tests and a Docker setup with test services. `hello-world` is the smallest example, and `slot-showcase` fills every surface.

## How a plugin runs

Each plugin runs in an iframe with `sandbox="allow-scripts"` and nothing else. Its origin is opaque, so it has no cookies, no `localStorage` and no access to the webmail page. A hidden background frame runs the plugin's hooks and its `activate` function, and every place the plugin draws into gets a frame of its own. Everything else goes through the `api` object, and the host checks the plugin's permissions on every call.

The sandbox's Content Security Policy blocks direct network access, remote images, web fonts and form posts. A plugin reaches the network only through the host (see [Network access](#network-access)).

React and the plugin API come from the host. The host also copies its theme into each frame, so a plugin follows light, dark and custom themes and the user's language, including right-to-left layouts.

## The app's controls

From the release after 1.14.2, plugins draw their UI with the app's own components from `@plugin-host/ui`: buttons, text fields, selects, check boxes and switches, settings rows, tabs, lists, info bars, badges, alerts, side panels, detail rows and a change preview, among others. The sandbox provides them like React, so they add nothing to the bundle, match the app version they run in and take their colours from the theme.

```js
import { Stack, Field, Input, DialogButtons } from '@plugin-host/ui';
```

Plugin dialogs opened with `api.ui.openDialog` look like the app's own dialogs. The host draws the title, the plugin's name, the close button and the footer, and the plugin declares the footer buttons with `DialogButtons`.

## Surfaces

A plugin can show up in about 50 places. There are three kinds:

- **Frame:** the plugin renders a React component in its own sandboxed frame. Used for banners, panels, sections and pages.
- **Action:** the plugin declares buttons or menu entries as data with `api.ui.setActions`, and the host draws them in its own style. A click reaches the plugin's `onAction` hook. An action can carry a `badge`, a whole number the host shows as a count on the button, or after the label in a menu; `0` shows none.
- **Data:** the plugin hands the host plain data to draw, such as labels and dots on calendar days.

| Area | Surfaces | Permission |
| --- | --- | --- |
| App | `app-top-banner` | `ui:app-top-banner` |
| | `command-palette` | `ui:commands` |
| | `app-page` (own page with a navigation rail entry) | `ui:app-page` |
| | `plugin-dialog` | none (opened by the plugin) |
| | `app-side-panel` (a side panel next to Calendar, Contacts, Files and Settings, from 1.20) | `ui:side-panel` |
| Navigation | `navigation-rail-bottom` | `ui:navigation-rail` |
| | `sidebar-widget`, `sidebar-section`, `sidebar-section-actions` | `ui:sidebar-widget` |
| | `top-bar-actions` | `ui:toolbar` |
| Message list | `message-list-header`, `message-list-empty`, `message-row-actions`, `message-bulk-actions` | `ui:message-list` |
| | `toolbar-actions` | `ui:toolbar` |
| | `context-menu-email` | `ui:context-menu` |
| | `search-results` (data) | `email:read` |
| Reader | `reader-header`, `reader-below-subject`, `email-banner`, `reader-above-quote`, `thread-summary` | `ui:email-banner` |
| | `email-footer` | `ui:email-footer` |
| | `reader-actions` | `ui:toolbar` |
| | `email-detail-sidebar`, `email-details-section` | `ui:email-details` |
| | `attachment-actions`, `attachment-menu` | `email:read` |
| | `reader-selection-menu` (right-click on selected text) | `ui:context-menu` or `ui:toolbar` |
| Composer | `composer-toolbar`, `composer-toolbar-actions`, `composer-options-menu`, `composer-send-menu`, `composer-attach-menu`, `composer-selection-menu` | `ui:composer-toolbar` |
| | `composer-above-body`, `composer-below-body`, `composer-attachment-source` | `ui:composer-toolbar` or `ui:composer-sidebar` |
| | `composer-sidebar`, `composer-sidebar-right` | `ui:composer-sidebar` |
| Calendar | `calendar-event-actions`, `calendar-event-detail`, `calendar-event-form`, `calendar-day-header`, `mini-calendar-marks` | `ui:calendar-action` |
| Contacts | `contact-detail-section`, `contact-list-actions` | `ui:contacts` |
| | `contact-cryptokeys` | `ui:contact-cryptokeys` |
| Tasks | `task-detail-section`, `task-list-actions` | `ui:tasks` |
| Files | `file-actions`, `file-preview-section` | `ui:files` |
| Settings | `settings-section`, `settings-page` | `ui:settings-section` |
| Admin | `admin-plugin-page` | `ui:admin-page` or `admin:config` |

From 1.20 the side panel that sits next to the open message (`email-detail-sidebar`) has a sibling in the other views: `app-side-panel` shows next to Calendar, Contacts, Files and Settings, under a button at the end of each view's toolbar row. The plugin learns which view it is in and what the view shows (the open event, the open contact, the selected files and folder, or the settings page), each part only with the matching read permission. Phones and Settings below 1024 px have no room for it: there the panel button asks the plugin to open a dialog instead. Plugins ask for `ui:side-panel` as an optional permission, so older webmails still install them.

The composer's buttons, Options menu and Send menu are actions, so plugin entries look like the app's own. Options entries can be check items, and a composer button can have a keyboard shortcut that works while the composer has focus. When the composer is too narrow for its buttons, plugin buttons move into the Options menu.

The plugin reference lists the props and click context each surface passes, with screenshots of every one.

## Hooks

Hooks let a plugin react to what happens in the app, and change or stop some of it. Observer hooks are told after the fact, such as when a message is opened. Intercept hooks can stop an action by returning `false`, and transform hooks return a changed value. Some examples:

- **`onBeforeEmailSend`:** check a message before it is sent, or stop the send (the composer, quick replies and plugin forwards; not [phishing reports](/docs/guides/organisation/phishing-reports), calendar invitations or read receipts). From 1.20 the message says where it comes from (`surface`, `mode`), carries what the user wrote without the quoted original (`authoredText`), the recipients outside the organisation of the sending account (`externalRecipients`), and per attachment its blob, whether it is inline, the type its first bytes say (`sniffedType`) and, for plugins with `email:blob-read`, the first megabyte of a text file (`textExcerpt`). A handler that throws or times out stops the send. While a force-enabled plugin that checks sends is loading, failed to start or was turned off after errors, Bulwark waits up to 8 seconds and then doesn't send at all; the message is built after that wait, so a check that was still starting gets all of it. A [classification label](/docs/guides/organisation/classification-labels) is added after every plugin, so a plugin can't change or drop it. The [Send checks](/docs/guides/organisation/send-checks) plugin is built on it
- **`onBeforeExternalLink`:** check, rewrite or stop a link before Bulwark opens it: in mail, the reader view, calendar events, contacts, notifications, the unsubscribe link and links other plugins open with `api.ui.openExternalUrl` (a plugin's own call doesn't come back to its own handler). From 1.20 the context carries the link's text (`text`). The link arrives as the browser parses it (`new URL(href).href`) and that exact string opens. A handler that throws or times out lets the link open, so a check that must hold a link returns `false` and opens it itself. The [link check](/docs/guides/organisation/link-check) is built on it
- **`onAvatarResolve`:** provide an avatar URL for a sender
- **`onBeforeComposeOpenToReply`** and its siblings - change a message before it fills the composer for a reply or forward
- **`onBeforeBlobUpload`:** divert an attachment to external storage before it reaches the server
- **`onRenderEmailBody`:** change how a message body is shown
- **`onEmailListItemRender`:** add badges to message rows
- **`onProvideSearchResults`:** add results to a mail search. They show above the message list, grouped per plugin. A click reaches `onAction` with the surface `search-results`, and an entry with `email: { id, accountId }` opens that message instead
- **`onSieveScriptGenerate`:** add a section to the server-side filter script next to the user's own rules
- **`onAction`**, **`onNotificationClick`**, **`onOAuthCallback`** - react to clicks on the plugin's actions and notifications, and complete its own OAuth flow

There are hooks for the message list, reading, writing, sending, organising, folders, search, attachments, new mail, calendar, contacts, tasks, files, settings, identities, filters, out of office, templates, sign-in, navigation, theme and language, notifications, the app lifecycle, layout, the keyboard and inbox tabs. The plugin reference lists them all.

## APIs

Beyond hooks, a plugin calls into the host through `api`, which `activate` receives and `require('@plugin-host')` returns. The main groups, each behind its own permission:

- **Mail:** `api.email`, `api.mailboxes` and `api.drafts` read, move and archive messages and save drafts; `api.jmap` handles keywords and blob uploads
- **Attachment text and images:** from 1.20, `api.email.getAttachmentText` (`email:blob-read`) returns the text of a message's attachment, read in the webmail: PDF (up to 50 pages), Word, Excel, PowerPoint, OpenDocument, text, CSV, HTML, calendar and contact files, at most 100,000 characters, with a status for files that are too big, encrypted, scanned or of a kind it can't read. `api.email.getAttachmentImage` (`email:blob-read`) returns an image attachment or inline image made smaller (1,568 px on the long edge by default, at most 1.5 MB) as base64, skips tracking pixels and tiny images, never fetches remote images, and adds a photo's date and place only when the plugin asks. Inline images in a message view now carry their `cid` and alt text. Both 30 calls a minute
- **Conversations:** from 1.20, `api.email.getThread` (`email:read`) returns every message of a message's conversation, oldest first, at most the newest 50, and `api.email.getThreadCount` (`email:read`) says how many messages it has without reading them. `api.email.search` takes a `position` to page through results
- **List selection:** from 1.20 the panel next to the open message (`email-detail-sidebar`) gets a `listSelection` prop with `email:read`: the messages ticked in the list when two or more are, at most 50 by id and account, and how many in all
- **Composing:** `api.compose.open` opens a new message filled in, and `api.compose.reply` opens a reply to the open message with text to start from
- **The message being written:** from the release after 1.14.2, `api.composer` reads the text or selection of the message the user is writing and replaces it. It only works in the composer that handed the plugin its id (a click on one of the plugin's composer actions or a composer slot), leaves the signature and the quoted message alone, and each change is one undo step. `api.composer.attach` adds a file through the composer's usual checks.
- **Calendar, tasks, contacts:** `api.calendar`, `api.tasks`, `api.contacts` and `api.addressBooks`
- **Account data:** `api.templates`, `api.identities`, `api.vacation`, `api.user` and `api.sieve`
- **Keywords and labels:** read and set message keywords, and add or reorder the user's label definitions (see [below](#keywords-and-labels))
- **UI:** `api.ui` opens confirm, prompt and plugin dialogs, sets actions, calendar day labels and pages, titles the plugin's sidebar section, offers files for download and opens external links in a new tab. From 1.20 `api.ui.openDialog({ fill: true })` opens a dialog as tall as the window allows, with the plugin's frame filling it, for a chat whose input stays at the bottom
- **Side panel in other views:** from 1.20 the `app-side-panel` slot (`ui:side-panel`) shows next to Calendar, Contacts, Files and Settings. `api.ui.openPanel`, `closePanel` and `togglePanel` open and close it, as they do the composer's and the reader's panels. Its props name the view and what it shows, each part only with its read permission (`calendar:read`, `contacts:read`, `files:read`)
- **Notifications:** `api.toast` shows toasts; `api.notifications.show` shows a system notification (or a toast, when the user hasn't allowed them) that names the plugin and is listed in the notifications panel. A notification can carry a link, but only to a server the plugin already talks to.
- **Storage and settings:** `api.storage` keeps up to 1 MB per account, `api.plugin.settings` holds the user's settings and `api.config.get` the admin's non-secret configuration. `api.admin.getConfig` returns no secret fields either, also when the user is signed in to the admin console: secrets are for the [credential proxy](#network-access) only
- **Host:** `api.host.features` says which of Bulwark's own features are on: the External label and recipient warning, and from 1.20 `noThirdPartyTraffic`, so a plugin can turn an outside service off when the admin turned [third-party traffic](/docs/guides/organisation/third-party-traffic) off
- **Invitations, filters, batches and settings:** from 1.20 `api.calendar.respond` (`calendar:respond`) answers an invitation in the user's own mail the way the reader's banner does, so the server sends the reply to the organiser; it refuses invitations whose sender doesn't check out, events the user organises and mail of shared mailboxes. `api.calendar.deleteEvent` returns an undo token for a single event of the user's own calendars, for `api.calendar.undoDelete`. `api.filters.list` and `api.filters.create` (`filters:read`, `filters:write`) read and add rules of Settings > Filters; a plugin's rule can move, copy, mark read, star, tag or stop, never forward, redirect, reject or discard. `api.email.batch` (`email:write`) archives, moves, marks or tags up to 200 messages in one change with one undo. `api.app.describeSettings` (`settings:read`) and `api.app.setSettings` (`settings:change`) describe and change settings from an allow-list of about 150, never ones the admin locked; `senderFavicons` and `showAvatarsInJunk` may only be switched off. Each change returns an undo token that works once, for 30 minutes, for that plugin only
- **Rules for every plugin:** from 1.20 `api.vacation.set` refuses to switch the out-of-office reply on while it forwards mail, or while the webmail can't read whether it does; `api.vacation.get` says which (`forwardActive`). Batch moves and archives, and a filter's move or copy, never go into a folder shared with other people; when the webmail can't read a folder's sharing, it refuses
- **Host feature flags for the newer calls:** from 1.20 `api.host.features` also says which of the calls above the webmail offers: `attachmentText`, `attachmentImages`, `threads` (`getThread` and `getThreadCount`), `listSelection`, `sidePanel`, `answerInvitation`, `filterRules` (the server has filters), `batchMail` and `changeSettings`. `sidePanel`, `answerInvitation` and `changeSettings` are per plugin: `true` only once the plugin holds `ui:side-panel`, `calendar:respond` or `settings:change`, so a plugin turned on before an update added the permission sees `false` until the user turns it off and on. Older webmails don't send these flags, so a plugin reads them as `=== true` and hides what isn't there. The [AI assistant](/docs/features/ai-assistant) works this way
- **Network:** `api.http`, `api.proxy` and `api.oauth` (see [Network access](#network-access))
- **Encryption:** `api.crypto` and the raw blob and send methods, for privileged plugins only (see [Privileged tier](#privileged-tier))

<!-- TODO(D): host calls and flags of Files -->

### Keywords and labels

Sandboxed plugins that bring in provider-side labels use the `api.keywords` and `api.jmap` keyword facades from `@plugin-host`. The comment on each call names the permission it needs:

```js
const api = require('@plugin-host');

const known = await api.keywords.list();                 // settings:read
const scan = await api.jmap.getKeywords();               // email:read
const providerLabel = scan.labels
  .find((label) => label.id.startsWith('$label:'));
if (providerLabel) {
  await api.keywords.add([{                              // settings:write
    id: providerLabel.id.slice('$label:'.length),
    label: providerLabel.name,
    // color is optional; Bulwark picks a palette colour when omitted
    visibility: 'show',
  }]);
}
const current = await api.keywords.list();               // settings:read
await api.keywords.reorder(current.map(({ id }) => id), { // settings:write
  caseSensitive: false, // default
});
const counts = await api.keywords.refreshCounts();        // email:read

// Complete replacement: keywords omitted here are removed from the message.
await api.jmap.setKeywords('email-id', {                 // email:write
  '$seen': true,
  '$label:provider-label-id': true,
});
await api.jmap.setKeyword('email-id', '$label:work');     // email:write
await api.jmap.removeKeyword('email-id', '$label:work');  // email:write
```

- `jmap.getKeywords()` is a narrow read-only facade, not a general JMAP request API. When the server advertises `https://bulwarkmail.com/ns/jmap/keywords`, it returns every cached keyword with exact total and unread counts and provider-label metadata, empty provider labels included. Without that capability it falls back to a bounded scan of message keywords. `keywords.discover()` keeps its original message-scan response for compatibility.
- `jmap.setKeywords()` replaces one message's complete keyword map through `Email/set`. Omitted keywords are removed, so use `jmap.setKeyword()` and `jmap.removeKeyword()` for incremental edits. The older `email.setKeyword()` and `email.removeKeyword()` names remain as aliases.
- `keywords.add()` is append-only and matches ids case-insensitively. It returns the added and skipped definitions and never overwrites the user's existing label name, colour, visibility or order.
- `keywords.reorder()` takes a complete permutation of the existing label ids and changes only their order. Missing, unknown or duplicate ids are rejected without changing settings. Matching is case-insensitive unless you pass `{ caseSensitive: true }`. Keyword discovery reports whether its bounded scan was complete.

## Network access

A plugin frame can't make requests of its own. It has three ways out, each declared in the manifest:

- **`api.http.fetch`** (`http:fetch`) - requests to the origins listed in `httpOrigins`, sent from the browser without cookies. The other site has to allow the webmail's origin through CORS. The URL is checked again after redirects.
- **`api.http.post`** (`http:post`) - requests to the webmail's own `/api/` routes listed in `apiPostPaths`, with the user's login. Admin, auth, settings, plugin and similar routes are never allowed, whatever the manifest says.
- **`api.proxy.fetch`** (`http:proxy`) - requests through Bulwark's server with an account or API key declared under `credentials`. The secret stays on the server and is only sent to the credential's own origin, and the plugin never sees it. A user-scope credential is an account each user connects in a dialog the host draws; an admin-scope credential is a `secret` field in the plugin's admin configuration. The proxy supports streaming, upload progress and WebDAV methods, and has per-user rate limits.

The proxy only reaches public addresses. To let plugins reach a server on your own network, such as a Nextcloud on the LAN, list its origin in `PLUGIN_PROXY_PRIVATE_ORIGINS` (comma separated, for example `http://nextcloud.lan:8080`). Those origins may also be plain http.

Never put a secret in a plugin's user settings or `api.storage`. Both are kept unencrypted in the browser. Use a credential instead.

## `frameOrigins` and CSP

Plugins that embed external UIs (e.g., a Jitsi room, a video player) declare allowed embed origins in their manifest:

```json
{
  "id": "my-plugin",
  "version": "1.0.0",
  "frameOrigins": ["https://meet.example.com", "https://*.video.example.com"]
}
```

Entries are https origins, optionally with a port or one level of `*.` subdomain wildcard, with no path and no IP address. Invalid entries are dropped with a warning. The proxy reads the union of `frameOrigins` from all enabled plugins and merges it into the host CSP `frame-src` at runtime, so the host CSP doesn't have to know about specific embed providers. `httpOrigins` takes the same format.

## Permissions

Plugins declare the permissions they need in the manifest. An admin sees that list before enabling anything, and a user sees it in the consent dialog, with high-risk permissions listed first and marked. Without a permission, an API call is refused, a hook isn't registered, a surface isn't drawn, and props or click context that need the permission are left out.

**Mail and composing:** `email:read`, `email:write`, `email:send`, `email:forward` (forward a message without the composer; the host asks the user once per address), `compose:open`, `compose:read`, `compose:write`.

**Other data:** `calendar:read/write`, `contacts:read/write`, `files:read/write`, `identity:read/write`, `filters:read/write`, `tasks:read/write`, `templates:read/write`, `vacation:read/write`, `settings:read/write`, `security:read`, `account:read`, `directory:read` (look people up in the server's directory). From 1.20 also `calendar:respond` (answer invitations; the answer goes to the organiser) and `settings:change` (change the user's settings from the allow-list). The consent dialog now names `settings:write` "Change your tags": it adds, renames and reorders tags and can stop settings changes, but changes no other settings.

**Sign-in:** `auth:observe` (be told about sign-in, account switches and session renewal) and `auth:emit` (sign the user out).

**UI:** `ui:toolbar`, `ui:app-top-banner`, `ui:email-banner`, `ui:email-footer`, `ui:email-details`, `ui:message-list`, `ui:message-list-tabs`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:calendar-action`, `ui:contacts`, `ui:contact-cryptokeys`, `ui:tasks`, `ui:files`, `ui:commands`, `ui:app-page`, `ui:admin-page`, `ui:keyboard`, `ui:download-file`, `ui:notifications`, and from 1.20 `ui:side-panel` (a panel next to Calendar, Contacts, Files and Settings).

**Network and admin:** `http:fetch`, `http:post`, `http:proxy`, `admin:config`.

`ui:observe` and `app:lifecycle` are granted implicitly and don't belong in a manifest.

From 1.20 a manifest can also list `optionalPermissions`: permissions the plugin uses when the webmail offers them. A webmail that knows them grants them like the others, consent dialog included, and leaves out the ones it doesn't know with a warning; older webmails ignore the field. A plugin built this way installs on older webmails too and checks `api.host.features` before it uses the newer calls. A permission an older webmail doesn't know in `permissions` itself refuses the install there.

The consent dialog marks these as high risk: `email:read` (it covers every message in the account, not only the open one), `email:send`, `email:forward`, `identity:write`, `filters:write`, `vacation:write`, `http:fetch`, `http:post`, `http:proxy`, and the permissions below.

| Permission              | What it grants                                                    |
| ----------------------- | ----------------------------------------------------------------- |
| `crypto:full`           | Same-origin execution with full access, including private keys. Privileged tier only |
| `email:raw-send`        | Send complete messages the plugin built itself, such as signed or encrypted ones |
| `email:blob-read`       | Read attachments and the full source of messages the user acts on, and files the user attaches |
| `email:blob-write`      | Upload files and replace an attachment before the message is sent |
| `email:render-takeover` | Replace the shown text of opened messages and of the message list, for example with decrypted content |
| `calendar:respond`      | Answer calendar invitations; the answer goes to the organiser by email (from 1.20) |
| `settings:change`       | Change how the app looks and works, such as the theme or the time format; settings the organisation set stay as they are (from 1.20) |

### Privileged tier

The privileged tier exists for end-to-end encryption plugins that must run WebCrypto and IndexedDB in their own frame. A plugin asks for it with `"tier": "privileged"` and the `crypto:full` permission, and gets it only when an admin installed it. The bundle is signed at install time and checked on every download. A user upload is never privileged, and a privileged request that fails a check is refused, not downgraded.

The privileged frame is same-origin with the webmail, which amounts to full access. Only install audited code this way. If a submission asks for the privileged tier without an S/MIME or OpenPGP story behind it, that alone is grounds for rejection.

## Admin console

<img class="theme-light-only" src="/screenshots/light-admin-plugins.webp" alt="The Plugins section of the admin console" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-plugins.webp" alt="The Plugins section of the admin console" width="5120" height="2880" />

The Plugins and Themes pages of the admin console give you:

- **Listing:** installed plugins, each with its own page for availability, permissions, configuration and earlier versions to roll back to
- **Instance switches:** turn plugins on for the instance, allow or block user uploads, and require approval for user uploads
- **Approvals:** review and approve the plugin packages users uploaded
- **Forced enable / disable:** lock plugins on or off for all users
- **Plugin configuration:** each plugin's admin settings, including secrets for admin-scope credentials, and its own admin page if it has one
- **Audit log:** every plugin enable, disable and config change is recorded

## Themes

Themes use the same delivery pipeline as plugins:

- Uploaded as ZIP bundles
- Forced enable / disable per theme
- Admin locks to prevent users from overriding the chosen theme

## Official plugins

The [plugins repository](https://github.com/bulwarkmail/plugins) holds the official plugins. Most of them are in the [marketplace](/docs/guides/marketplace); the team inbox plugin isn't yet, so an admin installs it by uploading its ZIP. Among them:

- **Nextcloud:** attach files from Nextcloud, send large files as share links, save attachments and messages there
- **Paperless-ngx:** send attachments and messages to Paperless and attach documents from it
- **Email to task:** turn a message into a task in Bulwark, Vikunja, Todoist or a CalDAV task list
- **AI Assistant:** a chat next to your mail, calendar, contacts and files that writes, summarises, looks things up and does small tasks, with an OpenAI-compatible service or Anthropic (see [AI assistant](/docs/features/ai-assistant))
- **S/MIME:** sign, encrypt, verify and decrypt messages (privileged tier)
- **Jitsi Meet:** add a meeting link to calendar events
- **Package tracking**, **Birthday reminders**, **Calendar agenda**, **Time zone helper**, **Translate**, **Quick notes**
- **External link warning**, **Reply-all guardrail**, **Spam score**, **Impersonation notice**
- **Gravatar** and **Libravatar** avatars (the Libravatar entry in the marketplace is a community upload, not the repository's plugin)

The **External mail warning** plugin is retired: Bulwark labels mail from outside the organisation and confirms external recipients itself, see [External mail](/docs/guides/organisation/external-mail).

## Security summary

- Plugins run in a sandboxed frame with an opaque origin. They can't read the webmail's cookies, storage or page, the user's password or the JMAP session.
- The host checks permissions on every call, and the user or admin sees every permission before a plugin runs.
- Plugins are off until an admin turns them on, and user uploads need admin approval by default, pinned to the exact package.
- Network access goes only to declared origins, declared webmail routes and declared credentials. Secrets for credentials stay on the server.
- HTML a plugin hands the host (message bodies, signatures, templates, compose bodies) is sanitised, and links open in a new tab only.
- `frameOrigins` are validated and merged into the CSP `frame-src`.
- Only a signed-in admin can use the admin controls.

## Marketplace

To browse and install from a curated directory, see the [extension marketplace](/docs/guides/marketplace) guide.
