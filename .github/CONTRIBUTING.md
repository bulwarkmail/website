# Contributing to Bulwark Website

Thank you for your interest in contributing! This repository contains the official website and documentation for [Bulwark Webmail](https://github.com/bulwarkmail/webmail).

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Create a feature branch: `git checkout -b feat/my-feature`
6. Make your changes
7. Run checks: `npm run lint`
8. Commit with a clear message (see [Commit Convention](#commit-convention))
9. Push and open a Pull Request

## What You Can Contribute

- **Documentation fixes** — typos, clarifications, better examples in `docs/`
- **New docs pages** — guides, tutorials, or missing topics
- **Website improvements** — UI fixes, accessibility, performance
- **Bug reports** — use the [bug report template](https://github.com/bulwarkmail/website/issues/new?template=bug_report.yml)
- **Feature requests** — use the [feature request template](https://github.com/bulwarkmail/website/issues/new?template=feature_request.yml)

## Editing Documentation

Documentation lives in the `docs/` directory as Markdown files with YAML frontmatter:

```markdown
---
title: Page Title
description: Short description shown in search and meta tags.
order: 1
---

# Page Title

Content here...
```

## Code Style

- **TypeScript** throughout — avoid `any`
- **Tailwind CSS** for styling — avoid custom CSS where possible
- Use `"use client"` only when necessary (client-side interactivity)

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New page, section, or feature |
| `fix:` | Bug or content fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, whitespace |
| `refactor:` | Code restructuring |
| `chore:` | Dependencies, tooling |

**Example:** `docs: add Caddy reverse proxy guide`

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Write a clear description of what changed and why
- Attach screenshots for visual changes
- Reference related issues with `Closes #123`
- Ensure `npm run build` passes before submitting

## Reporting Issues

Please use the issue templates and include as much context as possible. For security vulnerabilities, see [SECURITY.md](SECURITY.md).
