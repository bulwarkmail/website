---
title: Introduction
description: Learn what Bulwark is and why it was built.
order: 1
---

# Introduction

**Bulwark** is a modern, open-source webmail client built with [Next.js](https://nextjs.org) and the [JMAP protocol](https://jmap.io) for [Stalwart Mail Server](https://stalw.art). It provides email, calendar, contacts, and cloud files in one interface with modern security and customization features.

## Why Bulwark?

Most webmail clients are either outdated, slow, or lack modern features. Bulwark was created to fill this gap by providing:

- **Modern UI/UX** - A clean, responsive interface built with cutting-edge web technologies
- **JMAP Protocol** - Leveraging the modern JMAP standard instead of legacy IMAP for superior performance
- **Stalwart Integration** - First-class support for Stalwart Mail Server, including Sieve filters, vacation responder, account security management, JMAP FileNode storage, and runtime branding options
- **Open Source** - Fully open-source under the AGPL v3 license

## Key Features

- **Web setup wizard** - First-launch web wizard probes the JMAP server(s), configures OAuth/OIDC, generates the session secret, accepts branding uploads, and provisions the initial admin password - no hand-editing of `.env.local` required (1.6.4+)
- **Multi-account support** - Multiple simultaneous accounts with instant switching, per-account state preservation, default account selection, and a unified inbox across all accounts. The 5-account cap is lifted on HTTP/2 servers (limited only by browser connection pooling on HTTP/1.1)
- **Full email management** - Tiptap rich text composer with inline images, resizable image components, tables, drag-and-drop attachments, plain text mode, threaded conversation view (with disable toggle), draft auto-save and editing, archive modes (direct, by year, year/month), TNEF (`winmail.dat`) extraction, embedded `message/rfc822` unwrapping, color tag labels with multi-tag support, hover actions, answered/forwarded status icons, reply-to addresses, auto-select reply identity, sub-addressing (plus addressing) with a configurable delimiter character, `.eml` file import via folder right-click, drag-out of attachments to the local file system, email export/import, newsletter unsubscribe (RFC 2369), printable viewer, and three selectable layouts: split (three-pane), focused list, and reading pane at bottom
- **Composer extras** - From-header override with optional catch-all auto-reply (replies to an alias on a domain you own auto-fill the alias as the sender even when it isn't a configured identity), per-identity signature position above or below quoted text, forgotten-attachment warning, and auto-add of new recipients to trusted senders
- **Calendar (RFC 8984)** - Month, week, day, agenda, and task views, drag-to-reschedule, click-drag and double-click creation, edge-resize with 15-minute snap, recurring events with scoped edit/delete and client-side expansion, iMIP invitations on create/update (RFC 5545/6047) with RSVP trust assessment, inline calendar invitation banner in email viewer (collapsible), iCal/webcal subscriptions with editing and batch import, CalDAV discovery with multi-account home resolution, auto-generated birthday calendar from contacts, virtual locations as first-class fields, task management with due dates and priority, week numbers, hover preview, notification sounds with sound picker
- **Contacts (RFC 9553/9610)** - Multiple address books with drag-and-drop, contact groups with member management, vCard import/export with duplicate detection, autocomplete in composer, A-Z grouping with sticky section headers, revamped detail view with filters, photo, print, duplicate detection and contact activity (recent emails and upcoming events), right-click context menu, address book rename, trusted senders stored in a dedicated JMAP address book
- **Files** - JMAP FileNode browser with grid/list views, streamed WebDAV PUT upload, folder upload via drag-and-drop, dynamic server-configured upload limits, preview for images/text/audio/video/PDF, clipboard cut/copy/paste/duplicate, favorites, and recent files
- **Filters & Templates** - Server-side Sieve filters (RFC 9661) with visual rule builder, expanded visual view, raw editor with syntax validation, vacation responder with date-range scheduling, and reusable email templates with placeholder auto-fill
- **Identity** - Multiple sender identities with per-identity signatures (configurable position above or below quoted text), automatic identity sync, identity badges in viewer/list, sub-addressing helper
- **S/MIME** - Manage certificates, sign, encrypt, decrypt, and verify; legacy 3DES and password-based encryption (PBE) support; per-account key isolation; signer auto-import on verify
- **Authentication** - OAuth2/OIDC with PKCE (Keycloak, Authentik, or built-in), OAuth-only mode, OAuth app passwords with optional IP allowlist, non-interactive SSO for embedded iframe deployments, TOTP two-factor authentication, encrypted Remember-me sessions (AES-256-GCM)
- **Admin & Extensibility** - Stalwart admin dashboard via JMAP `x:` methods (Stalwart 0.16+) collapsed into a single tabbed page, API keys management, IP allowlist for app passwords, dedicated policy sections, split admin storage (`ADMIN_CONFIG_DIR` mountable read-only after setup + `ADMIN_STATE_DIR` for runtime audit log), schema-driven plugin configuration UI, plugin render and intercept hooks including `onBeforeEmailSend` and `onAvatarResolve`, plugin i18n API, calendar event action slots, composer-sidebar and email-banner plugin slots, plugin hot-reload and dev-folder loading with on-demand `src/` bundling via esbuild, `http:fetch` permission with `httpOrigins`, manifest-declared `frameOrigins` merged into the host CSP, plugin sandboxing with dangerous-pattern detection and admin approval, theme upload as ZIP bundles with admin enforcement, and an extension marketplace (configured via `EXTENSION_DIRECTORY_URL`) - plugin/theme install and uninstall are admin-only
- **Bundled plugins** - Jitsi Meet for calendar video conferencing
- **Themes & branding** - Dark and light themes with intelligent HTML email color transformation, "always light" email option, custom favicon, sidebar logos, login logos, login company name and links, dynamic PWA manifest with configurable name, description, icons, theme color, and background color
- **Progressive Web App** - Service worker, install prompt with don't-ask-again option, configurable manifest, dynamic icons (192/512 + maskable variants), web push notifications for new inbox mail with click-through, automatic update detection with non-dismissible notice
- **Interface** - Selectable mail layouts (split three-pane, focused list, reading pane at bottom) with resizable columns, full keyboard navigation, drag-and-drop email organization and tag assignment, interactive guided tour, right-click context menus, toast notifications with undo, customizable toolbar position, pinnable sidebar apps with drag-and-drop reordering and mobile visibility toggle, encrypted settings sync across devices, storage quota display, WCAG AA contrast, reduced-motion support, focus trap, and screen reader live regions
- **Internationalization** - 15 languages (English, French, Japanese, Spanish, Italian, German, Dutch, Portuguese, Russian, Korean, Polish, Latvian, Simplified Chinese, Ukrainian, Czech) with auto-detection and configurable locale URL prefix via `NEXT_PUBLIC_LOCALE_PREFIX`
- **Custom JMAP endpoints & multi-server** - Optionally let users specify a JMAP server URL on the login form (`ALLOW_CUSTOM_JMAP_ENDPOINT`), and configure multiple JMAP servers per deployment with optional auto-pick by email domain
- **Subpath deployment** - Mount Bulwark under a URL prefix (e.g. `/webmail`) behind a reverse proxy via `NEXT_PUBLIC_BASE_PATH`
- **Operations** - Real-time push via JMAP, structured logging (`text` or `json`) with category-based levels, anonymous instance telemetry (opt-out via `BULWARK_TELEMETRY=off`), automatic update check on startup with server-side logging and a non-dismissible update notice, health check endpoint, demo mode with fixture data, release (`main`) and development (`dev`) Docker images on GHCR, native ARM runners
- **Security hardening** - DOMPurify HTML sanitization, external content blocked by default with trusted senders, SPF/DKIM/DMARC indicators, enforced CSP with per-request nonce, SSRF redirect validation, IP spoofing prevention, sandboxed PDF iframe

## Tech Stack

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

## Getting Help

- [GitHub Repository](https://github.com/bulwarkmail/webmail) - Source code and issue tracker
- [Stalwart Documentation](https://stalw.art/docs) - Mail server setup and configuration
- [JMAP Specification](https://jmap.io) - Protocol documentation
