---
title: Organisation settings
description: Signatures, external mail warnings, sign-out times, shared templates and tags, delegates, and settings per domain or group.
order: 12
edition: both
---

# Organisation settings

The admin panel's **Organisation** section holds the settings a company or a hoster makes for its users: what every message carries, what warns them, when they are signed out, and what teams share. Each page explains in one sentence what it does for users.

| Page | What it sets |
| --- | --- |
| [Domains and groups](/docs/guides/organisation/domains-and-groups) | Different settings for some domains or groups, the effective policy of a user, the policy file |
| [Signatures](/docs/guides/organisation/signatures) | The organisation signature with each user's details, and the legal disclaimer |
| [Templates](/docs/guides/organisation/templates) | The template library every user sees, and what users may keep of their own |
| Security | [External sender label, external recipient warning](/docs/guides/organisation/external-mail), [sign-out times](/docs/guides/organisation/sessions), [third-party traffic](/docs/guides/organisation/third-party-traffic) |
| Sharing | [Tags in shared mailboxes](/docs/guides/organisation/shared-tags), [delegates](/docs/guides/organisation/delegates), [recovering deleted items](/docs/guides/organisation/recover-deleted-items) |

Assigning messages in a team mailbox and marking them done comes from the [Team inbox plugin](/docs/guides/organisation/team-inbox), not from these pages. It isn't in the extension directory yet; you upload its ZIP under Extensions > Plugins.

Every setting has a default that works without configuration. An admin who does nothing gets Bulwark as before.

## Locking a setting

For 26 settings the admin can lock the value users get or hide the option, and each setting offers only what fits it. Users then see the admin's value with **Set by your organisation** next to a locked setting, instead of a control that does nothing. Two settings have a limit of their own: Notification duration takes a minimum, and Rights users can give can be limited to read access. Most of the 26 are on the User policy page; the Organisation pages list theirs next to the settings they belong to.

Many more settings can be preset: users start with the admin's value and can change it. The accessibility reading aids, such as text size, contrast and motion, are among them. They can be preset but never locked or hidden.

## Everything is one file

All of it, and the User policy page, is stored in one file, `policy.json` in `ADMIN_CONFIG_DIR`. The one exception is the No third-party traffic switch on the Security page, which is a server setting in `config.json`. You can keep that file in git and mount it read-only, export it from one instance and import it on another, or put it next to a [Bulwark Lite](/docs/getting-started/lite) build, which reads the same file. See [the policy file](/docs/guides/organisation/domains-and-groups#the-policy-file).

<div class="bw-note"><b>Note.</b> Bulwark Lite has no admin panel. Write <code>policy.json</code> by hand, or export it from a full Bulwark, and put it next to <code>index.html</code>. Lite applies the same domain and group settings.</div>
