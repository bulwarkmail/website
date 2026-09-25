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
│   ├── layout.tsx            # Fonts, metadata, theme + edition bootstrap script
│   ├── page.tsx              # Landing page (edition-aware copy and quick start)
│   ├── docs/                 # Documentation index and [...slug] pages
│   ├── install/              # curl-able install script redirect
│   ├── api/docs-search/      # Docs search endpoint (edition-aware)
│   ├── sitemap.ts, robots.ts
│   └── globals.css           # Tokens (raspberry / Lite teal), editorial styles
├── components/
│   ├── edition-provider.tsx  # data-edition on <html>, ?edition= deep links
│   ├── edition-switch.tsx    # "Bulwark | Lite" radiogroup
│   ├── edition-link.tsx      # Link that carries the edition into the URL
│   ├── theme-provider.tsx, theme-image.tsx
│   ├── navbar.tsx, footer.tsx, bulwark-mark.tsx
│   └── docs/                 # Sidebar, search, navbar, edition banner, quickstart
└── lib/
    ├── docs.ts               # Markdown loading, front matter (incl. edition), search
    └── og.ts                 # Open Graph card paths
docs/                         # Documentation content (Markdown, front matter `edition:`)
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
scripts/
├── shoot-beauty.mjs          # Raw beauty captures from a demo instance (Playwright)
├── frame-beauty.mjs          # Frames them into public/beauty (WebP)
├── og.mjs                    # Renders the Open Graph cards
└── lib/render.mjs            # Shared headless-Chromium/sharp helpers
public/
├── branding/                 # Logos, favicons (raspberry and Lite teal)
├── screenshots/              # Docs screenshots, light-/dark- pairs
├── beauty/                   # Framed hero shots for the landing page
├── press/                    # Press kit: logos, beauty shots, cards, boilerplate
└── og-full.png, og-lite.png  # Social cards per edition
```

See `SCREENSHOTS-TODO.md` for how every image is produced.

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
- An `edition: full | lite | both` front-matter field (default `both`). The site-wide "Bulwark | Lite" switch hides pages of the other edition from the sidebar, index and search, and shows a banner on one you land on directly. Inside a page, `<div class="lite-callout">…</div>` renders an inline "not in Lite" note.
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
