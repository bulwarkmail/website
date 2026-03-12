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
  --background: #fafafa;
  --foreground: #0f172a;
  --primary: #db2d54;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #fde8ed;
  --border: #e2e8f0;
}
```

### Dark Theme Variables

```css
.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --primary: #db2d54;
  --muted: #1a1a1a;
  --muted-foreground: #a3a3a3;
  --border: #262626;
}
```

## Custom Logo

Set the `NEXT_PUBLIC_APP_LOGO` environment variable to use a custom logo:

```env
NEXT_PUBLIC_APP_LOGO=/path/to/your-logo.svg
```

## Custom App Name

Change the application name displayed in the header:

```env
NEXT_PUBLIC_APP_NAME=YourMail
```

## Custom CSS

For advanced customization, create a custom CSS file and import it in your deployment. This allows you to override any styles without modifying the source code.
