---
title: Customization
description: Customize the look and feel of Bulwark.
order: 1
---

# Customization

Bulwark is designed to be easily customizable to match your brand.

## Theming

Bulwark uses CSS custom properties for theming. Override them to change colors across the entire application.

### Light Theme Variables

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f8fafc;
  --color-secondary-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #dbeafe;
  --color-accent-foreground: #1e40af;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #94a3b8;
}
```

### Dark Theme Variables

```css
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-primary: #fafafa;
  --color-primary-foreground: #171717;
  --color-secondary: #262626;
  --color-secondary-foreground: #fafafa;
  --color-muted: #262626;
  --color-muted-foreground: #a3a3a3;
  --color-accent: #1e3a8a;
  --color-accent-foreground: #dbeafe;
  --color-border: #262626;
}
```

### Theme Modes

Bulwark supports three theme modes: **light**, **dark**, and **system** (follows OS preference). The selected theme is persisted in `localStorage` and applied via Zustand state management.

## Custom App Name

Change the application name displayed in the UI:

```env
APP_NAME=YourMail
```

## Custom Favicon

Replace the browser tab icon with your own:

```env
FAVICON_URL=/branding/my-favicon.svg
```

| Property | Requirement |
|---|---|
| **Formats** | SVG (recommended), PNG, ICO |
| **Minimum size** | 32×32px |
| **Maximum size** | 512×512px |
| **Recommendation** | Use SVG for crisp rendering at all resolutions |

Place your favicon file in the `public/branding/` directory, or provide an absolute URL.

When not set, the default Bulwark favicon is used.

## App Logo (Sidebar)

Add your brand logo to the sidebar header (visible in the main app after login):

```env
APP_LOGO_LIGHT_URL=/branding/my-logo-color.svg
APP_LOGO_DARK_URL=/branding/my-logo-white.svg
```

| Property | Requirement |
|---|---|
| **Formats** | SVG (recommended), PNG, WebP |
| **Minimum size** | 24×24px |
| **Maximum size** | 128×128px |
| **Display size** | 24×24px |

If only one variant is provided, it is used for both light and dark modes. If neither is set, no logo appears in the sidebar.

## Login Page Logo

Customize the logo on the login page:

```env
LOGIN_LOGO_LIGHT_URL=/branding/my-login-logo.svg
LOGIN_LOGO_DARK_URL=/branding/my-login-logo-white.svg
```

| Property | Requirement |
|---|---|
| **Formats** | SVG (recommended), PNG, WebP |
| **Minimum size** | 32×32px |
| **Maximum size** | 512×512px |
| **Display size** | 64×64px |

When not set, the default Bulwark logo is used.

## Login Page Branding

Customize the login page with company information:

```env
LOGIN_COMPANY_NAME=Your Company
LOGIN_WEBSITE_URL=https://yourcompany.com
LOGIN_IMPRINT_URL=https://yourcompany.com/imprint
LOGIN_PRIVACY_POLICY_URL=https://yourcompany.com/privacy
```

## In-App Settings

Users can customize their experience from the Settings page:

- **Font size** - Small, medium, or large
- **List density** - Compact, regular, or comfortable
- **Animations** - Enable or disable UI animations
- **Date format** - Regional, ISO, or custom
- **Time format** - 12-hour or 24-hour
- **First day of week** - Sunday or Monday
- **External content** - Ask, block, or allow by default
- **Toolbar position** - Top or below subject
- **Mark as read delay** - Instant, delayed, or never
- **Delete action** - Move to trash or permanent delete

## Structured Logging

Configure log output format and verbosity:

```env
LOG_FORMAT=text   # "text" or "json"
LOG_LEVEL=info    # "debug", "info", "warn", "error"
```
