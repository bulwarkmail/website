---
title: Submission guidelines
description: Requirements, review process, and content policy for publishing extensions on the Bulwark directory.
order: 4
edition: full
editionNote: "Plugins and themes from the directory run in Bulwark (not Lite). Lite has its built-in themes but no plugin system."
---

# Submission guidelines

Read these before submitting. The review is strict on purpose: everything the directory ships to users has to stay auditable and free.

## Core principles

- **Free and open source only:** paid, proprietary, and closed-source extensions are never accepted, and that is not up for negotiation.
- **Privacy-respecting:** extensions must not collect, transmit, or store user data beyond what their stated functionality requires.
- **Transparency:** all source code must be publicly available and auditable.

## Technical requirements

1. **Public repository.** The source must be in a public repository on GitHub, GitLab or Codeberg. You sign in to the directory with GitHub.
2. **OSI-approved license.** Use an [OSI-approved license](https://opensource.org/licenses) such as MIT, Apache-2.0, or GPL-3.0. The `LICENSE` file must be present at the repo root.
3. **Valid `manifest.json`.** Include all required fields. See the [manifest.json reference](/docs/extensions/manifest).
4. **Readable source.** Commit the source, not only a build. The directory builds the bundle itself: if `package.json` has a `build` script, it runs `npm ci --ignore-scripts` and `npm run build` without network access; otherwise it takes the plain files. A committed `dist/` or ZIP is never used. Files that look minified are flagged for the reviewer.
5. **No external resources.** Extensions must not load remote scripts, stylesheets, or fonts at runtime. All assets must be bundled.
6. **Semantic versioning.** Follow [semver](https://semver.org/) (`MAJOR.MINOR.PATCH`).
7. **Releases from a fixed commit.** Submit a tag (recommended), a branch or a commit. The directory builds exactly that commit and shows it on the version's page.

## Content policy

- No malware, spyware, or adware.
- No cryptocurrency miners or network scanners.
- No tracking or analytics without explicit user consent.
- No content that is illegal, hateful, or harmful.
- Extensions must accurately describe their functionality. Misleading descriptions or names are grounds for rejection.

## Permissions

Request the minimum permissions the extension actually needs. Over-requesting is the most common reason a submission is rejected.

Where a permission is not obviously required, justify it in the description or the README. Users see the permission list on the install screen, and an unexplained one costs you installs.

See the [full permissions list](/docs/extensions/manifest#permissions).

## Review process

1. **Submit.** Sign in with GitHub at [extensions.bulwarkmail.org](https://extensions.bulwarkmail.org/) and add the extension in the [dashboard](https://extensions.bulwarkmail.org/dashboard/new): its id, plugin or theme, the repository and, for a repository with several extensions, its folder. Then submit a version from the dashboard or from CI.
2. **Automated checks.** The directory checks that the repository is public, builds the bundle from source, runs the same install checks a Bulwark runs (manifest, permissions, file types and sizes), and scans the code. Code such as `eval`, `new Function`, `innerHTML =` or `document.write` blocks the submission; other risky patterns, such as hard-coded requests to other sites, are flagged for the reviewer.
3. **Manual review.** A human admin reviews the code for policy compliance, security, and quality.
4. **Published.** Once approved, the directory signs the bundle and publishes it. The extension appears in the directory and is installable from Bulwark's Marketplace.

You get an email when the version is built and waiting for review, and another with the decision. If the build or the checks fail, the email says why.

## Updates

To publish a new version, raise `version` in `manifest.json` and submit the new commit or tag, from the dashboard or from CI. Every version is reviewed; the reviewer sees what changed since the previous one.

See [publishing and updates](/docs/extensions/publishing) for the full flow.

## Rejection and appeals

If your extension is rejected, the email carries the reviewer's reason. You may fix the issues and resubmit. If you believe a rejection was made in error, open an issue on the [bulwarkmail/extensions-directory](https://github.com/bulwarkmail/extensions-directory) repository and an admin will take a second look.

## Takedown

The directory staff can suspend an extension at any point if it turns out to break these rules, say a new release that slipped tracking code past review. A suspended extension can't be downloaded or updated, and the reason shows on its dashboard page. Only the staff can lift a suspension: fix the problem and ask for it in an issue on [bulwarkmail/extensions-directory](https://github.com/bulwarkmail/extensions-directory).

## Next step

[Publishing and updates](/docs/extensions/publishing) walks through submitting your first version.
