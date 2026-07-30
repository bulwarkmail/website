---
title: Introduction
description: What Bulwark is and what it runs on.
order: 1
---

# Introduction

Bulwark is an open-source webmail client for [Stalwart Mail Server](https://stalw.art). It is written in [Next.js](https://nextjs.org) and talks to the server over [JMAP](https://jmap.io). Email, calendar, contacts and file storage all sit behind the same login.

## What it is for

Most self-hosted webmail is an IMAP client with a browser bolted onto it. That inheritance shows up as a poll loop, one connection per folder, and threads the browser has to reassemble on every render. JMAP does that work on the server, which lets Bulwark stay thin and still stay in sync.

A generic JMAP client would stop there. Bulwark also calls Stalwart's own JMAP methods, so Sieve filters, the vacation responder, account security, FileNode storage and runtime branding are all reachable from the same session, instead of being things you leave the webmail to configure.

The license is AGPL v3.

## The four apps

**Mail** is the one you'll spend your day in. Threaded conversations, full-text search across the whole account, colored labels that map onto JMAP keywords, and three layouts to choose between: three-pane split, focused list, or reading pane at the bottom. The composer is Tiptap, with inline images, tables, per-identity signatures, templates, scheduled send, and S/MIME signing and encryption. Awkward mail is handled rather than ignored: `winmail.dat` gets unpacked, embedded `message/rfc822` attachments open like the messages they are, and PDFs preview in place. See [Email](/docs/features/email).

**Calendar** covers month, week, day, agenda, and task views, with drag-to-reschedule, recurring events you can edit by scope, and iMIP invitations that Stalwart actually accepts. It subscribes to external iCal and webcal feeds and generates a birthday calendar from your contacts. See [Calendar](/docs/features/calendar).

**Contacts** gives you multiple address books, groups, categories, vCard import and export with duplicate detection, and autocomplete in the composer. Each contact's detail view shows recent mail with that person and their upcoming events. See [Contacts](/docs/features/contacts).

**Files** browses Stalwart's JMAP FileNode storage as a real folder tree, with streamed uploads that don't buffer in memory, folder drag-and-drop, and previews for images, text, audio, video, and PDF. See [Files](/docs/features/files).

## Everything around them

| Area | What's there |
| --- | --- |
| Setup | A web wizard on first launch that probes your JMAP server, configures OAuth, generates the session secret, takes your branding, and sets the admin password |
| Accounts | Several accounts signed in at once, switching instantly, with a unified inbox across all of them |
| Identities | Multiple sender identities per account, each with its own signature and signature position, plus sub-addressing with a configurable delimiter |
| Filters | Server-side Sieve (RFC 9661) through a visual rule builder or a raw editor, and a vacation responder with date ranges |
| S/MIME | Sign, encrypt, decrypt, verify. Legacy 3DES and password-based key bundles included, per-account key isolation throughout |
| Authentication | OAuth2/OIDC with PKCE against Keycloak, Authentik, or Stalwart itself; TOTP; app passwords with IP allowlists; encrypted Remember-me |
| Admin | One tabbed dashboard for config, plugins, themes, API keys, policy, and the audit log |
| Extensions | Plugins and themes as ZIP bundles, sandboxed and admin-approved, installable from a marketplace you can point anywhere |
| Appearance | Light and dark themes that remap HTML email colors by luminance, bundled color themes, and branding down to per-hostname overrides |
| [Mobile](/docs/features/mobile) | Installable as a PWA with web push for new mail, plus a separate React Native app |
| Languages | 24, three of them right-to-left, detected from the browser |
| Operations | JMAP push instead of polling, structured logging, a health endpoint, an update check, and an optional anonymous heartbeat that ships off |

The exhaustive version, kept in sync with each release, is [FEATURES.md](https://github.com/bulwarkmail/webmail/blob/main/FEATURES.md) in the repository.

## What it is built on

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Next.js 16      | React framework          |
| TypeScript      | Type safety              |
| Tailwind CSS v4 | Styling                  |
| Zustand         | State management         |
| JMAP            | Mail protocol (RFC 8620) |
| next-intl       | Internationalization     |
| Lucide React    | Icon library             |
| Stalwart        | Mail server              |

## Where to go next

[Installation](/docs/getting-started/installation) is a container and a wizard, and takes about ten minutes. If Stalwart isn't running yet, do [that](/docs/getting-started/configuration/stalwart-setup) first: Bulwark is a client and has nothing to talk to without it.

Questions the docs don't answer belong on the [issue tracker](https://github.com/bulwarkmail/webmail/issues). Anything about the mail server itself is covered better in [Stalwart's own documentation](https://stalw.art/docs), and the protocol underneath both is specified at [jmap.io](https://jmap.io).
