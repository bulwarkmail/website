# Screenshot and image plan

Where visuals would earn their place in the docs, what already exists, and what
is dead weight in `public/`.

Every doc screenshot uses the light/dark pair pattern already established in
`features/calendar.md`:

```html
<img class="theme-light-only" src="/screenshots/light-NAME.webp" alt="..." width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-NAME.webp" alt="..." width="5120" height="2880" />
```

Capture with the `bulwark-screenshots` skill, which runs the app on the demo
fixtures (`DEMO_MODE=true`) so no real addresses or subjects can leak into a
published image. Output is 5120×2880 WebP: a 1280×720 layout rendered at 4x.

---

## Already covered

| Page | Image |
| --- | --- |
| `features/email.md` | `light/dark-inbox`, `light/dark-viewer`, `light/dark-vacation` |
| `features/calendar.md` | `light/dark-calendar`, `light/dark-calendar-create` |
| `features/contacts.md` | `light/dark-contacts-detail` |
| `features/files.md` | `light/dark-files` |
| `features/email/composing.md` | `light/dark-composer` |
| `guides/customization.md` | `light/dark-settings-appearance`, `light/dark-themes` |
| `guides/account-security.md` | `light/dark-settings` |

`light/dark-pane-at-bottom` exists and is used on the landing page only.
`light/dark-contacts` (list with the right pane empty) is captured but unused;
the detail view says more.

### How the current set was captured

The `bulwark-screenshots` skill does all of it. In short: `DEMO_MODE=true npm run dev`,
then Playwright with a 1280×720 layout at 4× device scale, `colorScheme` forced
per theme, `Accept-Language: en-US` (the app otherwise follows the browser and
renders German), and the dev overlay plus the demo-mode badge hidden by an
injected style. Navigation is **in-app** by clicking the rail, because a full
`page.goto` to an app route drops the session and lands you on the login page.

`DEV_MOCK_JMAP` is the wrong backend for this. It doesn't advertise the FileNode
capability, so the Files app is hidden from the rail entirely, and its message
subjects differ, so the driver's click targets miss.

---

## Still to shoot

These need a state the demo backend can't produce on its own, which is why they
weren't captured in the first pass.

1. **`getting-started/installation.md` — the setup wizard.** The most valuable
   remaining image. Three shots: the Server step mid-probe (with a green
   result), the Branding step with uploads, and the Review step. Nobody trusts a
   wizard they haven't seen.
   To reach it: run with `ADMIN_CONFIG_DIR` and `ADMIN_STATE_DIR` pointed at an
   empty scratch directory and **no** `JMAP_SERVER_URL`, which is what makes the
   wizard run. Don't use the real data dir, or you will re-run setup against a
   live config.
   Suggested: `light/dark-setup-server`, `-setup-branding`, `-setup-review`.

2. **`guides/admin.md` — the dashboard.** The page describes seven tabs and
   shows none of them. At minimum the Overview tab; ideally also Plugins with a
   manifest expanded, showing the permission list an admin is meant to review.
   To reach it: `/admin` uses its own session and password. Point
   `ADMIN_CONFIG_DIR` at a scratch dir and set `ADMIN_PASSWORD`, since that
   variable is only read when `admin.json` does not already exist.
   Suggested: `light/dark-admin-overview`, `light/dark-admin-plugins`.

3. **`guides/marketplace.md` — the browse dialog.** An extension listing with
   its permissions visible. This does double duty as the safety-model
   illustration. Needs the admin session above plus a reachable
   `EXTENSION_DIRECTORY_URL`.
   Suggested: `light/dark-marketplace`.

4. **`getting-started/configuration/authentication.md` — the login page.** With
   OAuth enabled, so both the SSO button and the credential form are visible.
   Also reusable on `guides/embedded-sso.md`. Needs `OAUTH_ENABLED=true` against
   a real issuer; the demo login page is a single "Launch Demo" button and shows
   none of this.
   Suggested: `light/dark-login-oauth`.

5. **`features/calendar.md` — a fuller month.** The current committed calendar
   image predates the demo fixtures; a fresh capture is sparse, with events only
   in the last week of the month. Worth adding fixture events across the month
   before re-shooting, otherwise the existing image is the better one.

---

## Worth doing, second pass

6. **`features/email.md` — the three layouts.** A single side-by-side comparison
   image of split / focused list / reading-pane-at-bottom would replace a
   paragraph. `pane-at-bottom` already exists; the other two need capturing.
7. **`features/email/search.md` — the advanced panel** with three or four chips
   applied above the message list. The chip mechanic is the whole page.
8. **`guides/smime.md` — the viewer banners.** One image showing verified,
   untrusted-issuer, and self-signed states stacked. Users arrive at this page
   *because* they saw a banner they didn't understand.
9. **`features/pwa.md` — the install prompt** on Android, plus the installed app
   on a home screen. Phone-sized, not 2560×1440.
10. **`features/mobile.md` — the native app.** Two or three phone screenshots
    (message list, thread, calendar). Currently the page describes an app nobody
    can see.
11. **`guides/plugins.md` — a slot in situ.** The Jitsi "Start Meeting" button on
    a calendar event proves the slot system does something concrete.
12. **`features/telemetry.md` — the payload preview dialog.** The page's argument
    is "you can see exactly what would be sent"; showing that is stronger than
    saying it.
13. **`guides/impersonation.md` — the impersonation banner** from the notice
    plugin, so operators know what the person being supported will see.

---

## Diagrams rather than screenshots

15. **`development/architecture.md`** currently uses an ASCII box diagram. A real
    SVG (browser ↔ Stalwart direct, Next.js server off to the side for auth and
    config) would carry the point better and can be theme-aware. Mermaid also
    works if you'd rather keep it in the markdown.
16. **`guides/embedded-sso.md`** — a sequence diagram of the server-side PKCE
    flow. Five numbered steps in prose is exactly the case a sequence diagram
    exists for.
17. **`guides/multi-account.md`** — a small diagram of push streams multiplexing
    over HTTP/2 versus queuing on HTTP/1.1. This explains the account cap in one
    picture.
18. **`features/telemetry.md`** — a link or embed of the public Grafana panel
    would be more persuasive than the prose promise of transparency.

---

## Pages that need no image

Deployment, extensions API and manifest, environment reference, contributing,
legal. These are reference and configuration text; screenshots would only rot.

---

## Dimension mismatch on the older images

Every screenshot committed before this pass is **1750×1250**, but the `<img>`
tags all declare `width="2560" height="1440"`. The browser reserves the wrong
box and the image is rescaled into it, so the aspect ratio is off (1.4 versus
1.78) and the reserved space is wrong until it loads.

The fix is to recapture them with the skill, which also brings them onto the
current UI and the WebP pipeline. Still on PNG at the wrong declared size:
`-viewer`, `-calendar`, `-calendar-create`, `-composer`, `-settings`, and
`-pane-at-bottom`. Several are used by the landing page, so `src/app/page.tsx`
needs updating in the same change.

Everything added in this pass is a true 5120×2880 WebP with matching `width`
and `height` attributes.

## Cleanup in `public/`

Unreferenced files, safe to delete:

- `screenshots/01-login.png`, `02-inbox.png`, `03-calendar.png`,
  `03-email-viewer.png`, `04-compose.png`, `04-contacts.png`,
  `05-dark-mode.png`, `05-files.png`, `06-settings.png`, `07-light-mode.png` —
  the older numbered set, superseded by the light/dark pairs. Note the duplicate
  `03-` and `04-` prefixes, which is how you can tell the naming never held.
- `1cf5514a-706d-4f84-8dbc-7be2fe7eaa0d.jpg`, `2201.w015.n001.697B.p15.697.jpg`,
  `Gemini_Generated_Image_ks4ya8ks4ya8ks4y.png` — unreferenced. Check the
  licensing on the stock jpg before it ends up used somewhere.
- `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — `create-next-app`
  scaffolding.
- `test-output.html` in the repo root, also unreferenced.

`clippy.gif` is used (the Outlook joke on the landing page) and stays.
