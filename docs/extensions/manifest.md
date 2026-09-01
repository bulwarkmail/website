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
  "id": "my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "description": "A short description.",
  "author": "githubUsername",
  "type": "sidebar-app",
  "permissions": ["email:read"],
  "entrypoint": "index.js",
  "minAppVersion": "1.7.0",
  "icon": "icon.png"
}
```

## Required fields

| Field         | Description                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`          | Unique slug - lowercase letters, numbers, and hyphens only (minimum 2 characters). Used in URLs and install paths. |
| `name`        | Human-readable name shown in the directory and admin UI.                                                           |
| `version`     | Semantic version (for example `1.0.0`). Must match a git tag in the source repo.                                   |
| `author`      | Author name or GitHub username.                                                                                    |
| `description` | Short summary of what the extension does.                                                                          |
| `type`        | For plugins, one of `ui-extension`, `sidebar-app`, or `hook`. For themes, `theme`.                                 |
| `permissions` | Array of permission strings the extension needs. Requesting more than necessary will be rejected.                  |
| `entrypoint`  | Relative path to the JavaScript entry module (for example `index.js`). Required for plugins.                       |

## Plugin-only fields

| Field            | Description                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tier`           | Either `untrusted` (default) or `privileged`. Declaring `privileged` opts into the same-origin execution tier and requires `crypto:full`, a signed bundle, and admin approval. Most plugins should omit this.                 |
| `minAppVersion`  | Minimum Bulwark version the plugin supports.                                                                                                                                                                                 |
| `settingsSchema` | Per-user settings rendered automatically in the plugin's settings UI. Each field has a `type` (`boolean`, `string`, `number`, or `select`), `label`, `description`, and optional `default`, `options`, `min`, `max`, `placeholder`, `required`. |
| `configSchema`   | Deployment-wide configuration that only admins can edit (same field format as `settingsSchema`). Use for server-level values such as OAuth client credentials.                                                               |
| `locales`        | Bundled translations keyed by BCP-47 locale tag (for example `"en"`, `"de"`, `"fr-CA"`). Registered automatically before `activate()` is called, so `api.i18n.t()` works out of the box.                                      |
| `frameOrigins`   | Array of strict origins the plugin needs to embed in iframes (for example `https://www.youtube-nocookie.com`; wildcards like `https://*.example.com:8443` are allowed). Validated at install time and merged into the host CSP `frame-src` only while the plugin is enabled. |
| `httpOrigins`    | Array of HTTPS origins the plugin may call through the sandboxed HTTP proxy via `api.http.fetch()` (requires the `http:fetch` permission). Same syntax as `frameOrigins`. The remote host must serve CORS headers permitting the webmail origin. |
| `apiPostPaths`   | Same-origin `/api/*` path prefixes the plugin may target via `api.http.post()` (requires the `http:post` permission). Without entries, `api.http.post` is rejected even with the permission.                                   |

## Theme-only fields

| Field        | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `variants`   | **Required.** Array containing `light`, `dark`, or both.                                        |
| `entrypoint` | Relative path to the theme stylesheet (typically `theme.css`).                                  |

### Theme API v2 (optional)

Themes can go beyond raw CSS by declaring `"apiVersion": 2` and using structured fields that are compiled into CSS at install time:

| Field        | Description                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `apiVersion` | `1` (default, raw CSS only) or `2`.                                                                  |
| `extends`    | Inherit tokens and CSS from another installed (or built-in) theme by id.                             |
| `tokens`     | Structured colour tokens, with optional `common`, `light`, and `dark` maps. Compiled into `--color-*` variables. |
| `derive`     | When `true`, missing standard tokens are derived automatically (for example `*-foreground` from contrast). |
| `density`    | Default UI density preset: `compact`, `normal`, or `touch`.                                          |
| `radii`      | Border-radius scale, emitted as `--radius-*` variables.                                              |
| `typography` | Font stacks and base size, emitted as `--font-*` variables.                                          |

A v2 theme may additionally ship an optional `skin.css` with component-level overrides on top of the compiled tokens.

## Optional metadata

| Field         | Description                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`        | Relative path to a square brand icon (PNG/SVG/WebP, ≤256 KB, 128×128 or larger recommended). Shown on marketplace cards and in the admin UI. |
| `banner`      | Relative path to a wide promo image (16:9 recommended, ≤512 KB), shown as the hero on the extension detail page.                             |
| `screenshots` | Up to 6 relative paths to screenshot images (each ≤512 KB, ≤2 MB total). Order is preserved.                                                 |

> **Source assets**
> When the directory ingests a submission, it pulls `icon`, `banner`, and `screenshots` straight from the source repo at the tag you submitted. There's no separate upload flow - keep these files inside your repository alongside `manifest.json`. These paths are metadata only and are not shipped inside the runtime ZIP.

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
| Settings  | `settings:read`, `settings:write`                                                                                                                                                                      |
| Security  | `security:read`                                                                                                                                                                                |
| Account   | `account:read`                                                                                                                                                                                 |
| UI        | `ui:toolbar`, `ui:app-top-banner`, `ui:email-banner`, `ui:email-footer`, `ui:email-details`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:calendar-action`, `ui:admin-page`, `ui:keyboard`, `ui:download-file`, `ui:message-list-tabs`, `ui:contact-cryptokeys` |
| Auth      | `auth:observe`, `auth:emit`                                                                                                                                                                    |
| Admin     | `admin:config`                                                                                                                                                                                 |
| HTTP      | `http:fetch` (paired with `httpOrigins`), `http:post` (paired with `apiPostPaths`)                                                                                                             |

`ui:observe` and `app:lifecycle` are granted to every plugin automatically. Listing them does nothing.

### Privileged permissions

`crypto:full`, `email:raw-send`, `email:blob-read`, `email:blob-write`, and `email:render-takeover` require `"tier": "privileged"`, a signed bundle, and an explicit high-risk consent step from the admin installing it. They exist for plugins that perform their own message cryptography. Requesting one without that justification will fail review.

## Validation

When you submit, the directory checks that:

1. The manifest is valid JSON with all required fields present.
2. `id` matches the slug format (lowercase alphanumeric with hyphens, minimum 2 characters).
3. `type` is one of the valid values (`ui-extension`, `sidebar-app`, `hook`, or `theme`).
4. Plugins declare an `entrypoint`; themes declare a non-empty `variants` array.
5. `permissions` contains only known permission strings.

The host also enforces bundle limits: plugins are capped at 5 MB and themes at 2 MB, only whitelisted file extensions are accepted, and theme CSS is scanned for disallowed patterns such as `@import` and remote `url(...)` references.

Directory-side checks (slug availability, git-tag verification, license validation) happen additionally at submission time - see the [submission guidelines](/docs/extensions/guidelines).
