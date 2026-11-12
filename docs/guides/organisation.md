---
title: Organisation settings
description: Signatures, external mail warnings, sign-out times, shared templates and tags, delegates, announcements, device policies, and settings per domain or group.
order: 2
edition: both
---

# Organisation settings

The admin console's **Organisation** section holds the settings a company or a hoster makes for its users: what every message carries, what warns them, when they are signed out, and what teams share. Each page explains in one sentence what it does for users.

| Page | What it sets |
| --- | --- |
| [Domains and groups](/docs/guides/organisation/domains-and-groups) | Different settings for some domains or groups, the effective policy of a user, the policy file |
| [Signatures](/docs/guides/organisation/signatures) | The organisation signature with each user's details, and the legal disclaimer |
| Templates | [The template library every user sees, and what users may keep of their own](/docs/guides/organisation/templates), [out-of-office reply templates](/docs/guides/organisation/out-of-office#reply-templates) |
| Security | [External sender label, external recipient warning](/docs/guides/organisation/external-mail), [sign-out times](/docs/guides/organisation/sessions), [third-party traffic](/docs/guides/organisation/third-party-traffic), [phishing reports](/docs/guides/organisation/phishing-reports) |
| [Classification](/docs/guides/organisation/classification-labels) | Labels users pick for outgoing mail (Internal, Confidential, VS-NfD), a default, whether a label is required |
| Sharing | [Tags in shared mailboxes](/docs/guides/organisation/shared-tags), [delegates](/docs/guides/organisation/delegates), [recovering deleted items](/docs/guides/organisation/recover-deleted-items) |
| Calendars | [Company calendars](/docs/guides/organisation/company-calendars), [free/busy sharing for Suggest times](/docs/guides/organisation/find-a-time), [out-of-office blocks the calendar](/docs/guides/organisation/out-of-office) |
| [Notices](/docs/guides/organisation/announcements) | An announcement across the top of every app, and how long Trash and Junk keep mail |
| Devices | [No downloads, no export, no printing, no install prompt, push without sender and subject, a watermark](/docs/guides/organisation/device-policies), [offline mode](/docs/guides/organisation/offline-mode) |
| [Proofreading](/docs/guides/organisation/proofreading) | Whether proofreading plugins check what users write: off, the users' choice, or required; per domain, group and plugin; the writing language |
| [Mail import and export](/docs/guides/organisation/mail-import-export) | Stalwart's upload limit for migrations from mbox, PST and EML files, and turning export off |

Assigning messages in a shared mailbox and marking them done comes from the [Team inbox plugin](/docs/guides/organisation/team-inbox), not from these pages. It isn't in the extension directory yet; you upload its ZIP under Extensions > Plugins.

Two official plugins add checks an organisation sets up under **Extensions > Plugins**, not on these pages: the [link check](/docs/guides/organisation/link-check) of links when users click them (company service or Google Safe Browsing), and [send checks](/docs/guides/organisation/send-checks) for IBANs, card numbers, keywords and attachment types before mail goes out.

Every setting has a default that works without configuration. An admin who does nothing gets Bulwark as before.

## Locking a setting

For 26 settings the admin can lock the value users get or hide the option, and each setting offers only what fits it. Users then see the admin's value with **Set by your organisation** next to a locked setting, instead of a control that does nothing. Two settings have a limit of their own: Notification duration takes a minimum, and Rights users can give can be limited to read access. Most of the 26 are on the User policy page; the Organisation pages list theirs next to the settings they belong to.

Many more settings can be preset: users start with the admin's value and can change it. The accessibility reading aids, such as text size, contrast and motion, are among them. They can be preset but never locked or hidden.

The tags new users start with are preset the same way, under **Tags** in the **Defaults** section, or as `defaults.emailKeywords` in `policy.json`: a list of `{ "id", "label", "color" }`, at most 50 entries, with colours from the tag palette. It replaces the seven colour tags for users who haven't changed their tags; an empty list gives new users none. Users who had tags before this version keep theirs. The tag list can't be locked.

## Everything is one file

All of it, and the User policy page, is stored in one file, `policy.json` in `ADMIN_CONFIG_DIR`. The one exception is the No third-party traffic switch on the Security page, which is a server setting in `config.json`. You can keep `policy.json` in git and mount it read-only, export it from one instance and import it on another, or put it next to a [Bulwark Lite](/docs/getting-started/lite) build, which reads the same file. See [the policy file](/docs/guides/organisation/domains-and-groups#the-policy-file). With [several instances](/docs/deployment/multi-instance) on a shared store, the policy lives in the store unless you mount the file read-only, and a saved change reaches every instance within seconds. When two admins save the policy at the same time, the one who saves second is told that someone else changed it and keeps their edits until they reload.

<div class="bw-note"><b>Note.</b> Bulwark Lite has no admin console. Write <code>policy.json</code> by hand, or export it from a full Bulwark, and put it next to <code>index.html</code>. Lite applies the same domain and group settings.</div>
