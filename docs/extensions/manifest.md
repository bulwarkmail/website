---
title: manifest.json reference
description: Required fields, permissions, and metadata for Bulwark extensions.
order: 2
---

# manifest.json reference

Every extension must include a `manifest.json` file in the repository root. The manifest is how Bulwark knows what the extension is, what capabilities it needs, and where its entry point lives.

## Example

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "version": "1.0.0",
  "type": "plugin",
  "pluginType": "sidebar-app",
  "description": "A short description.",
  "author": "githubUsername",
  "license": "MIT",
  "permissions": ["email:read"],
  "tags": ["productivity"],
  "minAppVersion": "1.0.0",
  "entryPoint": "index.js",
  "icon": "icon.png"
}
```

## Required fields

| Field         | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | Unique slug - lowercase, numbers, and dashes only. Used in URLs and install paths.                                                   |
| `displayName` | Human-readable name shown in the directory and admin UI.                                                                             |
| `version`     | Semantic version (for example `1.0.0`). Must match a git tag in the source repo.                                                     |
| `type`        | Either `plugin` or `theme`.                                                                                                          |
| `description` | Short summary of what the extension does. Max 200 characters.                                                                        |
| `license`     | SPDX identifier of an [OSI-approved license](https://opensource.org/licenses) (for example `MIT`, `Apache-2.0`, `GPL-3.0-or-later`). |
| `permissions` | Array of permission strings the extension needs. Requesting more than necessary will be rejected.                                    |

## Plugin-only fields

| Field           | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `pluginType`    | One of `hook`, `ui-extension`, or `sidebar-app`.                            |
| `entryPoint`    | Relative path to the JavaScript entry module (for example `index.js`).      |
| `minAppVersion` | Minimum Bulwark version the plugin supports. Used for compatibility checks. |

## Theme-only fields

| Field        | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `entryPoint` | Relative path to the theme stylesheet (typically `theme.css`). |

## Optional metadata

| Field          | Description                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `author`       | GitHub username of the author. Defaults to the submitter.                                                                                                    |
| `tags`         | Array of category tags. Allowed: `productivity`, `security`, `automation`, `appearance`, `integration`, `communication`, `developer-tools`, `accessibility`. |
| `icon`         | Relative path to a square icon (128×128 PNG or SVG).                                                                                                         |
| `screenshots`  | Array of relative paths to screenshot images.                                                                                                                |
| `homepage`     | URL to the extension's website or documentation.                                                                                                             |
| `frameOrigins` | Array of strict `https://host` origins the plugin needs to embed (merged into the host CSP `frame-src` only while the plugin is enabled).                    |
| `httpOrigins`  | Array of `https://host` origins the plugin is allowed to call through the sandboxed HTTP proxy (requires the `http:fetch` permission).                       |

> **Source assets**
> When the directory ingests a submission, it pulls `icon`, banner, and `screenshots` straight from the source repo at the tag you submitted. There's no separate upload flow - keep these files inside your repository alongside `manifest.json`.

## Permissions

Bulwark uses a declarative permission model. Each permission string takes the form `resource:action`. The directory shows these on the extension's listing so users can audit what an extension can do before installing.

| Category  | Permissions                                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Email     | `email:read`, `email:write`, `email:send`                                                                                                                                                              |
| Calendar  | `calendar:read`, `calendar:write`                                                                                                                                                                      |
| Contacts  | `contacts:read`, `contacts:write`                                                                                                                                                                      |
| Files     | `files:read`, `files:write`                                                                                                                                                                            |
| Identity  | `identity:read`, `identity:write`                                                                                                                                                                      |
| Filters   | `filters:read`, `filters:write`                                                                                                                                                                        |
| Tasks     | `tasks:read`, `tasks:write`                                                                                                                                                                            |
| Templates | `templates:read`, `templates:write`                                                                                                                                                                    |
| S/MIME    | `smime:read`                                                                                                                                                                                           |
| Vacation  | `vacation:read`, `vacation:write`                                                                                                                                                                      |
| Settings  | `settings:read`                                                                                                                                                                                        |
| Security  | `security:read`                                                                                                                                                                                        |
| UI        | `ui:toolbar`, `ui:email-banner`, `ui:email-footer`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:keyboard`, `ui:calendar-event` |
| Auth      | `auth:observe`                                                                                                                                                                                         |
| HTTP      | `http:fetch` (paired with the `httpOrigins` manifest field to declare the allowlist)                                                                                                                   |

## Validation

When you submit, the directory checks that:

1. The manifest is valid JSON with all required fields.
2. `name` is a valid slug and not already taken.
3. `version` matches an existing git tag on the referenced repository.
4. `license` is an OSI-approved SPDX identifier and a `LICENSE` file is present.
5. `permissions` contains only known permission strings.

If any of these fail, the submission is rejected with a machine-readable error.
