<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20White%20and%20Color.svg" />
  <source media="(prefers-color-scheme: light)" srcset="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20Dark%20Color.svg" />
  <img src="public/branding/logo-with-lettering/Bulwark%20Logo%20with%20Lettering%20Dark%20Color.svg" alt="Bulwark" width="280" />
</picture>

# Bulwark Website

The official website and documentation for [Bulwark Webmail](https://github.com/bulwarkmail/webmail).<br/>
Built with Next.js and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## Overview

This repository contains the source code for the Bulwark project website, including:

- **Landing page** - Product showcase with features, screenshots, tech stack, deployment guides, and FAQ
- **Documentation** - Full docs covering installation, configuration, features, development, and deployment

## Quick Start

### Development

```bash
git clone https://github.com/bulwarkmail/website.git
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── docs/             # Documentation pages
│   ├── install/          # Install redirect
│   └── api/              # API routes (docs search)
├── components/           # React components
│   ├── docs/             # Documentation components
│   └── *.tsx             # Landing page sections
└── lib/                  # Utilities (markdown processing, etc.)
docs/                     # Documentation content (Markdown)
├── getting-started/      # Installation, configuration, intro
├── features/             # Email, calendar, contacts docs
├── development/          # Architecture, contributing
├── deployment/           # Docker, manual, reverse proxy
├── guides/               # Customization, keyboard shortcuts
└── branding/             # Brand guidelines
public/                   # Static assets
├── branding/             # Logos, favicons
└── screenshots/          # Product screenshots
```

## Tech Stack

|               |                                                   |
| ------------- | ------------------------------------------------- |
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language**  | TypeScript                                        |
| **Styling**   | [Tailwind CSS v4](https://tailwindcss.com/)       |
| **Markdown**  | unified / remark / rehype pipeline                |
| **Icons**     | [Lucide React](https://lucide.dev/)               |
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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit your changes (`git commit -m 'Add my change'`)
4. Push to the branch (`git push origin feature/my-change`)
5. Open a Pull Request

## Related

- [Bulwark Webmail](https://github.com/bulwarkmail/webmail) - The webmail client
- [Stalwart Mail Server](https://github.com/stalwartlabs/mail-server) - The mail server Bulwark is built for

## License

[MIT](LICENSE)
