---
title: Introduction
description: Build plugins and themes for Bulwark Webmail and publish them on the Bulwark Extensions directory.
order: 1
---

# Extensions

Bulwark Webmail can be extended with two kinds of third-party add-ons:

- **Plugins** - add hooks, UI buttons, sidebar apps, keyboard shortcuts, and whole new workflows that integrate with the JMAP client.
- **Themes** - customize fonts, colors, and layouts to reshape the look and feel of the inbox.

Both are published on the [Bulwark Extensions directory](https://extensions.bulwarkmail.org/), which hosts free and open source extensions that have passed review.

## What you'll find in these docs

- **[manifest.json reference](/docs/extensions/manifest)** - required fields, permissions, and metadata.
- **[REST API reference](/docs/extensions/api)** - the public API the directory exposes for querying and installing extensions.
- **[Submission guidelines](/docs/extensions/guidelines)** - rules, review process, and content policy for getting your extension published.
- **[Publishing & updates](/docs/extensions/publishing)** - how the review pipeline works and how to ship new versions.

## Getting started

### Plugins

Plugins are managed through Bulwark's admin dashboard. A plugin is a small JavaScript module with a declarative configuration schema, an optional set of UI extension points, and a permission manifest. See the [plugin system overview](/docs/guides/plugins) for the built-in architecture - the authoring model for third-party plugins follows the same conventions.

### Themes

A theme is a bundle of CSS overrides that target Bulwark's design tokens (the `--color-*` CSS variables defined in `app/globals.css`). You declare a theme in the same manifest format as a plugin, set `"type": "theme"`, and ship the stylesheet entry point.

## Design principles

- **Free and open source, always.** The directory will never accept paid or closed-source extensions.
- **Privacy first.** Extensions must not collect user data beyond what their declared permissions allow.
- **Minimum permissions.** Requesting more capabilities than an extension needs is grounds for rejection.
- **Auditable by default.** All source code must live in a public GitHub repository under an OSI-approved license.

Ready to ship? Read the [submission guidelines](/docs/extensions/guidelines) first, then [submit at extensions.bulwarkmail.org/submit](https://extensions.bulwarkmail.org/submit).
