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
5. Run tests: `npm test`
6. Commit with a descriptive message
7. Push to your fork and open a Pull Request

## Development Setup

```bash
git clone https://github.com/your-username/jmap-webmail.git
cd jmap-webmail
npm install
npm run dev
```

## Code Style

- We use **TypeScript** throughout the project
- Follow the existing code patterns
- Use **Tailwind CSS** for styling — avoid custom CSS where possible
- Components should be in `src/components/`
- Use `"use client"` directive only when necessary

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include a clear description of what changed and why
- Update documentation if your change affects user-facing behavior
- Ensure the build passes: `npm run build`
- Add tests for new features when applicable

## Reporting Issues

When reporting bugs, please include:

- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Stalwart Mail Server version

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
