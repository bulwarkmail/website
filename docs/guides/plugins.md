---
title: Plugins
description: Plugin system for extending Bulwark with custom functionality.
order: 4
---

# Plugins

Bulwark includes an extensible plugin system that allows administrators to add custom functionality to the webmail interface.

## Plugin Architecture

Plugins are managed through the admin dashboard and support:

- **Schema-driven configuration** - Each plugin defines a configuration schema that generates an admin UI automatically
- **Calendar event action slots** - Plugins can add custom action buttons to calendar events
- **Theme extensions** - Plugins can provide custom themes that integrate with Bulwark's theming system
- **Security enforcement** - Plugins with dangerous JavaScript patterns are automatically blocked

## Admin Dashboard

The plugin and theme admin dashboard provides:

- **Plugin listing** - View all installed plugins with details in a resizable sidebar
- **Forced enable/disable** - Administrators can force-enable or force-disable plugins for all users
- **Admin locks** - Lock plugin settings to prevent user modification
- **Managed policy enforcement** - Apply plugin policies across the deployment
- **Harness tooling** - Development tools for testing and debugging plugins

## Built-in Plugins

### Jitsi Meet

The Jitsi Meet plugin adds video conferencing integration to calendar events:

- Adds a "Start Meeting" action button on calendar events with virtual locations
- Automatically detects Jitsi Meet URLs in event virtual location fields
- Configurable Jitsi server URL via the plugin configuration UI

## Plugin Configuration

Plugin settings are managed from the admin panel under the plugin management section. Each plugin's configuration is defined by its schema, which generates form fields automatically. Configuration changes take effect immediately.

## Security

Bulwark enforces strict security on plugins:

- Plugins are validated before loading to block dangerous JavaScript patterns
- Session secrets must meet minimum length requirements
- Plugin code runs in a sandboxed context
- Admin-only controls prevent unauthorized plugin modifications
