---
title: Security fixes and updates
description: Where fixes are announced, how Bulwark tells you about a new release, and how to verify a download or image.
order: 9
---

# Security fixes and updates

Security fixes ship in the next Bulwark release, and only the latest release gets them. To stay safe, follow the releases and upgrade. This page says where fixes are announced, how Bulwark itself tells you about a new release, how to check that a download or image is the one the project built, and how to report a vulnerability.

## What gets fixed

Fixes land on `main` first and go out with the next release, whether that is a patch or a minor version. There are no maintenance branches and no backports. An older release stays as it is, so the fix for any version is to [update](/docs/deployment/updating) to the latest release. The [security policy](https://github.com/bulwarkmail/.github/blob/main/SECURITY.md) says the same.

Bulwark Lite has the same version numbers and gets the same fixes in the same releases.

## Where fixes are announced

- **The release notes:** every release on [GitHub releases](https://github.com/bulwarkmail/webmail/releases) carries its changelog, security fixes included.
- **The security advisories page**, [github.com/bulwarkmail/webmail/security/advisories](https://github.com/bulwarkmail/webmail/security/advisories). Published advisories name the affected versions and the release with the fix. Not every fix has a published advisory, so read the release notes as well.
- **The releases feed**, `https://github.com/bulwarkmail/webmail/releases.atom`, for a feed reader or a chat bot. The advisories page has no feed of its own.
- **Watching the repository:** on the [webmail repository](https://github.com/bulwarkmail/webmail), choose **Watch > Custom > Releases**, and GitHub notifies you of each release.

The advisories are published on the repository, not in GitHub's global advisory database, so Dependabot doesn't raise alerts for them. Watch the releases instead.

## The update notice in Bulwark

<div class="bw-note bw-note-brand"><b>Not in Lite.</b> The update check runs on Bulwark's server. Bulwark Lite has no update notice; watch the releases instead.</div>

Bulwark's server asks the project's version server whether a newer release exists, about 30 seconds after it starts and then every hour. The request carries the running version and nothing else about your install. When a newer release exists, Bulwark shows it in three places:

- **The login page:** the version line under the sign-in card turns amber and says "New version available", with a link to the release notes. Turn the version line off with `LOGIN_SHOW_VERSION=false`.
- **The admin console's Updates page:** it shows the running version, the latest release, the severity, when the last check ran and when the next one is due, with a **Check now** button. The Admin entry in the navigation gets a dot for Stalwart administrators.
- **Settings:** the About card at the bottom of the settings sidebar, shown with **Show advanced settings** on, adds a tag next to the version.

The version server can mark a release as a security update. Bulwark then shows the notice in red ("Security update available") and gives signed-in users the advisory id. Every release that fixed a published advisory is marked this way. A fix without a published advisory can still arrive with an amber notice, so read the release notes either way. A version below the oldest one the project still supports gets a red "Version no longer supported".

<img class="theme-light-only" src="/screenshots/light-admin-updates.webp" alt="The admin console's Updates page showing that the running version is up to date" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-updates.webp" alt="The admin console's Updates page showing that the running version is up to date" width="5120" height="2880" />

Turn the check off if you manage upgrades from outside, or point it at a feed of your own:

```env
BULWARK_UPDATE_CHECK=off
# or
BULWARK_UPDATE_CHECK_URL=https://updates.example.com/bulwark.json
```

An empty `BULWARK_UPDATE_CHECK_URL` turns it off as well, and so does [No third-party traffic](/docs/guides/organisation/third-party-traffic). [Updating](/docs/deployment/updating#the-in-app-update-notice) has the rest of the details.

## Verifying a download

Every release file has a `.sha256` next to it and a signed build provenance attestation from GitHub. The images on GitHub Container Registry carry an attestation too. Releases from 1.12.0 on have them.

Release tags have no `v` in front: the tag is `1.19.1`, not `v1.19.1`. The release titles on GitHub start with a `v`, but the tags and the files don't.

### Checksums

The checksum shows the file arrived complete. It needs nothing but `sha256sum`:

```bash
gh release download 1.19.1 -R bulwarkmail/webmail   # or download the files and their .sha256 by hand
sha256sum -c *.sha256
```

```text
bulwark-lite-1.19.1.zip: OK
bulwark-lite-stalwart.zip: OK
bulwark-standalone-1.19.1-linux-amd64.tar.gz: OK
bulwark-standalone-1.19.1-linux-arm64.tar.gz: OK
```

### Attestations

The attestation shows the file or image was built by the project's release workflow from the tagged commit. You check it with the [GitHub CLI](https://cli.github.com/), which needs a GitHub login first (`gh auth login`). Without one it stops and asks you to log in.

A release file:

```bash
gh attestation verify bulwark-lite-1.19.1.zip -R bulwarkmail/webmail
gh attestation verify bulwark-standalone-1.19.1-linux-amd64.tar.gz -R bulwarkmail/webmail
```

An image:

```bash
gh attestation verify oci://ghcr.io/bulwarkmail/webmail:1.19.1 -R bulwarkmail/webmail
gh attestation verify oci://ghcr.io/bulwarkmail/webmail-lite:1.19.1 -R bulwarkmail/webmail
```

A file or image that passes exits with status 0. In a terminal, `gh` also prints a summary that names the workflow that signed it, such as `.github/workflows/static-lite.yml@refs/tags/1.19.1`; in a script, check the exit status, because it prints nothing there. A file that was changed after the build has no attestation, so the check fails:

```text
Error: HTTP 404: Not Found (.../attestations/sha256:2ab8952f...)
```

## Reporting a vulnerability

Report it privately through GitHub's [private vulnerability reporting](https://github.com/bulwarkmail/webmail/security/advisories/new) on the webmail repository, not in a public issue. Every public Bulwark repository takes private reports, so use the repository of the project the problem is in. The [security policy](https://github.com/bulwarkmail/.github/blob/main/SECURITY.md) lists what to include in a report.

## Next step

[Updating](/docs/deployment/updating) shows how to upgrade each kind of install and what survives an upgrade.
