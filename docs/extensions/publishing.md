---
title: Publishing & updates
description: How to publish a new extension and ship updates through the Bulwark directory.
order: 5
---

# Publishing and updates

This is the practical end-to-end workflow for getting an extension into the directory and keeping it up to date.

## Prerequisites

- A GitHub account.
- A public GitHub repository containing your extension source, a `manifest.json` at the repo root, and an OSI-approved `LICENSE` file.
- A git tag that matches the `version` field in your manifest (for example, `v1.0.0`).

Before submitting, skim the [submission guidelines](/docs/extensions/guidelines) and make sure your [manifest.json](/docs/extensions/manifest) is valid.

## First publish

1. Visit [extensions.bulwarkmail.org/submit](https://extensions.bulwarkmail.org/submit).
2. Click **Continue with GitHub** to authenticate. We only request `read:user` and `user:email` scopes.
3. Enter your repository URL (for example `https://github.com/you/quick-snooze`) and the git tag you want to publish (for example `v1.0.0`).
4. Submit. You'll see a confirmation that the submission is queued for review.
5. The directory clones the repo at the tag, validates the manifest, scans the bundle, and hands off to a human reviewer.
6. You're notified of the decision via GitHub. If approved, your extension is live.

## Publishing a new version

Updates use the same submission form:

1. Push a new tag to the source repository (and bump the `version` in `manifest.json` to match).
2. Go back to the submit page and enter the new tag.
3. The new version is reviewed and, if approved, replaces the previous version as the "latest" in the directory.

Older versions remain available at `/api/v1/bundle/:slug/:version` so existing installs can keep working. Bulwark's admin panel uses `/api/v1/check-updates` to surface an update badge when a newer version is available.

## Version lifecycle

- **Pending.** Submission received, waiting on review.
- **Approved.** Live in the directory, installable from Bulwark.
- **Rejected.** Not published. You'll get a reason and can fix + resubmit.
- **Suspended.** Previously approved but temporarily hidden - typically after a policy violation report. Existing installs still work but the version isn't discoverable.
- **Archived.** Removed from search but still available for existing installs.

## Breaking changes

If a new version changes permissions or breaks compatibility with older Bulwark releases, bump `minAppVersion` in the manifest. The admin panel uses this to prevent automatic updates for users on incompatible versions.

For user-visible breaking changes, include a **changelog** in your GitHub release notes - the directory links to it on the extension page.

## Taking your extension down

If you want to unpublish, open a request on the [bulwarkmail/Extensions](https://github.com/bulwarkmail/Extensions) repo with the slug and reason. We'll mark the extension as `archived` so it stops appearing in search, but keep old bundles available so existing installs don't break.
