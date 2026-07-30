---
title: Plugins
description: Plugin system for extending Bulwark with custom functionality.
order: 4
---

# Plugins

A plugin adds something to the interface that isn't in the box. An extra button on a calendar event, a panel down the side of the composer, a bridge to some service you already pay for. Each one ships as a ZIP bundle holding a manifest, a configuration schema and the frontend code itself.

## Lifecycle

1. **Install** - Upload a plugin ZIP from the admin dashboard, or install from the [extension marketplace](/docs/guides/marketplace). Install and uninstall are restricted to the admin dashboard.
2. **Validate** - On upload, Bulwark scans the plugin code for dangerous JavaScript patterns and an admin policy check. Plugins that fail validation are rejected.
3. **Disabled by default** - Newly installed plugins are inert until an admin explicitly enables them. This prevents drive-by execution if someone gains write access to the registry directory.
4. **Configure** - The admin form is generated inline from the plugin's config schema. Changes take effect immediately.
5. **Run** - Enabled plugins load into the host app, can register slot renderers and intercept hooks, and can call out to external services through the sandboxed HTTP proxy or with the `http:fetch` permission via declared `httpOrigins`.

## Development workflow

Plugins can be developed with hot-reload outside the registry:

- Set `PLUGIN_DEV_DIR=/path/to/plugins-src` to load plugins from a folder during development.
- Bulwark bundles the plugin's `src/` on demand with **esbuild** - no separate build step required.
- Hot-reload picks up changes without restarting the container.
- The plugin appears alongside registry plugins in the admin dashboard and can be enabled the same way.

## Slots

Plugins render into named UI slots. The slot name goes in the code; the permission goes in the manifest.

| Slot                      | Where                                     | Permission             |
| ------------------------- | ----------------------------------------- | ---------------------- |
| `toolbar-actions`         | Global toolbar                            | `ui:toolbar`           |
| `app-top-banner`          | Full-width banner above every page        | `ui:app-top-banner`    |
| `email-banner`            | Banner row above the email viewer         | `ui:email-banner`      |
| `email-footer`            | Footer row below the email viewer         | `ui:email-footer`      |
| `email-details-section`   | "More details" panel of an email          | `ui:email-details`     |
| `email-detail-sidebar`    | Sidebar alongside an opened email         | `ui:email-details`     |
| `composer-toolbar`        | Composer toolbar                          | `ui:composer-toolbar`  |
| `composer-sidebar`        | Side panel of the New Message dialog      | `ui:composer-sidebar`  |
| `composer-sidebar-right`  | Right-hand side panel of the same dialog  | `ui:composer-sidebar`  |
| `sidebar-widget`          | Small widget in the sidebar               | `ui:sidebar-widget`    |
| `settings-section`        | New section on the settings page          | `ui:settings-section`  |
| `context-menu-email`      | Items in the email context menu           | `ui:context-menu`      |
| `navigation-rail-bottom`  | Entry at the foot of the navigation rail  | `ui:navigation-rail`   |
| `calendar-event-actions`  | Action button row on calendar events      | `ui:calendar-action`   |
| `admin-plugin-page`       | The plugin's own page in the admin UI     | `ui:admin-page`        |

The `repos/subway-surfers` directory in the webmail repository is a working `composer-sidebar` example.

## Hooks

Plugins can register both render and intercept hooks:

- **Render hooks** - render content into a slot when the host requests it (the `email-banner` and `email-details-section` slots receive `EmailReadView`, which includes parsed auth results from SPF/DKIM/DMARC, plus the raw `headers` map and full message `source` under `email:read`)
- **Intercept hooks** - observe or transform user actions (send, reply, archive, etc.) before they execute
- **`onBeforeEmailSend`** - hook into the outgoing send pipeline; the `OutgoingEmail` it receives exposes `fromEmail` so plugins can branch on identity
- **`onAvatarResolve`** - provide a custom avatar URL for a sender; useful for company directory integrations
- **`auth:observe`** - read auth lifecycle events (login, switch, logout) without touching credentials
- **i18n API** - plugins ship their own translation bundles and can use the host's locale

## HTTP proxy and `http:fetch`

Plugin code runs in the browser, where a direct cross-origin request either leaks user credentials or dies on CORS. A server-side proxy sits in between:

- Plugins call `bulwark.http(...)` instead of `fetch`
- The host validates the URL against the plugin's declared `httpOrigins`
- The proxy adds the credentials the plugin is permitted to use (if any), strips others, and forwards the request

Authentication headers are never exposed to plugin code.

The `http:fetch` permission combined with the `httpOrigins` manifest field declares which origins a plugin is allowed to call. The proxy enforces the allowlist server-side; plugins cannot escape it from the browser.

## `frameOrigins` and CSP

Plugins that embed external UIs (e.g., a Jitsi room, a video player) declare allowed embed origins in their manifest:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "frameOrigins": ["https://meet.example.com", "https://video.example.com"]
}
```

Each entry must be a strict `https://host` origin. The proxy reads the union of `frameOrigins` from all enabled plugins and merges it into the host CSP `frame-src` at runtime, so the host CSP no longer has to know about specific embed providers.

## Permissions

Plugins declare the permissions they need in the manifest, and an admin sees that list before enabling anything.

**Data access:** `email:read`, `email:write`, `email:send`, `calendar:read/write`, `contacts:read/write`, `files:read/write`, `identity:read/write`, `filters:read/write`, `tasks:read/write`, `templates:read/write`, `vacation:read/write`, `settings:read/write`, `security:read`, `smime:read`.

**UI slots:** `ui:toolbar`, `ui:app-top-banner`, `ui:email-banner`, `ui:email-footer`, `ui:email-details`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:calendar-action`, `ui:admin-page`, `ui:keyboard`, `ui:download-file`, `ui:message-list-tabs`.

**Other:** `auth:observe`, `admin:config`, and `http:fetch` / `http:post` paired with `httpOrigins` for outbound requests through the proxy.

`ui:observe` and `app:lifecycle` are granted implicitly and don't belong in a manifest.

### Privileged tier

A handful of permissions are gated behind `tier: 'privileged'`, which means a signed bundle, admin approval, and an explicit high-risk consent step. They exist for plugins that do their own cryptography:

| Permission              | What it grants                                                    |
| ----------------------- | ----------------------------------------------------------------- |
| `crypto:full`           | Same-origin crypto execution, including access to private keys    |
| `email:raw-send`        | Submit a fully-formed RFC 822 message via JMAP                    |
| `email:blob-read`       | Read a message blob's raw bytes by `blobId`                       |
| `email:blob-write`      | Upload a blob to the server                                       |
| `email:render-takeover` | Replace the rendered body of an opened email                      |

Nothing on this list is appropriate for an ordinary plugin. If a submission asks for one without an S/MIME or OpenPGP story behind it, that alone is grounds for rejection.

## Admin dashboard

The plugin and theme dashboard gives you:

- **Listing** - view installed plugins with manifest details in a resizable detail sidebar
- **Forced enable / disable** - administrators can lock plugins on or off for all users
- **Admin locks** - pin plugin settings so users cannot override them
- **Managed policy enforcement** - apply plugin policies across the whole deployment
- **Audit log** - every plugin enable/disable/config change is recorded
- **Harness tooling** - run and test plugins locally

## Themes

Themes use the same delivery pipeline as plugins:

- Uploaded as ZIP bundles
- Forced enable / disable per theme
- Admin locks to prevent users from overriding the chosen theme

## Bundled plugins

### Jitsi Meet

The Jitsi Meet plugin adds video conferencing integration to calendar events:

- Adds a "Start Meeting" button in the `calendar-event-action` slot for events with virtual locations
- Auto-detects Jitsi Meet URLs in event virtual location fields
- Configurable Jitsi server URL via the schema-driven config UI

## Security summary

- Plugins are validated for dangerous JS patterns before being accepted
- Plugins are disabled until an admin enables them
- Plugin code runs in a sandboxed browser context with no direct access to user credentials
- The HTTP proxy enforces origin allowlists and strips sensitive headers
- `frameOrigins` are strictly validated as `https://host` and merged into the CSP `frame-src`
- Strict session secret length validation
- All admin-only controls are protected behind admin authentication

## Marketplace

To browse and install from a curated directory, see the [extension marketplace](/docs/guides/marketplace) guide.
