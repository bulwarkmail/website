---
title: Plugins
description: Plugin system for extending Bulwark with custom functionality.
order: 4
---

# Plugins

Bulwark includes an extensible plugin system that lets administrators add custom functionality to the webmail interface — from extra calendar buttons and composer panels to integrations with external services. Plugins ship as ZIP bundles with a manifest, configuration schema, and frontend code.

## Lifecycle

1. **Install** — Upload a plugin ZIP from the admin dashboard, or install from the [extension marketplace](/docs/guides/marketplace).
2. **Validate** — On upload, Bulwark scans the plugin code for dangerous JavaScript patterns. Plugins that fail validation are rejected.
3. **Disabled by default** — Newly installed plugins are inert until an admin explicitly enables them. This prevents drive-by execution if someone gains write access to the registry directory.
4. **Configure** — The admin form is generated from the plugin's config schema. Changes take effect immediately.
5. **Run** — Enabled plugins load into the host app, can register slot renderers and intercept hooks, and can call out to external services through the sandboxed HTTP proxy.

## Slots

Plugins render into named UI slots. Available slots include:

| Slot                    | Where                                | Permission              |
| ----------------------- | ------------------------------------ | ----------------------- |
| `calendar-event-action` | Action button row on calendar events | `ui:calendar-event`     |
| `composer-sidebar`      | Left panel of the New Message dialog | `ui:composer-sidebar`   |

The `composer-sidebar` slot was added in 1.5.2; see `repos/subway-surfers` for an example plugin.

## Hooks

Plugins can register both render and intercept hooks:

- **Render hooks** — render content into a slot when the host requests it
- **Intercept hooks** — observe or transform user actions (send, reply, archive, etc.) before they execute
- **`onAvatarResolve`** — provide a custom avatar URL for a sender; useful for company directory integrations
- **i18n API** — plugins ship their own translation bundles and can use the host's locale

## HTTP Proxy

Plugin code runs in the browser. Direct cross-origin requests would either expose user credentials or be blocked by CORS. Bulwark solves this with a server-side HTTP proxy:

- Plugins call `bulwark.http(...)` instead of `fetch`
- The host validates the URL against the plugin's declared allowed origins
- The proxy adds the credentials the plugin is permitted to use (if any), strips others, and forwards the request

Authentication headers are never exposed to plugin code.

## `frameOrigins` and CSP

Plugins that embed external UIs (e.g., a Jitsi room, a video player) declare allowed embed origins in their manifest:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "frameOrigins": [
    "https://meet.example.com",
    "https://video.example.com"
  ]
}
```

Each entry must be a strict `https://host` origin. The proxy reads the union of `frameOrigins` from all enabled plugins and merges it into the host CSP `frame-src` at runtime, so the host CSP no longer has to know about specific embed providers.

## Permissions

Plugins declare permissions they need. Slots are gated on permissions:

- `ui:calendar-event` — render in the calendar event slot
- `ui:composer-sidebar` — render in the composer sidebar slot
- `http:<origin>` — outbound HTTP to a specific origin via the proxy

Admins can review the requested permissions when enabling a plugin.

## Admin Dashboard

The plugin and theme admin dashboard provides:

- **Listing** — view installed plugins with manifest details in a resizable detail sidebar
- **Forced enable / disable** — administrators can lock plugins on or off for all users
- **Admin locks** — pin plugin settings so users cannot override them
- **Managed policy enforcement** — apply plugin policies across the whole deployment
- **Audit log** — every plugin enable/disable/config change is recorded
- **Harness tooling** — local development and testing of plugins

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
