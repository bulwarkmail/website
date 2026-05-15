---
title: Plugins
description: Plugin system for extending Bulwark with custom functionality.
order: 4
---

# Plugins

Bulwark includes an extensible plugin system that lets administrators add custom functionality to the webmail interface - from extra calendar buttons and composer panels to integrations with external services. Plugins ship as ZIP bundles with a manifest, configuration schema, and frontend code.

## Lifecycle

1. **Install** - Upload a plugin ZIP from the admin dashboard, or install from the [extension marketplace](/docs/guides/marketplace). Install and uninstall are restricted to the admin dashboard since 1.6.2.
2. **Validate** - On upload, Bulwark scans the plugin code for dangerous JavaScript patterns and an admin policy check. Plugins that fail validation are rejected.
3. **Disabled by default** - Newly installed plugins are inert until an admin explicitly enables them. This prevents drive-by execution if someone gains write access to the registry directory.
4. **Configure** - The admin form is generated inline from the plugin's config schema. Changes take effect immediately.
5. **Run** - Enabled plugins load into the host app, can register slot renderers and intercept hooks, and can call out to external services through the sandboxed HTTP proxy or with the `http:fetch` permission via declared `httpOrigins`.

## Development Workflow

Plugins can be developed with hot-reload outside the registry:

- Set `PLUGIN_DEV_DIR=/path/to/plugins-src` to load plugins from a folder during development.
- Bulwark bundles the plugin's `src/` on demand with **esbuild** - no separate build step required.
- Hot-reload picks up changes without restarting the container.
- The plugin appears alongside registry plugins in the admin dashboard and can be enabled the same way.

The `repos/subway-surfers` directory in the webmail repository is the reference example for the `composer-sidebar` slot.

## Slots

Plugins render into named UI slots. Available slots include:

| Slot                    | Where                                | Permission            |
| ----------------------- | ------------------------------------ | --------------------- |
| `calendar-event-action` | Action button row on calendar events | `ui:calendar-event`   |
| `composer-sidebar`      | Side panel of the New Message dialog | `ui:composer-sidebar` |
| `email-banner`          | Banner row above the email viewer    | `ui:email-banner`     |
| `email-footer`          | Footer row below the email viewer    | `ui:email-footer`     |
| `sidebar-widget`        | Embed a small widget in the sidebar  | `ui:sidebar-widget`   |
| `settings-section`      | Add a section to the settings page   | `ui:settings-section` |
| `navigation-rail`       | Add an entry to the navigation rail  | `ui:navigation-rail`  |
| `context-menu`          | Inject items into context menus      | `ui:context-menu`     |
| `composer-toolbar`      | Add buttons to the composer toolbar  | `ui:composer-toolbar` |
| `toolbar`               | Add buttons to the global toolbar    | `ui:toolbar`          |

See `repos/subway-surfers` for a `composer-sidebar` example plugin.

## Hooks

Plugins can register both render and intercept hooks:

- **Render hooks** - render content into a slot when the host requests it (the `email-banner` slot receives `EmailReadView`, which includes parsed auth results from SPF/DKIM/DMARC)
- **Intercept hooks** - observe or transform user actions (send, reply, archive, etc.) before they execute
- **`onBeforeEmailSend`** - hook into the outgoing send pipeline; the `OutgoingEmail` it receives exposes `fromEmail` so plugins can branch on identity
- **`onAvatarResolve`** - provide a custom avatar URL for a sender; useful for company directory integrations
- **`auth:observe`** - read auth lifecycle events (login, switch, logout) without touching credentials
- **i18n API** - plugins ship their own translation bundles and can use the host's locale

## HTTP Proxy and `http:fetch`

Plugin code runs in the browser. Direct cross-origin requests would either expose user credentials or be blocked by CORS. Bulwark solves this with a server-side HTTP proxy:

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

Plugins declare permissions they need. Common categories:

- `email:read`, `email:write`, `email:send`
- `calendar:read`, `calendar:write`
- `contacts:read`, `contacts:write`
- `files:read`, `files:write`
- `identity:read`, `identity:write`
- `filters:read`, `filters:write`
- `tasks:read`, `tasks:write`
- `templates:read`, `templates:write`
- `smime:read`
- `vacation:read`, `vacation:write`
- `settings:read`, `security:read`
- `auth:observe`
- `ui:*` slot permissions (`ui:toolbar`, `ui:email-banner`, `ui:email-footer`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:keyboard`, `ui:calendar-event`)
- `http:fetch` paired with `httpOrigins` for outbound HTTP via the proxy

Admins can review the requested permissions when enabling a plugin. Settings sub-results in the settings sidebar fulltext search expose plugin settings directly.

## Admin Dashboard

The plugin and theme admin dashboard provides:

- **Listing** - view installed plugins with manifest details in a resizable detail sidebar
- **Forced enable / disable** - administrators can lock plugins on or off for all users
- **Admin locks** - pin plugin settings so users cannot override them
- **Managed policy enforcement** - apply plugin policies across the whole deployment
- **Audit log** - every plugin enable/disable/config change is recorded
- **Harness tooling** - local development and testing of plugins

## Themes

Themes use the same delivery pipeline as plugins:

- Uploaded as ZIP bundles
- Forced enable / disable per theme
- Admin locks to prevent users from overriding the chosen theme

## Bundled Plugins

### Jitsi Meet

The Jitsi Meet plugin adds video conferencing integration to calendar events:

- Adds a "Start Meeting" button in the `calendar-event-action` slot for events with virtual locations
- Auto-detects Jitsi Meet URLs in event virtual location fields
- Configurable Jitsi server URL via the schema-driven config UI

## Security Summary

- Plugins are validated for dangerous JS patterns before being accepted
- Plugins are disabled until an admin enables them
- Plugin code runs in a sandboxed browser context with no direct access to user credentials
- The HTTP proxy enforces origin allowlists and strips sensitive headers
- `frameOrigins` are strictly validated as `https://host` and merged into the CSP `frame-src`
- Strict session secret length validation
- All admin-only controls are protected behind admin authentication

## Marketplace

For browsing and installing plugins from a curated directory, see the [Extension Marketplace](/docs/guides/marketplace) guide.
