---
title: Contributing
description: Set up a development environment, run the tests, and get a change merged.
order: 1
edition: both
---

# Contributing

Bulwark is AGPL-licensed and developed in public on [GitHub](https://github.com/bulwarkmail/webmail). Bug reports, feature requests, translations and patches are all welcome, and you don't need to be an expert to send one.

If your dev environment won't start, a bug is hard to pin down or a translation has you stuck, ask on the [Discord server](https://discord.gg/tYCujymGrT). That is also where the maintainers and other contributors talk.

## Development setup

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
npm install
cp .env.dev.example .env.local
npm run dev
```

Then open `http://localhost:3000`. The `.env.dev.example` file turns on the built-in mock JMAP server (`DEV_MOCK_JMAP=true`), so you can develop without a mail server and sign in with any username and password. To work against a real server instead, copy `.env.example` and set `JMAP_SERVER_URL`. The [environment reference](/docs/getting-started/configuration/environment-reference) lists every other variable.

For a tour of the code before you change it, read [Architecture](/docs/development/architecture).

## Checks and tests

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run lint:fix    # ESLint, fixing what it can
```

Husky runs these on every commit, and CI runs the unit tests on every push and pull request.

| Suite | Command | What it covers |
| --- | --- | --- |
| Unit | `npx vitest run` | Vitest with jsdom. Tests live in `__tests__/` folders next to the code |
| Translations | `npm run test:translations` | Locale files checked for structural drift against English |
| Integration | `npm run test:integration` | Playwright against a real Stalwart server in Docker |
| Lite smoke | `npm run test:lite-smoke` | Playwright against a demo [Lite](/docs/getting-started/lite) export |

Run a single unit test file with `npx vitest run lib/__tests__/<name>.test.ts`, or `npx vitest` to watch.

The integration suite needs Docker and takes several minutes. It has its own setup notes and findings log in [integration/README.md](https://github.com/bulwarkmail/webmail/blob/main/integration/README.md). New behaviour that touches mail or folder synchronization, or multi-account handling, belongs there.

## Project structure

```
webmail/
├── app/                      # Next.js App Router
│   ├── (main)/[locale]/     # Locale-aware app pages (mail, calendar, contacts, files, settings)
│   ├── (main)/admin/        # Admin dashboard
│   ├── (main)/setup/        # First-launch setup wizard
│   ├── (sandbox)/           # Isolated plugin sandbox routes
│   └── api/                 # Route handlers (auth, admin, jmap, caldav, …)
├── components/              # React components, by feature
│   ├── email/               # Email list, viewer, composer
│   ├── calendar/ contacts/ files/ filters/ templates/
│   ├── layout/              # Sidebar, shell, navigation
│   ├── settings/            # Settings panels
│   ├── plugins/             # Plugin host UI
│   └── ui/                  # Reusable primitives
├── contexts/                # React contexts
├── hooks/                   # Custom React hooks
├── i18n/                    # next-intl routing, locale detection, RTL direction
├── lib/                     # Utilities and libraries
│   ├── jmap/                # JMAP client implementation
│   ├── stalwart/            # Stalwart-specific admin/API helpers
│   ├── admin/ auth/ oauth/  # Config, sessions, OAuth flows
│   └── plugin-sandbox/      # Plugin sandbox bridge and hardening
├── locales/                 # Translation files, one directory per locale
├── stores/                  # Zustand state stores
├── public/                  # Static assets and branding
└── integration/             # Dockerized Stalwart + Playwright suite
```

## Code style

- TypeScript for all new code, with proper types and interfaces. Avoid `any`.
- Functional components with hooks. Keep components focused, and pull reusable logic into a custom hook under `hooks/`.
- Put `"use client"` only where it is needed.
- Reusable UI primitives go in `components/ui/`; state lives in Zustand stores under `stores/`.
- Style with Tailwind utility classes and the existing theme CSS variables, and check both the light and dark theme. Reach for custom CSS only when Tailwind can't express it.

## Translations

Translation runs through **next-intl**, currently across 27 languages: Arabic, Catalan, Czech, Danish, Dutch, English, Farsi, French, German, Hebrew, Hungarian, Italian, Japanese, Korean, Latvian, Mongolian, Norwegian Bokmål, Polish, Portuguese, Romanian, Russian, Simplified Chinese, Slovak, Spanish, Traditional Chinese, Turkish and Ukrainian. English (`locales/en/common.json`) is the source of truth.

1. **Never hardcode user-facing text.** Always go through a translation:

   ```tsx
   const t = useTranslations("namespace");
   return <div>{t("key")}</div>;
   ```

2. **Add new keys to `en/common.json` first.** Other locales can follow in the same pull request or a later one; missing keys fall back to English.

3. **Use the existing namespaces**: `login.*`, `sidebar.*`, `email_list.*`, `email_viewer.*`, `email_composer.*`, `settings.*`, `calendar.*`, `contacts.*`, `notifications.*`, `common.*`.

4. **Keep navigation locale-aware**: ``router.push(`/${params.locale}/settings`)``.

### Right-to-left layouts

Arabic, Farsi and Hebrew render right to left (see `i18n/direction.ts`). Use Tailwind's logical utilities (`ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`) rather than physical ones (`ml-*`, `pl-*`, `left-*`) so layouts flip correctly. Popovers positioned in JavaScript with `getBoundingClientRect()` don't pick up logical utilities, so check `isDocumentRTL()` there.

### Adding a locale

A new locale takes edits in four places:

1. `locales/<code>/common.json`: copy `locales/en/common.json` and translate it.
2. `i18n/routing.ts`: add the code to `SUPPORTED_LOCALES`.
3. `i18n/request.ts`: add a `case` to the static-import switch.
4. `components/ui/language-switcher.tsx`: add `{ value, label }` with the language's **native** name, plus a flag in `components/ui/flag-icons.tsx`.

For a right-to-left language, also add the code to `rtlLocales` in `i18n/direction.ts`. Run `npm run test:translations` afterwards.

## Pull requests

1. Fork the repository and create a branch: `git checkout -b feature/my-feature`.
2. Make the change, with unit tests for new logic and translations for new text.
3. Run everything: `npm run typecheck && npm run lint && npx vitest run`, and `npm run build` for changes that touch the build.
4. Push to your fork and open a pull request.

In the pull request:

- Keep it to one change.
- Say what changed and why.
- Add screenshots for UI changes.
- Reference the issues it relates to.

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | For |
| --- | --- |
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | Formatting and other changes with no effect on behaviour |
| `refactor:` | Restructuring without changing behaviour |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance |

```
feat: add email threading support
fix: resolve attachment download issue
```

## Documentation

The documentation lives in the [website repository](https://github.com/bulwarkmail/website) under `docs/`, one Markdown file per page. If your change alters behaviour a page describes, update that page too, or mention it in your pull request.

## Reporting issues

Open an [issue on GitHub](https://github.com/bulwarkmail/webmail/issues) and include:

- Browser and version
- Stalwart version
- Steps to reproduce
- Expected and actual behaviour
- Screenshots, if they help

## Security

- Never commit secrets: API keys, passwords, tokens or `.env*` files.
- Sanitize user input and email content.
- Keep remote content in emails blocked by default.
- Report vulnerabilities privately to [dev@bulwarkmail.org](mailto:dev@bulwarkmail.org) or through a [GitHub security advisory](https://github.com/bulwarkmail/webmail/security/advisories/new), never in a public issue.

## License

By contributing, you agree that your contributions are licensed under the [GNU Affero General Public License v3 (AGPL-3.0-only)](https://www.gnu.org/licenses/agpl-3.0.html).
