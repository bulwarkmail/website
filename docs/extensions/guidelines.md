---
title: Submission guidelines
description: Requirements, review process, and content policy for publishing extensions on the Bulwark directory.
order: 4
---

# Submission guidelines

Read these requirements carefully before submitting an extension. The directory review is strict on purpose — it keeps what we ship to users safe, auditable, and forever free.

## Core principles

- **Free and open source only.** No paid, proprietary, or closed-source extensions will ever be accepted. This is a core principle that will never change.
- **Privacy-respecting.** Extensions must not collect, transmit, or store user data beyond what is required for their stated functionality.
- **Transparency.** All source code must be publicly available and auditable.

## Technical requirements

1. **Public GitHub repository.** Your extension must be hosted on GitHub in a public repository.
2. **OSI-approved license.** Use an [OSI-approved license](https://opensource.org/licenses) such as MIT, Apache-2.0, or GPL-3.0. The `LICENSE` file must be present at the repo root.
3. **Valid `manifest.json`.** Include all required fields. See the [manifest.json reference](/docs/extensions/manifest).
4. **No minified code.** All JavaScript and TypeScript must be readable. Build output may be minified if the source is included in the repository.
5. **No external resources.** Extensions must not load remote scripts, stylesheets, or fonts at runtime. All assets must be bundled.
6. **Semantic versioning.** Follow [semver](https://semver.org/) (`MAJOR.MINOR.PATCH`).
7. **Git tags.** Each version must correspond to a git tag in the source repository.

## Content policy

- No malware, spyware, or adware.
- No cryptocurrency miners or network scanners.
- No tracking or analytics without explicit user consent.
- No content that is illegal, hateful, or harmful.
- Extensions must accurately describe their functionality. Misleading descriptions or names are grounds for rejection.

## Permissions

Extensions must request only the **minimum permissions necessary** for their declared functionality. Over-requesting is the single most common reason for rejection.

If an extension needs a permission that is not obviously required, justify it in the extension description or README. Permissions are shown to users on the install screen — you want your listing to be trustworthy at a glance.

See the [full permissions list](/docs/extensions/manifest#permissions).

## Review process

1. **Submit.** Authenticate with GitHub at [extensions.bulwarkmail.org/submit](https://extensions.bulwarkmail.org/submit) and submit your repo URL and version tag.
2. **Automated checks.** The system verifies the repository is public, has an OSI-approved license, and the manifest is valid. The bundle is scanned for known malware signatures and dangerous JavaScript patterns.
3. **Manual review.** A human admin reviews the code for policy compliance, security, and quality.
4. **Published.** Once approved, the extension appears in the directory and is installable from inside Bulwark Webmail.

Most submissions are reviewed within a few days. You will be notified of the decision through GitHub.

## Updates

To publish a new version, submit a new git tag from the same repository. Updates go through the same review process. Minor version bumps may receive expedited review if the extension has a good track record and the diff is small.

See [publishing and updates](/docs/extensions/publishing) for the full flow.

## Rejection and appeals

If your extension is rejected, you will receive a reason through the review system. You may fix the issues and resubmit. If you believe a rejection was made in error, open an issue on the [bulwarkmail/Extensions](https://github.com/bulwarkmail/Extensions) repository and an admin will take a second look.

## Takedown

We reserve the right to remove an extension from the directory at any time if it is later found to violate these guidelines — for example, if a new release introduces tracking code or dangerous behavior that slipped through review. Affected authors will be notified and given an opportunity to fix the issue.
