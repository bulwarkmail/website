---
title: manifest.json reference
description: Required fields, permissions, and metadata for Bulwark extensions.
order: 2
edition: full
---

# manifest.json reference

Every extension has a `manifest.json` in its folder: the repository root, or for a repository with several extensions, the extension's subfolder. In the built ZIP it sits at the root. The manifest is how Bulwark knows what the extension is, what capabilities it needs, and where its entry point lives.

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
| `id`          | Unique slug: 2 to 64 lowercase letters, digits and hyphens, starting and ending with a letter or digit. Used in URLs and install paths. |
| `name`        | Human-readable name shown in the directory and admin UI.                                                           |
| `version`     | A semantic version such as `1.0.0`. A pre-release like `1.1.0-beta.1` is published on the beta channel. Each version can be published once; raise it for every release. |
| `author`      | Author name or GitHub username.                                                                                    |
| `description` | Short summary of what the extension does.                                                                          |
| `type`        | For plugins, one of `ui-extension`, `sidebar-app`, or `hook`. For themes, `theme`.                                 |
| `entrypoint`  | Relative path to the JavaScript entry module, a `.js` or `.mjs` file (for example `index.js`). Required for plugins; themes have none. |

## Plugin-only fields

| Field            | Description                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `permissions`    | The permissions the plugin needs (see [Permissions](#permissions)). Leave it out if it needs none. Requesting more than necessary will be rejected.                                                                          |
| `tier`           | Either `untrusted` (default) or `privileged`. Declaring `privileged` opts into the same-origin execution tier; it needs `crypto:full` and an admin install (see [Privileged tier](#privileged-tier-and-high-risk-permissions)). Most plugins should omit this. |
| `settingsSchema` | Per-user settings, drawn automatically in Settings. Keys are letters, digits and `_`, starting with a letter. Each field needs a `type` (`boolean`, `string`, `number` or `select`), a `label` and a `default` of that type, and may have a `description`. A `select` needs `options` (a list of strings that includes the default); a `number` may set `min` and `max`. |
| `configSchema`   | Settings only the admin sets, on the plugin's page in the admin dashboard. Field types are `string`, `secret`, `boolean`, `number` and `select`; each needs a `label` and may set `description`, `required`, `default` and `placeholder`. `select` options are `{ "label", "value" }` objects. A `string` field with `"multiline": true` gets a full-width text box. A `secret` is kept on the server and never reaches the plugin. |
| `credentials`    | Accounts and API keys the plugin uses through `api.proxy.fetch` (needs `http:proxy`). The server adds the secret to the request, so the plugin never sees it. An admin credential points at a `secret` field in `configSchema`; a user credential is one each user connects. See [Accounts and API keys](https://github.com/bulwarkmail/plugins/blob/main/WRITING_PLUGINS.md#accounts-and-api-keys) in the plugin guide. |
| `locales`        | Bundled translations keyed by BCP-47 locale tag (for example `"en"`, `"de"`, `"fr-CA"`). Registered automatically before `activate()` is called, so `api.i18n.t()` works out of the box.                                      |
| `frameOrigins`   | Array of strict origins the plugin needs to embed in iframes (for example `https://www.youtube-nocookie.com`; wildcards like `https://*.example.com:8443` are allowed). Validated at install time and merged into the host CSP `frame-src` only while the plugin is enabled. |
| `httpOrigins`    | Array of HTTPS origins the plugin may call through the sandboxed HTTP proxy via `api.http.fetch()` (requires the `http:fetch` permission). Same syntax as `frameOrigins`. The remote host must serve CORS headers permitting the webmail origin. |
| `apiPostPaths`   | Same-origin `/api/*` path prefixes the plugin may target via `api.http.post()` (requires the `http:post` permission). Without entries, `api.http.post` is rejected even with the permission.                                   |

## Theme-only fields

| Field        | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `variants`   | **Required.** Array containing `light`, `dark`, or both.                                        |

Themes have no `entrypoint`. The stylesheet is always a file named `theme.css` next to `manifest.json`, and the directory refuses a theme without one. Set the `--color-*` variables under `:root` (light) and `.dark` (dark); Bulwark drops every other rule in `theme.css`.

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

These work for plugins and themes.

| Field         | Description                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `minAppVersion` | The oldest Bulwark version the extension works with, like `1.15.0`. The directory doesn't offer the version to older Bulwarks, and they refuse to install it. |
| `icon`        | Relative path to a square brand icon (PNG/SVG/WebP, ≤256 KB, 128×128 or larger recommended). Shown on marketplace cards and in the admin UI. |
| `banner`      | Relative path to a wide promo image (16:9 recommended, ≤512 KB), shown as the hero on the extension detail page.                             |
| `screenshots` | Up to 6 relative paths to screenshot images (each ≤512 KB, ≤2 MB total). Order is preserved.                                                 |

> **Source assets**
> When the directory ingests a submission, it pulls `icon`, `banner`, and `screenshots` straight from the source repo at the commit you submitted. There's no separate upload flow - keep these files inside your repository alongside `manifest.json`. These paths are metadata only and are not shipped inside the runtime ZIP.

## Permissions

Bulwark uses a declarative permission model. Each permission string takes the form `resource:action`. The directory shows these on the extension's listing so users can audit what an extension can do before installing.

| Category  | Permissions                                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Email     | `email:read`, `email:write`, `email:send`, `email:forward`, `email:raw-send`, `email:blob-read`, `email:blob-write`, `email:render-takeover`                                                            |
| Compose   | `compose:open`, `compose:read`, `compose:write`                                                                                                                                                        |
| Calendar  | `calendar:read`, `calendar:write`                                                                                                                                                                      |
| Contacts  | `contacts:read`, `contacts:write`                                                                                                                                                                      |
| Files     | `files:read`, `files:write`                                                                                                                                                                            |
| Identity  | `identity:read`, `identity:write`                                                                                                                                                                      |
| Filters   | `filters:read`, `filters:write`                                                                                                                                                                        |
| Tasks     | `tasks:read`, `tasks:write`                                                                                                                                                                            |
| Templates | `templates:read`, `templates:write`                                                                                                                                                                    |
| Vacation  | `vacation:read`, `vacation:write`                                                                                                                                                                      |
| Settings  | `settings:read`, `settings:write`                                                                                                                                                                      |
| Security  | `security:read`                                                                                                                                                                                |
| Account   | `account:read`                                                                                                                                                                                 |
| Directory | `directory:read`                                                                                                                                                                               |
| UI        | `ui:toolbar`, `ui:app-top-banner`, `ui:email-banner`, `ui:email-footer`, `ui:email-details`, `ui:composer-toolbar`, `ui:composer-sidebar`, `ui:sidebar-widget`, `ui:settings-section`, `ui:context-menu`, `ui:navigation-rail`, `ui:calendar-action`, `ui:admin-page`, `ui:keyboard`, `ui:download-file`, `ui:message-list-tabs`, `ui:contact-cryptokeys`, `ui:notifications`, `ui:message-list`, `ui:contacts`, `ui:tasks`, `ui:files`, `ui:commands`, `ui:app-page` |
| Auth      | `auth:observe`, `auth:emit`                                                                                                                                                                    |
| Admin     | `admin:config`                                                                                                                                                                                 |
| HTTP      | `http:fetch` (paired with `httpOrigins`), `http:post` (paired with `apiPostPaths`), `http:proxy` (paired with `credentials`)                                                                    |
| Crypto    | `crypto:full` (for the privileged tier, see below)                                                                                                                                             |

`ui:observe` and `app:lifecycle` are granted to every plugin automatically. Listing them does nothing.

Naming a permission Bulwark doesn't know refuses the install. `smime:read`, which older plugins may still list, no longer grants anything (S/MIME is now a plugin); Bulwark drops it with a warning. What each permission allows, in the words of the consent dialog, is in the [permission table of the plugin guide](https://github.com/bulwarkmail/plugins/blob/main/WRITING_PLUGINS.md#permissions) and at [/api/v2/permissions](https://extensions.bulwarkmail.org/api/v2/permissions).

### Privileged tier and high-risk permissions

`"tier": "privileged"` runs the plugin same-origin with the webmail, for end-to-end encryption plugins that need WebCrypto and IndexedDB. It needs the `crypto:full` permission and an admin install. The bundle is signed at install time and checked on every download, and a plugin a user uploaded is never privileged. `api.jmap.fetchBlob`, `sendRaw`, `submitRaw`, `importRaw`, `api.upfiles.save` and `api.crypto.*` only work in this tier.

`email:raw-send`, `email:blob-read`, `email:blob-write` and `email:render-takeover` don't need the privileged tier. They are high-risk permissions, like `email:read`, `email:forward`, `http:fetch` and `http:proxy`: the consent dialog lists them first and marks them.

## Validation

When you submit, the directory checks that:

1. The manifest is valid JSON with all required fields present.
2. `id` matches the slug format (lowercase letters, digits and hyphens, starting and ending with a letter or digit).
3. `type` is one of the valid values (`ui-extension`, `sidebar-app`, `hook`, or `theme`).
4. Plugins declare an `entrypoint`; themes declare a non-empty `variants` array.
5. `permissions` contains only known permission strings.

Bulwark also enforces bundle limits. Bundles are capped at 5 MB for plugins and 2 MB for themes, with at most 200 files. Plugin files must be of the types `.js .mjs .css .json .png .svg .woff2 .jpg .jpeg .webp`. Theme CSS may not load anything: `@import`, `url(...)` (except a `#fragment`), `image-set()`, `expression()` and similar are removed with a warning, and `theme.css` keeps only rules on `:root` and `.dark`.

The directory also checks that the id is yours and matches the manifest, the repository is public, the version is new, and that it can build the bundle from source. See the [submission guidelines](/docs/extensions/guidelines).
