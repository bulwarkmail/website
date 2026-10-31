---
title: Extensions overview
description: Build plugins and themes for Bulwark Webmail and publish them on the Bulwark Extensions directory.
order: 1
edition: full
---

# Extensions

Third parties can extend Bulwark Webmail two ways:

- **Plugins** - add hooks, UI buttons, sidebar apps, keyboard shortcuts, and whole new workflows that integrate with the JMAP client.
- **Themes** - change fonts, colors, and layout.

Both are published on the [Bulwark Extensions directory](https://extensions.bulwarkmail.org/), which lists free and open source extensions that have passed review.

## What you'll find in these docs

- **[manifest.json reference](/docs/extensions/manifest)** - required fields, permissions, and metadata.
- **[REST API reference](/docs/extensions/api)** - the directory's public API (v2), which Bulwark's Marketplace uses to list, install and update extensions.
- **[Submission guidelines](/docs/extensions/guidelines)** - rules, review process, and content policy for getting your extension published.
- **[Publishing and updates](/docs/extensions/publishing)** - how the review pipeline works and how to ship new versions.

## Getting started

### Plugins

Plugins need the full edition (not Lite) and are off until an admin turns them on in the admin dashboard. Admins install plugins from the Marketplace or by uploading a ZIP. Users can upload their own under Settings > Add-ons when the admin allows it; by default the admin has to approve such a plugin before it runs. A plugin is a small JavaScript module with a declarative configuration schema, an optional set of UI extension points, and a permission manifest. The [plugin system overview](/docs/guides/plugins) explains how plugins are installed and run. The full authoring guide, with every hook, UI surface and API call, is [Writing plugins for Bulwark](https://github.com/bulwarkmail/plugins/blob/main/WRITING_PLUGINS.md) in the bulwarkmail/plugins repository.

### Themes

A theme is a bundle of CSS overrides that target Bulwark's design tokens (the `--color-*` CSS variables defined in `app/globals.css`). A theme is a `manifest.json` with `"type": "theme"` and a `variants` list, plus a `theme.css` that sets the `--color-*` variables under `:root` (light) and `.dark` (dark). Other rules in `theme.css` are dropped. Theme API v2 themes can also declare tokens in the manifest and add a `skin.css` for component styles. See the [manifest reference](/docs/extensions/manifest#theme-only-fields).

## Design principles

- **Free and open source, always:** the directory will never accept paid or closed-source extensions.
- **Privacy first:** extensions must not collect user data beyond what their declared permissions allow.
- **Minimum permissions:** asking for more than the extension needs is grounds for rejection.
- **Auditable by default:** the source must live in a public repository on GitHub, GitLab or Codeberg under an OSI-approved license. The directory builds every bundle from that source.

When you are ready to ship, read the [submission guidelines](/docs/extensions/guidelines), then add your extension in the [directory's dashboard](https://extensions.bulwarkmail.org/dashboard/new).
