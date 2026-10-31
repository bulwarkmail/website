---
title: Introduction
description: What Bulwark is and what it runs on.
order: 1
edition: both
---

# Introduction

Bulwark is an open-source webmail client for [Stalwart](https://stalw.art). Stalwart is the mail server: it stores the mail, calendars, contacts and files, and checks who signs in. Bulwark is what people use in the browser to read and write mail, plan their week, keep their contacts and open their files, all behind one login. The license is AGPL v3.

Bulwark talks to Stalwart over [JMAP](https://jmap.io). Most self-hosted webmail is an IMAP client in a browser, polling each folder and rebuilding threads on every render. With JMAP the server does that work and pushes changes, so the inbox updates without reloading. Bulwark also calls Stalwart's own JMAP methods, so Sieve filters, the vacation responder, account security, file storage and branding are all reachable from the same session instead of somewhere else.

## Two ways to run it

**Bulwark** runs as a Node.js service, usually one Docker container, with a setup wizard, an admin console, plugins and settings sync. **Bulwark Lite** is the same client as static files: the browser talks to Stalwart directly, and there is no admin console and no plugins. [Bulwark and Bulwark Lite compared](/docs/getting-started/editions) lists the differences; most of this manual applies to both.

## Who it is for

- [Organisations](/organisations): IT departments, schools and hosters who give Bulwark to many users and decide settings for them
- [Small businesses](/small-business): a team that shares a support address, calendars and files
- [Home servers](/homelab): you, your family or a club on your own Stalwart

## What it does

- **Mail**: threads, full-text search, tags, filters, templates, scheduled send and three layouts. See [Email](/docs/features/email).
- **Calendar**: month, week, day, agenda and task views, recurring events and invitations. See [Calendar](/docs/features/calendar).
- **Contacts**: several address books, groups and vCard import and export. See [Contacts](/docs/features/contacts).
- **Files**: Stalwart's file storage as a folder tree, with previews, sharing, and office editing once you connect Collabora or ONLYOFFICE. See [Files](/docs/features/files).

Every feature, with what it needs, is in [All features](/docs/features/overview).

## What you need

- **Stalwart** 0.16.6 or newer, or Stalwart 1.0 from Bulwark {{BULWARK_VERSION}} on ([supported versions](/docs/getting-started/stalwart-setup#supported-versions)). A few features need Stalwart 1.0 or a Stalwart Enterprise licence; All features marks them.
- **For Bulwark**: Docker, or Node.js for a manual install.
- **For Bulwark Lite**: a web host for static files, or Stalwart itself.

[Requirements and sizing](/docs/deployment/requirements) has the details, including memory and the architectures the images are built for.

## Words used in these docs

- **Stalwart**: the mail server. It holds the users, groups and mailboxes. Bulwark stores no mail of its own.
- **JMAP**: the protocol Bulwark and Stalwart speak ([RFC 8620](https://www.rfc-editor.org/rfc/rfc8620)), in place of IMAP and SMTP.
- **Bulwark**: the webmail as a Node.js service, with the admin console and plugins. Where a page has to set it apart from Lite, it says "Bulwark (not Lite)".
- **Bulwark Lite**: the same client as static files. It reads its settings from `config.json` and `policy.json` instead of an admin console.
- **Admin console**: Bulwark's admin area at `/admin`, for server, sign-in, branding, policy, organisation, plugins and themes. It is not Stalwart's own web admin, where you manage users and domains.
- **Policy** (user policy): what admins decide for users, such as features switched off and settings preset or locked, for everyone or per domain or group. It is stored in `policy.json`.
- **Identity**: an address a user sends from, with its name and signature. One account can have several.
- **Shared mailbox**: a Stalwart group with its own address and mailbox, such as `support@example.com`. Its members see it under **Shared**. A folder one person shares with another is a shared folder, not a shared mailbox.
- **Team inbox**: the Team inbox plugin, which lets members of a shared mailbox assign messages and mark them done.
- **Extension directory** and **marketplace**: the directory at [extensions.bulwarkmail.org](https://extensions.bulwarkmail.org) lists plugins and themes; the marketplace is the page in the admin console that installs them from it.

## Where to go next

If Stalwart isn't running yet, [set it up](/docs/getting-started/stalwart-setup) first: Bulwark is a client and has nothing to talk to without it. Then [install Bulwark](/docs/getting-started/installation), a container and a wizard, or put [Bulwark Lite](/docs/getting-started/lite) on a web host.

Questions the docs don't answer belong on the [issue tracker](https://github.com/bulwarkmail/webmail/issues). Anything about the mail server itself is covered better in [Stalwart's own documentation](https://stalw.art/docs).
