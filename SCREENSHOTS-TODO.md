# Screenshots and images

What image sets exist, where they live, how each one is produced, and what is
still missing. Every image on the site is generated from a running demo
instance of the webmail; nothing is edited by hand, so a UI change means
re-running a script, not opening an editor.

## The three sets

| Set | Folder | Size | Used by |
| --- | --- | --- | --- |
| Docs screenshots | `public/screenshots/` | 5120×2880 WebP (1280×720 layout at 4×), `light-`/`dark-` pairs | Feature and guide pages under `docs/` |
| Beauty shots | `public/beauty/` | 2400×1500 WebP, framed, `light-`/`dark-` pairs plus `split-inbox.webp` | Landing page hero and Surfaces section, press kit |
| Promo | `public/og-full.png`, `public/og-lite.png`, `public/press/` | 1200×630 PNG cards; the press kit copies the logos and beauty shots | `layout.tsx` / `page.tsx` metadata, footer "Press kit" link |

Docs embed both variants and let CSS pick one (`.theme-light-only` /
`.theme-dark-only`); the browser still downloads both, which is why everything
is WebP. Declare the true intrinsic size on every `<img>` so the browser
reserves the right box.

```html
<img class="theme-light-only" src="/screenshots/light-NAME.webp" alt="..." width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-NAME.webp" alt="..." width="5120" height="2880" />
```

## Running the app for captures

Everything shoots against the demo backend (`DEMO_MODE=true`), so no real
addresses or subjects can leak into a published image. Two things matter:

- **Admin config wins over the environment.** The webmail's config manager
  reads the admin config directory first, so a checkout whose `data/admin`
  already holds `demoMode: false` ignores `DEMO_MODE=true`. Point the admin
  dirs at a scratch directory.
- **`APP_NAME` and the login page.** `.env.local` sets "Bulwark Webmail
  (Dev)"; a shell override wins, so pass the clean name.

From the webmail checkout:

```bash
S=/tmp/bulwark-shots; mkdir -p $S/admin $S/admin-state $S/telemetry
export DEMO_MODE=true DEV_MOCK_JMAP=false APP_NAME="Bulwark Webmail" LOGIN_COMPANY_NAME="Bulwark Webmail" \
  ADMIN_CONFIG_DIR=$S/admin ADMIN_STATE_DIR=$S/admin-state TELEMETRY_DATA_DIR=$S/telemetry \
  ADMIN_PASSWORD=screenshots-only BULWARK_UPDATE_CHECK=off
npm run dev
# wait for a real 200, Turbopack compiles routes on first request:
until [ "$(curl -s -m 20 -o /dev/null -w '%{http_code}' http://localhost:3000/login)" = "200" ]; do :; done
curl -s http://localhost:3000/api/config | grep -o '"demoMode":[a-z]*'   # must say true
```

The `bulwark-screenshots` skill (`~/.claude/skills/bulwark-screenshots/`) has
the longer version of this, including the lock-file and stray-process gotchas.

## Docs screenshots

Captured by the skill's driver:

```bash
node ~/.claude/skills/bulwark-screenshots/shoot.js light /tmp/shots
node ~/.claude/skills/bulwark-screenshots/shoot.js dark  /tmp/shots
```

Produces `<theme>-{inbox,viewer,composer,calendar,contacts,contacts-detail,files,settings,settings-appearance,themes,vacation}.webp`.
Review them, then copy into `public/screenshots/`. Never point a driver
straight at `public/`: a failed run overwrites committed assets.

`calendar-create`, `admin-overview` and `admin-plugins` come from the beauty
driver below (`scripts/shoot-beauty.mjs` writes them as PNG; convert with
sharp at q82 before promoting). They are 2560×1440, declared as such.

| Page | Images |
| --- | --- |
| `features/email.md` | `viewer`, `inbox`, `vacation` |
| `features/calendar.md` | `calendar`, `calendar-create` |
| `features/contacts.md` | `contacts-detail` |
| `features/files.md` | `files` |
| `features/email/composing.md` | `composer` |
| `guides/customization.md` | `settings-appearance`, `themes` |
| `guides/account-security.md` | `settings` |
| `guides/admin.md` | `admin-overview`, `admin-plugins` |

`contacts` (list, right pane empty) is captured but unused.

## Beauty shots

Two scripts in `scripts/`, both resolving Playwright from the webmail checkout
(`BULWARK_REPO`, default `../..`) and sharp from this site's `node_modules`, so
the site takes on no dependency:

```bash
# 1. raw captures (desktop 1280x720 @2x, phone 390x844 @3x), both themes
SHOOT_ADMIN_PASSWORD=screenshots-only node scripts/shoot-beauty.mjs all .beauty-staging

# 2. frame them: browser window on paper/navy, laptop+phone pair, light/dark split
node scripts/frame-beauty.mjs .beauty-staging public/beauty
```

Captures: `inbox`, `composer`, `search` (global search palette, Pro shell),
`calendar-week`, `contact`, `files`, `pro`, `phone-inbox`, `phone-message`,
plus the docs extras above. Frames are WebP capped at 400 KB (quality steps
down until it fits); the current set is 30–160 KB each.

The **login** shot needs the credential form. The demo backend shows a single
"Launch Demo" button and the dev-mock backend signs in by itself, so run the
server with both off and any server URL (nothing connects for a screenshot),
and capture only the login page:

```bash
# in the webmail checkout, with the scratch admin dirs from above
export DEMO_MODE=false DEV_MOCK_JMAP=false JMAP_SERVER_URL=https://mail.example.com APP_NAME="Bulwark Webmail"
npm run dev
# in the website checkout
SHOOT_ONLY=login node scripts/shoot-beauty.mjs all .beauty-staging
node scripts/frame-beauty.mjs .beauty-staging public/beauty
```

Things the driver knows that took a while to find out:

- The global search palette only exists in the Pro shell; the standard rail has
  no search entry. Ctrl+K toggles it there.
- Flipping the "Pro Interface" switch in Settings → Layout is enough to land in
  `/pro`; the address bar then follows the focused tab, so the URL is no signal.
  The driver checks for the tab strip instead.
- The demo blobs carry no bytes, so a file *preview* renders empty. The files
  shot shows the grid instead.
- Closing a dirty composer asks "Save or discard draft?", and the recipient
  autocomplete popover covers the subject field until you Tab past it.
- The fixture events sit in the second half of the month; the week shot steps
  one week ahead and scrolls to 07:00.

## Promo

```bash
node scripts/og.mjs        # public/og-full.png, public/og-lite.png
```

The press kit in `public/press/` is a copy: `logos/` from `public/branding`,
`beauty/` from `public/beauty`, the two cards, and `README.md` with the
boilerplate. Re-copy after regenerating either source.

The Stalwart 1.0 launch set renders into `public/press/launch/` from the
committed inbox and week-view screenshots, so it needs no running app:

```bash
node scripts/launch-images.mjs                  # every board
node scripts/launch-images.mjs card header      # only the boards named
node scripts/launch-images.mjs header --guides  # adds profile-header-guides.png
```

It writes four 1200×630 link cards (`og-{full,lite}-{light,dark}.png`),
`post.png` (1600×900), `square.png` (1080×1080) and `profile-header.png`
(1500×500). The ticks on the post and the square claim features checked on a
1.0 server. The note at the top of the script says which ones were, and Push
still needs a check through a live relay before anything is published.

## Still to shoot

1. **Setup wizard** (`getting-started/installation.md`). Needs an instance with
   empty admin dirs and no `JMAP_SERVER_URL` at all (an empty value is still
   "set"), and a reachable JMAP server for the green probe result. Suggested:
   `light/dark-setup-server`, `-setup-branding`, `-setup-review`.
2. **Marketplace** (`guides/marketplace.md`). The admin session plus a
   reachable `EXTENSION_DIRECTORY_URL`.
3. **Login with OAuth** (`configuration/authentication.md`, `guides/embedded-sso.md`).
   Needs `OAUTH_ENABLED=true` against a real issuer.
4. **A file preview open** (`features/files.md`). Needs fixtures whose blobs
   carry real bytes; today the preview is a broken image.
5. **Search chips** (`features/email/search.md`), **S/MIME banners**
   (`guides/smime.md`), **PWA install prompt** and the **native app**
   (`features/pwa.md`, `features/mobile.md`), **plugin slot in situ**
   (`guides/plugins.md`), **telemetry payload preview** (`features/telemetry.md`),
   **impersonation banner** (`guides/impersonation.md`).

## Diagrams rather than screenshots

- `development/architecture.md` still uses an ASCII box diagram; a theme-aware
  SVG (browser ↔ Stalwart direct, Next.js server off to the side, and the Lite
  variant with no server at all) would carry the point better.
- `guides/embedded-sso.md`: a sequence diagram of the server-side PKCE flow.
- `guides/multi-account.md`: push streams multiplexing over HTTP/2 versus
  queuing on HTTP/1.1.

## Pages that need no image

Deployment, extensions API and manifest, environment reference, contributing,
legal. Reference and configuration text; screenshots would only rot.
