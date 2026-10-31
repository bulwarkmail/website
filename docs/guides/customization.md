---
title: Customization
description: Customize the look and feel of Bulwark.
order: 3
edition: both
---

# Customization

Branding is set in one of three places. Values saved by the wizard or the dashboard win; environment variables fill in whatever they leave unset (in Bulwark Lite the same keys live in `config.json`, camel-cased; see [static hosting](/docs/deployment/static)):

- **Setup wizard** - the first-launch UI accepts file uploads for favicon, app logos, and login logos, along with company/legal URLs.
- **Admin dashboard** - Update branding at any time after setup without restarting.
- **Environment variables** - Env-driven branding for deployments that never open the dashboard. A value saved in the admin config takes priority over the variable.

<img class="theme-light-only" src="/screenshots/light-admin-branding.webp" alt="The Branding page in the admin console, with an entry for one web address" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-branding.webp" alt="The Branding page in the admin console, with an entry for one web address" width="5120" height="2880" />

## Theming

Colors come from CSS custom properties. Override them and the change propagates through the whole app.

<img class="theme-light-only" src="/screenshots/light-settings-appearance.webp" alt="Appearance settings: theme, font size, and density with a live preview" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-settings-appearance.webp" alt="Appearance settings: theme, font size, and density with a live preview" width="5120" height="2880" />

### Light theme variables

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-primary: #185aea;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f8fafc;
  --color-secondary-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #59687c;
  --color-accent: #dbeafe;
  --color-accent-foreground: #1e40af;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #2563eb;
}
```

### Dark theme variables

```css
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-primary: #fafafa;
  --color-primary-foreground: #171717;
  --color-secondary: #262626;
  --color-secondary-foreground: #fafafa;
  --color-muted: #262626;
  --color-muted-foreground: #adadad;
  --color-accent: #1e3a8a;
  --color-accent-foreground: #dbeafe;
  --color-border: rgba(128, 128, 128, 0.3);
  --color-input: #262626;
  --color-ring: #d4d4d4;
}
```

`app/globals.css` defines about 40 color tokens, including sidebar, card, popover and status colors. The ones above are the set worth overriding first, since almost everything else inherits from them.

### Theme modes

Three modes: light, dark, and system, which follows the OS preference. The choice is kept in `localStorage` and applied from a Zustand store.

### Built-in color themes

<img class="theme-light-only" src="/screenshots/light-themes.webp" alt="Theme picker, each card a mini mailbox drawn in that theme's colors" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-themes.webp" alt="Theme picker, each card a mini mailbox drawn in that theme's colors" width="5120" height="2880" />

Seven color themes ship with Bulwark alongside the default, among them Aurora Glass and Roundcube Elastic. In Appearance settings each one renders as a card: a miniature mailbox drawn in that theme's own colors, with light and dark variant chips, so you see both modes before you commit. Clicking the theme that's already active does nothing. Admins can add more themes as ZIP bundles in the admin console or from the marketplace, set the default and force one theme on for everybody.

## App name

Change the application name displayed in the UI:

```env
APP_NAME=YourMail
```

## Favicon

Replace the browser tab icon with your own:

```env
FAVICON_URL=/branding/my-favicon.svg
```

Uploads in the setup wizard and the admin console take SVG, PNG, JPEG, WebP or ICO files up to 2 MB, for the favicon and both logos. Bulwark checks no pixel sizes; SVG stays sharp at every size.

Place your favicon file in the `public/branding/` directory, or provide an absolute URL.

When not set, the default Bulwark favicon is used.

## PWA branding

When users install Bulwark as a Progressive Web App, the manifest is generated dynamically from the runtime config. You can customize the install experience and the splash screen:

```env
APP_NAME=Acme Mail
APP_SHORT_NAME=Acme              # Home screen label, defaults to APP_NAME
APP_DESCRIPTION=Acme webmail     # Shown by the OS during install
PWA_ICON_URL=/branding/acme-icon.svg
PWA_THEME_COLOR=#0f172a          # Browser UI chrome color (status bar on Android)
PWA_BACKGROUND_COLOR=#ffffff     # Splash screen background
```

| Variable               | Purpose                                                               | Default                  |
| ---------------------- | --------------------------------------------------------------------- | ------------------------ |
| `APP_SHORT_NAME`       | Short label on the home screen and install prompt                     | falls back to `APP_NAME` |
| `APP_DESCRIPTION`      | Description shown by the OS install dialog                            | generic description      |
| `PWA_ICON_URL`         | Source image used to auto-generate 192/512 PNG plus maskable variants | `FAVICON_URL`            |
| `PWA_THEME_COLOR`      | Color applied to the browser UI when launched as a PWA                | `#ffffff`                |
| `PWA_BACKGROUND_COLOR` | Splash screen background while the app is loading                     | `#ffffff`                |

Bulwark generates the 192 and 512 px icons, regular and maskable, from `PWA_ICON_URL` (or `FAVICON_URL`), so one source image is enough. SVG is recommended for best quality at all sizes; if PNG, use ≥512×512px.

For more on PWA features (install flow, service worker, install-prompt UX), see the [Progressive Web App](/docs/features/pwa) page.

## Sidebar logo

Add your brand logo to the top of the navigation rail (visible in the main app after login):

```env
APP_LOGO_LIGHT_URL=/branding/my-logo-color.svg
APP_LOGO_DARK_URL=/branding/my-logo-white.svg
```

The logo shows at 32×32 at the top of the navigation rail, and in the top bar of the Mountain View layout.

If only one variant is provided, it is used for both light and dark modes. If neither is set, no logo appears in the sidebar.

## Login page logo

Customize the logo on the login page:

```env
LOGIN_LOGO_LIGHT_URL=/branding/my-login-logo.svg
LOGIN_LOGO_DARK_URL=/branding/my-login-logo-white.svg
```

The login logo fits a 64×64 box unless you set `LOGIN_LOGO_MAX_HEIGHT` or `LOGIN_LOGO_MAX_WIDTH` (any CSS length, such as `230px`), which helps with a wide wordmark.

When not set, the default Bulwark logo is used.

## Login page branding

Customize the login page with company information:

```env
LOGIN_COMPANY_NAME=Your Company
LOGIN_WEBSITE_URL=https://yourcompany.com
LOGIN_IMPRINT_URL=https://yourcompany.com/imprint
LOGIN_PRIVACY_POLICY_URL=https://yourcompany.com/privacy
```

## In-app settings

Settings has its pages in three groups: Account, Security, Sharing, Notifications, General, Appearance and Accessibility; then Message list, Reading, Composing, Folders & tags, Filters, Out of office and Recover deleted items for mail; then Calendar, Contacts, Files and Add-ons. Backup & reset comes last. Some pages only show when the server supports the feature or the admin turned it on, and the search box at the top finds any option. The main preferences, by topic:

### Appearance and layout

- **Density** (Appearance) - Extra compact, Compact, Regular or Comfortable (the two compact settings hide the preview line)
- **Text size** and **Reduce motion** - on the Accessibility page; text size goes from 87.5% to 200%
- **Theme** - Light, dark, or system
- **Always show emails in light mode** - Avoid dark-mode color transformation for problematic HTML mail
- **Toolbar position** - Top or below subject
- **Interface layout** - Default, or Mountain View, which arranges search, navigation and toolbars the way Gmail does
- **Inbox type** - In Mountain View, **Unread first** shows your 25 newest unread messages in an Unread section above Everything else
- **Mail layout** - Choose between split (three-pane), focused list, and reading pane at bottom
- **Hover actions** - Choose which quick-actions appear and their placement (with avatar in Focused list for compact density and above)
- **Sidebar apps** (Add-ons) - Add your own apps and links to the navigation rail, reorder them and choose which show on phones
- **Account switcher visibility** - Hide or show the account switcher in the sidebar
- **Account avatars** - Show account avatars on the navigation rail
- **Junk folder avatars** - Show or hide avatars in the Junk folder (off by default)
- **Folder expansion** - Folder expansion state is remembered across sessions

### Date and time

- **Date format** - Smart, Relative or Always full date
- **Date format region** - Automatic, ISO 8601, Day/Month/Year or Month/Day/Year
- **Time format** - 12-hour or 24-hour, applied consistently across calendar and email
- **Time zone** - Follow the browser, or pick a zone explicitly
- **First day of week** - Sunday or Monday
- **Show time in month view** - Display event start time in the month view
- **Show week numbers** - In the mini-calendar
- **Birthday calendar** - Toggle the auto-generated birthday calendar
- **Hover preview** - Configure calendar event hover preview behavior

### Mail behavior

- **Conversation threading** - Enable or disable
- **Mark as read delay** - Instant, delayed (configurable), or never
- **Delete action** - Move to trash or permanent delete
- **Archive mode** - Direct, by year, or by year/month
- **Attachment position** - Next to sender or Below header
- **Composer mode** - Rich text or plain text only
- **Auto-select reply identity** - Match reply identity to original recipient, by exact address or by domain
- **Message list order** - Unread, starred or tagged first, or custom sort levels, for the Inbox or every folder
- **Reply-to addresses** - Configure reply-to in the composer
- **Signature position** - Above or below quoted text, per identity (searchable from settings)
- **From-header override** - Allow overriding the From header in the composer for catch-all aliases
- **Sub-addressing delimiter** - Customize the character separating user and tag in plus-addressing (`user+tag@…`)
- **External content** - Ask, block, or allow by default
- **Forgotten attachment warning** - Detect attachment-related keywords in the body and warn before send
- **Quick reply** - Show or hide the quick reply box below messages
- **Default mail program** - Register Bulwark as the system mail handler

### Notifications

- **Notification sound picker** - Choose from bundled sounds with preview playback

### Contacts and calendar

- **Group contacts by first letter** - Toggle A-Z grouping with sticky section headers
- **Sort contacts by** - First or last name
- **Free scrolling** - Continuous month, week and day views, or one period at a time


## Structured logging

Configure log output format and verbosity:

```env
LOG_FORMAT=text   # "text" or "json"
LOG_LEVEL=info    # "debug", "info", "warn", "error"
```

`LOG_LEVEL` applies to the whole server. Use `LOG_FORMAT=json` for log collectors such as Loki, Elastic or Splunk.

Set both as environment variables. In 1.19.1 the log format and level that the setup wizard and the admin console's Server page save have no effect.
