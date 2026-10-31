<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20White%20and%20Color.svg" />
  <source media="(prefers-color-scheme: light)" srcset="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20Dark%20Color.svg" />
  <img src="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20Dark%20Color.svg" alt="Bulwark" width="280" />
</picture>

# Bulwark website

The website and documentation for [Bulwark Webmail](https://github.com/bulwarkmail/webmail), in Next.js and Tailwind CSS.

</div>

---

## What's in here

Two things, both served from one Next.js app: the landing page at `/`, and the documentation at `/docs`, rendered from the Markdown under [`docs/`](docs/).

## Quick start

### Development

```bash
git clone https://github.com/bulwarkmail/website.git
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production build

```bash
npm run build
npm start
```

## Project structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Fonts, metadata, favicon, theme bootstrap script
│   ├── page.tsx              # Landing page
│   ├── docs/                 # Documentation index and [...slug] pages
│   ├── install/              # curl-able install script redirect
│   ├── api/docs-search/      # Docs search endpoint
│   ├── sitemap.ts, robots.ts
│   └── globals.css           # Tokens (raspberry, light and dark), editorial styles
├── components/
│   ├── install-choice.tsx    # Docker / static files tabs in the install section
│   ├── edition-quiz.tsx      # The /choose quiz
│   ├── theme-provider.tsx, theme-image.tsx
│   ├── navbar.tsx, footer.tsx, bulwark-mark.tsx
│   └── docs/                 # Sidebar, search, navbar, quickstart
└── lib/
    ├── docs.ts               # Markdown loading, front matter, search
    ├── editions.ts           # Front matter `edition:` for the page note and search tag
    └── og.ts                 # Open Graph card paths
docs/                         # Documentation content (Markdown with front matter)
├── getting-started/          # Introduction, editions, installation, Lite, configuration, demo
│   └── configuration/        # Stalwart setup, authentication, env reference
├── features/                 # Email, calendar, contacts, files, PWA, mobile, telemetry
│   └── email/                # Composing, search
├── deployment/               # Static hosting (Lite), Docker, manual, updating
│   └── docker/               # Compose, reverse proxy
├── guides/                   # Customization, shortcuts, embedded SSO, plugins,
│                             # account security, multi-account, S/MIME, marketplace,
│                             # admin, impersonation, troubleshooting
├── extensions/               # Extension directory: manifest, API, guidelines, publishing
├── development/              # Architecture, contributing
├── branding/                 # Brand guidelines
└── legal/                    # Privacy, telemetry terms
public/
├── branding/                 # Logos and favicons
├── screenshots/              # Product screenshots, light-/dark- pairs (docs, landing, press page)
├── beauty/                   # Framed versions for the press kit
├── press/                    # Press kit: logos, framed shots, cards, boilerplate
└── og-full.png               # Social card
```

Every image under `public/screenshots`, `public/beauty` and `public/press` is
generated from a demo instance of the webmail by the scripts in the
[branding repository](https://github.com/bulwarkmail/branding) (`scripts/README.md`
there); `node scripts/sync.mjs` copies them into this repo. Nothing is edited
by hand, so a UI change means running them again, not opening an editor.

## Tech stack

|               |                                                   |
| ------------- | ------------------------------------------------- |
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language**  | TypeScript                                        |
| **Styling**   | [Tailwind CSS v4](https://tailwindcss.com/)       |
| **Markdown**  | unified / remark / rehype pipeline                |
| **Icons**     | [Tabler Icons](https://tabler.io/icons)             |
| **Animation** | [Framer Motion](https://motion.dev/)              |

## Documentation

Documentation is written in Markdown under the `docs/` directory. Files use gray-matter frontmatter for metadata:

```md
---
title: Page Title
description: A brief description.
order: 1
---

# Content here
```

The documentation system supports:

- GitHub Flavored Markdown
- Syntax-highlighted code blocks with copy button
- Auto-generated sidebar navigation
- Full-text search
- An `edition: full | lite | both` front-matter field (default `both`) with an `editionNote:` sentence. Every page is shown to every reader; a page marked `full` or `lite` opens with a "Not in Lite." or "Bulwark Lite." note that carries the sentence, and search results get a small tag. Inside a page, `<div class="bw-note bw-note-brand"><b>Not in Lite.</b> …</div>` is an inline note.
- A `{{BULWARK_VERSION}}` token for the Bulwark release that works with Stalwart 1.0, usable in the body, the title and the description. The value is `BULWARK_VERSION` in `src/lib/version.ts`, which pages written in TSX import directly.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'docs: add my change'`)
4. Push to the branch (`git push origin feature/my-change`)
5. Open a Pull Request

## Related

- [Bulwark Webmail](https://github.com/bulwarkmail/webmail) - The webmail client
- [Stalwart Mail Server](https://github.com/stalwartlabs/mail-server) - The mail server Bulwark is built for
