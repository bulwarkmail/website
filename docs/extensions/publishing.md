---
title: Publishing and updates
description: How to publish a new extension and ship updates through the Bulwark directory.
order: 5
edition: full
editionNote: "Plugins and themes from the directory run in Bulwark (not Lite). Lite has its built-in themes but no plugin system."
---

# Publishing and updates

This is the practical end-to-end workflow for getting an extension into the directory and keeping it up to date.

## Prerequisites

- A GitHub account to sign in.
- A public repository on GitHub, GitLab or Codeberg with the extension's source, its `manifest.json` (at the root, or in the extension's folder for a repository with several extensions), and an OSI-approved license.
- A commit to publish. A tag is best (for example `v1.0.0`); the version comes from `manifest.json`, not from the tag name.

Before submitting, skim the [submission guidelines](/docs/extensions/guidelines) and make sure your [manifest.json](/docs/extensions/manifest) is valid.

## First publish

1. Go to [extensions.bulwarkmail.org](https://extensions.bulwarkmail.org/) and click **Sign in with GitHub**. We only request `read:user` and `user:email` scopes.
2. In the dashboard, [add the extension](https://extensions.bulwarkmail.org/dashboard/new): its id from `manifest.json`, plugin or theme, the repository URL and, for a repository with several extensions, the folder that holds `manifest.json`. Click **Reserve and continue**.
3. On the extension's dashboard page, under **Submit a version**, enter a tag, branch or commit and click **Submit**.
4. The directory fetches the repository at that commit, builds the bundle itself, runs the same install checks a Bulwark runs and a code scanner, and queues it for a reviewer.
5. You get an email when the version is waiting for review, and another with the decision. On approval the directory signs the bundle and publishes it.

## Publishing from CI

You can also submit versions from CI instead of the dashboard. The [directory's publishing page](https://extensions.bulwarkmail.org/publishing) has the full details.

### GitHub Actions (trusted publishing)

On the extension's dashboard page, under **Publish from CI**, add a trusted publisher: the repository, the workflow file and, optionally, a GitHub environment. By default only tags may publish. A workflow with `id-token: write` that runs `bulwarkmail/publish-extension@v1` then submits the commit it runs for, with no secret to store:

```yaml
name: Publish to Bulwark Extensions
on:
  push:
    tags: ["v*"]
permissions:
  contents: read
  id-token: write
jobs:
  publish:
    runs-on: ubuntu-latest
    environment: release
    steps:
      - uses: bulwarkmail/publish-extension@v1
        with:
          subpath: my-plugin   # only for a repository with several extensions
```

The job waits for the build and the checks and fails if they fail. With `dry-run: true` it builds and checks without submitting anything, for example on pull requests.

### Other CI (API tokens)

Create an API token on the [tokens page](https://extensions.bulwarkmail.org/dashboard/tokens). A token is limited to the extensions you pick and to what it may do, and it expires. Send it to the publishing endpoint with the slug and the ref:

```bash
curl -X POST https://extensions.bulwarkmail.org/api/v2/publish \
  -H "Authorization: Bearer $BULWARK_EXTENSIONS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{ "slug": "my-plugin", "ref": "v1.2.0" }'
```

The answer (`202`) carries a `statusUrl` and a `pollToken`. Poll `statusUrl` with `Authorization: Bearer <pollToken>` until `status` is `awaiting_review`, `build_failed` or `blocked`. `/api/v2/publish/dry-run` takes the same body and only builds and checks.

The official plugins in [bulwarkmail/plugins](https://github.com/bulwarkmail/plugins) publish this way: pushing a `<plugin>@<version>` tag runs a workflow that submits that plugin's folder for review.

## Publishing a new version

1. Raise `version` in `manifest.json` and commit (tagging the commit is best).
2. Submit the new tag or commit from the extension's dashboard page, or let CI submit it.
3. The new version is reviewed. Once approved it becomes the latest version.

Bulwark is always offered the newest version it can run, going by `minAppVersion` and the maximum Bulwark version you set. Versions with a pre-release part, like `1.3.0-beta.1`, go to the beta channel, which webmails only see when an admin turns it on.

Older versions stay downloadable by exact version, so existing installs keep working. Bulwark's Marketplace checks `POST /api/v2/updates` and shows the update with its changelog.

## Version lifecycle

- **Submitted:** the directory builds the version and runs the checks. If the build fails or the checks block it, you get an email saying why.
- **Waiting for review:** built and checked. You can withdraw it while it waits.
- **Approved:** signed and published, installable from Bulwark.
- **Rejected:** not published. You'll get a reason, and you can fix it and resubmit.
- **Yanked:** you withdrew a published version on the extension's dashboard page. It is no longer offered for new installs, webmails running it are told why, and it can still be downloaded by exact version.

The whole extension can also change state:

- **Suspended:** the directory staff suspended it for breaking the rules. None of its versions can be downloaded until the suspension is lifted. Installed copies keep running, and the admin sees a notice in the Marketplace.
- **Archived:** removed from search, still available to existing installs.

## Breaking changes

If a new version needs a newer Bulwark, raise `minAppVersion`. Older Bulwarks are then not offered it and refuse to install it. If a release stops working on a later Bulwark, set its maximum Bulwark version on the extension's dashboard page (**Set max app version**).

Write a **changelog**. The directory takes a version's notes from a `CHANGELOG.md` in the extension's folder (a `## 1.2.0` heading per version), else from the tag's release notes on GitHub, GitLab or Codeberg, else from a `changelog` string in `manifest.json`. Admins read them in Bulwark before they update. A `### Security` or `### Breaking` heading marks the update.

## Taking your extension down

To take an extension down, open its page in the dashboard. **Archive** hides it from search but keeps the bundles, so installed copies keep working. **Deprecate** keeps it installable, lists it lower, and tells webmails that have it, with your message and a replacement if you name one.
