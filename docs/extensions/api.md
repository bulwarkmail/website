---
title: REST API reference
description: The public REST API of the Bulwark Extensions directory.
order: 3
---

# REST API reference

The Bulwark Extensions directory exposes a small read-mostly REST API that powers both the directory UI and the in-app extension browser inside Bulwark Webmail.

**Base URL:** `https://extensions.bulwarkmail.org/api/v1`

All responses are JSON. Authentication is only required for author/admin endpoints (not covered here).

## Public endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/extensions` | List and search extensions with filtering and pagination. |
| `GET` | `/extension/:slug` | Get full extension details, including latest version and permissions. |
| `GET` | `/extension/:slug/versions` | List all published versions of an extension. |
| `GET` | `/extension/:slug/readme` | Return the extension's rendered README (HTML). |
| `GET` | `/extension/:slug/screenshots` | List screenshot URLs for an extension. |
| `GET` | `/bundle/:slug/:version` | Download the extension bundle as a ZIP. |
| `POST` | `/check-updates` | Check a list of installed extensions for updates. Used by the admin panel. |
| `GET` | `/extensions/featured` | List featured extensions. |
| `GET` | `/extensions/popular` | List most-downloaded extensions. |
| `GET` | `/extensions/recent` | List recently-added extensions. |
| `GET` | `/stats` | Get directory-wide statistics (total extensions, authors, downloads). |

## Listing and search

`GET /extensions` accepts the following query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Full-text search across name, description, and tags. |
| `type` | `plugin` \| `theme` | Filter by extension type. |
| `pluginType` | string | Filter plugins by `hook`, `ui-extension`, or `sidebar-app`. |
| `tag` | string | Filter by category tag. |
| `sort` | string | One of `newest`, `updated`, `downloads`, `name`. Default: `newest`. |
| `order` | `asc` \| `desc` | Sort direction. Default depends on `sort`. |
| `page` | number | Page number (1-indexed). Default: `1`. |
| `perPage` | number | Items per page (1–100). Default: `24`. |

### Example

```bash
curl 'https://extensions.bulwarkmail.org/api/v1/extensions?type=plugin&tag=productivity&sort=downloads'
```

Response shape:

```json
{
  "data": [
    {
      "slug": "quick-snooze",
      "name": "Quick Snooze",
      "type": "plugin",
      "description": "Snooze emails for later with one keystroke.",
      "iconPath": "abc123/icon.png",
      "totalDownloads": 1842,
      "featured": true,
      "tags": ["productivity"],
      "permissions": ["email:read", "email:write"],
      "license": "MIT",
      "author": {
        "githubLogin": "someone",
        "displayName": "Someone",
        "verified": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 24,
    "total": 42
  }
}
```

## Update checks

`POST /check-updates` takes a JSON body describing the extensions currently installed and returns which ones have a newer version available. The admin panel in Bulwark uses this to surface update badges.

```bash
curl -X POST https://extensions.bulwarkmail.org/api/v1/check-updates \
  -H 'Content-Type: application/json' \
  -d '{
    "installed": [
      { "slug": "quick-snooze", "version": "1.0.0" },
      { "slug": "dark-matter", "version": "2.1.3" }
    ]
  }'
```

Response:

```json
{
  "updates": [
    {
      "slug": "quick-snooze",
      "installedVersion": "1.0.0",
      "latestVersion": "1.2.0",
      "changelog": "https://github.com/someone/quick-snooze/releases/tag/v1.2.0"
    }
  ]
}
```

## Bundles

`GET /bundle/:slug/:version` returns the extension bundle as a ZIP archive. The response includes `Content-Disposition` and an `ETag` tied to the bundle's SHA-256 so downloads are cacheable.

## Rate limiting

The public endpoints are served without authentication but may be rate-limited by IP. Long-running integrations should cache responses — the `/stats`, `/extensions/featured`, `/extensions/popular`, and `/extensions/recent` endpoints are safe to cache for several minutes.
