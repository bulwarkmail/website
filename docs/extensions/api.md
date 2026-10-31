---
title: REST API reference
description: The public REST API of the Bulwark Extensions directory.
order: 3
edition: full
editionNote: "Plugins and themes from the directory run in Bulwark (not Lite). Lite has its built-in themes but no plugin system."
---

# REST API reference

The Bulwark Extensions directory has a public REST API. Bulwark's Marketplace uses it to list, install and update extensions, and you can use it for your own tools.

**Base URL:** `https://extensions.bulwarkmail.org/api/v2`

All answers are JSON: `{ "data": ... }` on success, `{ "error": { "code", "message" } }` on failure. The public endpoints below need no account. Endpoints for authors and staff need a signed-in session and are not covered here; the endpoints for publishing from CI are described in [publishing and updates](/docs/extensions/publishing).

The older `/api/v1` still answers, for Bulwark releases before 1.16.0. Its answers are frozen and it gets nothing new. Image links in v2 answers (`iconUrl`, `bannerUrl`, screenshots) still point at `/api/v1/files/`.

## Public endpoints

| Method | Path                                             | Description                                                                                                           |
| ------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/extensions`                                    | List and search extensions with filtering and pagination.                                                             |
| `GET`  | `/extensions/:slug`                              | One extension: the list fields plus the long description (Markdown), versions, screenshots, advisories and permissions. |
| `GET`  | `/extensions/:slug/versions`                     | Published versions. Add `include=beta`, `include=yanked` or both (`include=beta,yanked`) to see those too.            |
| `GET`  | `/extensions/:slug/versions/:version`            | One version with its changelog, source commit, signature and advisories.                                              |
| `GET`  | `/extensions/:slug/versions/:version/bundle`     | Download the bundle as a ZIP.                                                                                         |
| `GET`  | `/extensions/:slug/versions/:version/provenance` | Where the bundle came from, as an in-toto statement with a SLSA provenance predicate.                                 |
| `GET`  | `/extensions/:slug/ratings`                      | The average rating and the ratings.                                                                                   |
| `POST` | `/extensions/:slug/reports`                      | Report an extension to the directory staff.                                                                           |
| `POST` | `/updates`                                       | Check installed extensions for updates, yanked versions and advisories. Used by Bulwark's Marketplace.                |
| `GET`  | `/advisories`                                    | Published security advisories. `since` (a date) returns only those published or changed since then.                   |
| `GET`  | `/keys`                                          | The keys the directory signs bundles with.                                                                            |
| `GET`  | `/permissions`                                   | Every permission the directory knows, with the text Bulwark's consent dialog shows and whether it is high risk.       |

## Listing and search

`GET /extensions` accepts the following query parameters:

| Parameter    | Type                | Description                                                                                         |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------- |
| `q`          | string              | Matches part of the name, description or slug.                                                      |
| `type`       | `plugin` \| `theme` | Filter by extension type.                                                                           |
| `pluginType` | string              | Filter plugins by `hook`, `ui-extension`, or `sidebar-app`.                                         |
| `tag`        | string              | Filter by category tag.                                                                             |
| `author`     | string              | Filter by the author's GitHub login.                                                                |
| `featured`   | `true`              | Only featured extensions.                                                                           |
| `sort`       | string              | One of `newest`, `updated`, `downloads`, `name`. Default: `newest`.                                 |
| `order`      | `asc` \| `desc`     | Sort direction. Default: `desc`.                                                                    |
| `page`       | number              | Page number (1-indexed). Default: `1`.                                                              |
| `perPage`    | number              | Items per page (1 to 100). Default: `24`.                                                           |
| `appVersion` | string              | A Bulwark version such as `1.19.1`. `latest` is then the highest version that Bulwark can run.      |
| `channel`    | `stable` \| `beta`  | With `beta`, pre-release versions count for `latest` too. Default: `stable`.                        |

Deprecated extensions are listed after the others, whatever the sort.

### Example

```bash
curl 'https://extensions.bulwarkmail.org/api/v2/extensions?type=plugin&sort=downloads&perPage=1'
```

Response (the description is shortened):

```json
{
  "data": [
    {
      "slug": "impersonation-notice",
      "name": "Impersonation Notice",
      "type": "plugin",
      "pluginType": "hook",
      "description": "Shows a persistent top-of-app banner when the active session is a Stalwart master-user impersonation ...",
      "tags": [],
      "license": "AGPL-3.0",
      "featured": false,
      "status": "approved",
      "iconUrl": "https://extensions.bulwarkmail.org/api/v1/files/media/impersonation-notice/icon-ba945bb38240.png",
      "bannerUrl": "https://extensions.bulwarkmail.org/api/v1/files/media/impersonation-notice/banner-88863b5a5b8c.webp",
      "author": {
        "login": "bulwarkmail",
        "name": "Bulwark",
        "avatarUrl": "https://avatars.githubusercontent.com/u/266882946?v=4",
        "verified": true,
        "organization": true,
        "url": "https://extensions.bulwarkmail.org/author/bulwarkmail"
      },
      "latest": {
        "version": "1.4.0",
        "channel": "stable",
        "publishedAt": "2026-10-18T19:09:29.000Z",
        "minAppVersion": "1.15.0",
        "maxAppVersion": null,
        "permissions": ["account:read", "auth:emit", "ui:app-top-banner", "admin:config"],
        "size": 2638,
        "sha256": "dbcde9948476df7f49dda5d9c17344c5ac7247f60c25068fec645c2c768ac41c",
        "yanked": null,
        "downloadUrl": "https://extensions.bulwarkmail.org/api/v2/extensions/impersonation-notice/versions/1.4.0/bundle"
      },
      "downloads": 1872,
      "rating": { "average": 0, "count": 0 },
      "deprecated": null,
      "source": { "host": "github.com", "repo": "bulwarkmail/plugins", "subpath": "impersonation-notice" },
      "url": "https://extensions.bulwarkmail.org/extension/impersonation-notice",
      "createdAt": "2026-05-16T15:56:52.000Z",
      "updatedAt": "2026-10-18T19:09:29.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 1,
    "total": 26
  }
}
```

## Update checks

`POST /updates` takes the extensions a Bulwark has installed, with its version and channel, and answers what has changed for them. Bulwark's Marketplace uses it for its update list. Send at most 500 extensions.

```bash
curl -X POST https://extensions.bulwarkmail.org/api/v2/updates \
  -H 'Content-Type: application/json' \
  -d '{
    "installed": [
      { "slug": "smime", "version": "1.4.0" }
    ],
    "appVersion": "1.19.1",
    "channel": "stable"
  }'
```

Response (shortened):

```json
{
  "data": {
    "updates": [
      {
        "slug": "smime",
        "currentVersion": "1.4.0",
        "version": "1.4.1",
        "channel": "stable",
        "minAppVersion": "1.15.0",
        "maxAppVersion": null,
        "sha256": "b52393678fca5822f5e1a75824faf678a9aef8ed243672c84a51fac8cd1c8e2d",
        "downloadUrl": "https://extensions.bulwarkmail.org/api/v2/extensions/smime/versions/1.4.1/bundle",
        "changelog": null,
        "notes": { "security": false, "breaking": false },
        "changelogs": [
          { "version": "1.4.1", "publishedAt": "2026-10-28T18:31:43.000Z", "changelog": null, "notes": { "security": false, "breaking": false } }
        ]
      }
    ],
    "yanked": [],
    "deprecated": [],
    "suspended": [],
    "advisories": [],
    "unknown": []
  }
}
```

- `updates`: the highest version this Bulwark can run on its channel, when it is newer than the installed one. Each entry has the same fields as `latest` in the list (permissions, size and so on), the changelog of that version, and in `changelogs` the notes of every version the update brings (at most 20). `notes` says whether a changelog has a `### Security` or `### Breaking` heading.
- `yanked`: installed versions the author withdrew, with the reason.
- `deprecated`: installed extensions the author deprecated, with their message and replacement.
- `suspended`: slugs of installed extensions the directory staff suspended. They get no updates.
- `advisories`: security advisories that affect the installed version.
- `unknown`: slugs the directory doesn't list.

## Bundles

`GET /extensions/:slug/versions/:version/bundle` returns the ZIP. Besides `Content-Disposition`, it sends:

- `X-Content-SHA256`: the SHA-256 of the ZIP.
- `X-Bundle-Statement`, `X-Bundle-Signature` and `X-Bundle-Signature-Key`: the directory's signature over the bundle. Bulwark checks it against the directory's keys before it installs anything, and refuses a bundle whose signature is wrong.
- `X-Bundle-Yanked`: only on a yanked version, with the reason. Yanked versions can still be downloaded by exact version.
- `Cache-Control: public, max-age=3600`: bundles may be cached for an hour.

The directory serves no bundles of a suspended extension.

## Rate limiting

Reads need no account. The directory limits reports, publishing and the polling of submissions, and answers `429` with a `Retry-After` header when a limit is hit. Integrations that poll the API should cache what they read.

## Next step

To put your own extension in the directory, see [Publishing and updates](/docs/extensions/publishing).
