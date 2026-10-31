---
title: Extension marketplace
description: Browse and install plugins and themes from a configurable extension directory.
order: 10
edition: full
editionNote: "Lite has no admin console to browse from, and plugins don't run in Lite at all."
---

# Extension marketplace

Installing a plugin used to mean finding a ZIP, downloading it, and uploading it again. The marketplace does that from inside the admin dashboard. Bulwark uses the official directory unless you point it at one you run yourself.

## Configuration

`EXTENSION_DIRECTORY_URL` defaults to `https://extensions.bulwarkmail.org`. Point it at your own directory to use that instead:

```env
EXTENSION_DIRECTORY_URL=https://extensions.example.com
```

An empty value also means the official directory. The admin console has a **Marketplace** page under Extensions, next to Plugins and Themes, and it is always there. If the directory can't be reached, the page says it failed to connect and offers **Retry**; direct ZIP uploads keep working.

With `NO_THIRD_PARTY_TRAFFIC` on, Bulwark doesn't contact the official directory, and the Marketplace page says so. Only a self-hosted directory works then.

**Installing from the marketplace is restricted to the admin dashboard.** Users can't browse it. If the admin allows user uploads, users can still upload a plugin ZIP themselves under Settings > Add-ons, and by default it only runs after an admin approved it (see [Plugins](/docs/guides/plugins#lifecycle)).

## Using the marketplace

<img class="theme-light-only" src="/screenshots/light-admin-marketplace.webp" alt="The marketplace in the admin dashboard" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-marketplace.webp" alt="The marketplace in the admin dashboard" width="5120" height="2880" />

1. Sign in to the admin dashboard.
2. Open **Marketplace**.
3. Search, or filter by Plugins or Themes. You can sort by Newest, Most downloaded or Recently updated.
4. Open an extension to see its description, permissions, changelog and versions.
5. Choose **Install**, on its card or next to a version on its page.

Before installing, Bulwark checks the bundle's directory signature and its SHA-256, refuses a version made for another Bulwark release, asks before installing a version the publisher withdrew, and scans the code for dangerous patterns. When it refuses, the page shows the reason. There is no "trusted directory bypass".

An installed extension is available to users right away; an update keeps its previous settings. Turn it off, or force it on for everyone, on its page under Plugins or Themes. Users only get plugins once plugins are switched on for the instance under Plugins > Plugin policy, which is off by default.

## Hosting your own directory

The directory protocol is an HTTP API serving JSON manifests. Run your own when you want to:

- Maintain an internal catalog of approved plugins for your organization
- Host private themes restricted to your deployment
- Air-gap your Bulwark deployment from the public internet

The directory is the [extensions-directory](https://github.com/bulwarkmail/extensions-directory) project. Bulwark talks to its `/api/v2` endpoints; run that project and point `EXTENSION_DIRECTORY_URL` at it.

## Safety model

The marketplace does **not** implicitly trust the directory:

- A bundle needs a valid directory signature whenever Bulwark knows the directory's root keys: they are built in for the official directory, and `EXTENSION_DIRECTORY_ROOT_KEYS` sets them for your own. The bundle must also match the SHA-256 the directory lists.
- All installed bundles run through the same JS pattern scanner used for direct admin uploads.
- Plugins must declare permissions; admins see them on the extension's page before installing.
- The HTTP proxy enforces declared origin allowlists at runtime.
- `frameOrigins` in the plugin manifest are strictly validated as `https://host` and merged into the host CSP `frame-src` only when the plugin is enabled.

See [Plugins](/docs/guides/plugins) for the full plugin security model.

## Updates

When a newer version of an installed plugin is published in the directory, the marketplace surfaces an update prompt. Updates are not automatic - admins approve each update so a malicious or breaking new version can't roll out without review.

## Related pages

- [Plugins](/docs/guides/plugins) - plugin architecture, hooks, and security
- [Customization](/docs/guides/customization) - themes and branding
- [Admin dashboard](/docs/guides/admin) - admin UI overview
