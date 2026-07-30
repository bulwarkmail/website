---
title: Submission guidelines
description: Requirements, review process, and content policy for publishing extensions on the Bulwark directory.
order: 4
---

# Submission guidelines

Read these before submitting. The review is strict on purpose: everything the directory ships to users has to stay auditable and free.

## Core principles

- **Free and open source only:** paid, proprietary, and closed-source extensions are never accepted, and that is not up for negotiation.
- **Privacy-respecting:** extensions must not collect, transmit, or store user data beyond what their stated functionality requires.
- **Transparency:** all source code must be publicly available and auditable.

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

Request the minimum permissions the extension actually needs. Over-requesting is the most common reason a submission is rejected.

Where a permission is not obviously required, justify it in the description or the README. Users see the permission list on the install screen, and an unexplained one costs you installs.

See the [full permissions list](/docs/extensions/manifest#permissions).

## Review process

1. **Submit.** Authenticate with GitHub at [extensions.bulwarkmail.org/submit](https://extensions.bulwarkmail.org/submit) and submit your repo URL and version tag.
2. **Automated checks.** The system verifies the repository is public, has an OSI-approved license, and the manifest is valid. The bundle is scanned for known malware signatures and dangerous JavaScript patterns.
3. **Manual review.** A human admin reviews the code for policy compliance, security, and quality.
4. **Published.** Once approved, the extension appears in the directory and is installable from inside Bulwark Webmail.

Reviews usually take a few days. The decision reaches you through GitHub.

## Updates

To publish a new version, submit a new git tag from the same repository. Updates go through the same review process. Minor version bumps may receive expedited review if the extension has a good track record and the diff is small.

See [publishing and updates](/docs/extensions/publishing) for the full flow.

## Rejection and appeals

If your extension is rejected, you will receive a reason through the review system. You may fix the issues and resubmit. If you believe a rejection was made in error, open an issue on the [bulwarkmail/Extensions](https://github.com/bulwarkmail/Extensions) repository and an admin will take a second look.

## Takedown

An extension can be pulled from the directory at any point if it turns out to break these rules, say a new release that slipped tracking code past review. The author is told why and gets a chance to fix it.
