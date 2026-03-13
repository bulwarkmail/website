---
title: Contributing
description: How to contribute to the Bulwark project.
order: 1
---

# Contributing

We welcome contributions to Bulwark! Whether it's bug reports, feature requests, or code contributions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Run checks: `npm run typecheck && npm run lint`
6. Commit with a descriptive message (see commit conventions below)
7. Push to your fork and open a Pull Request

## Development Setup

```bash
git clone https://github.com/your-username/jmap-webmail.git
cd jmap-webmail
npm install
cp .env.dev.example .env.local
npm run dev
```

The `.env.dev.example` enables the built-in mock JMAP server so you can develop without an external mail server.

### Code Quality Commands

```bash
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
npm run lint:fix    # Auto-fix lint issues
```

These checks run automatically on commit via Husky pre-commit hooks.

## Code Style

- We use **TypeScript** throughout the project
- Follow the existing code patterns and define proper types (avoid `any`)
- Use **Tailwind CSS** for styling — avoid custom CSS where possible
- Components are in `components/` organized by feature (email, calendar, contacts, layout, ui)
- Use `"use client"` directive only when necessary
- Reusable UI primitives go in `components/ui/`
- Custom hooks go in `hooks/`
- State management uses **Zustand** stores in `stores/`

## Internationalization (i18n)

This project uses **next-intl** for internationalization with 8 supported languages. Key rules:

1. **Never hardcode user-facing text** — Always use translations:
   ```tsx
   const t = useTranslations('namespace');
   return <div>{t('key')}</div>;
   ```

2. **Translation files** are in `/locales/{lang}/common.json`

3. **When adding new strings**, add to at least the English (`en`) and French (`fr`) translation files

4. **Namespace examples**: `login.*`, `sidebar.*`, `email_list.*`, `email_viewer.*`, `email_composer.*`, `common.*`, `settings.*`, `calendar.*`, `contacts.*`

## Commit Message Convention

Follow the conventional commits format:

- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

```
feat: add email threading support
fix: resolve attachment download issue
docs: update README with keyboard shortcuts
```

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include a clear description of what changed and why
- Include screenshots for UI changes
- Reference any related issues
- Update translations if your change affects user-facing text
- Ensure the build passes: `npm run build`

## Reporting Issues

When reporting bugs, please include:

- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Stalwart Mail Server version

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
