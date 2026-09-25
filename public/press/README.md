# Bulwark press kit

Everything in this folder may be used to write about Bulwark Webmail, Bulwark Lite and the projects around them. Please don't alter the logos (recolor, stretch, add effects); the [branding guidelines](https://bulwarkmail.org/brand) have the rules and the clear-space requirements.

## Boilerplate

Bulwark is an open-source webmail client for Stalwart Mail Server, built in TypeScript on Next.js and the JMAP protocol. It puts mail, calendar, contacts and file storage behind one login, threads and searches on the server rather than in the browser, installs as a progressive web app, and ships in two editions: Bulwark, a Node.js service with a setup wizard, admin console and plugins, and Bulwark Lite, the same client exported as static files for any web host. It is licensed under the AGPL v3, built in the EU, and run by the people who use it; the source is at github.com/bulwarkmail/webmail.

## Contents

- `logos/` - the mark and the wordmark lockups in colour, dark and white, as SVG and PNG, plus the favicon.
- `beauty/` - framed product screenshots (2400×1500 WebP) in light and dark: inbox, composer, global search, calendar week, contact detail, files, the Pro interface, a laptop-and-phone pair, and a light/dark split. All captured from the demo fixtures, so no real mail is shown.
- `og-full.png`, `og-lite.png` - the 1200×630 social cards for each edition.
- `launch/` - the Stalwart 1.0 launch images as PNG: 1200×630 link cards for each edition in light and dark, a 1600×900 post, a 1080×1080 square and a 1500×500 profile header. `scripts/launch-images.mjs` re-creates them.

The screenshots are generated, not edited: `scripts/shoot-beauty.mjs` and `scripts/frame-beauty.mjs` in the [website repository](https://github.com/bulwarkmail/website) re-create them from a running demo instance.

## Facts

- Name: Bulwark Webmail (editions: Bulwark, Bulwark Lite)
- Website: https://bulwarkmail.org
- Source: https://github.com/bulwarkmail/webmail
- Licence: GNU AGPL v3
- Mail server: Stalwart Mail Server, over JMAP
- Stalwart versions: 0.16.6 or newer, and 1.0 with Bulwark [BULWARK VERSION] or newer
- Contact: dev@bulwarkmail.org
- Trademarks: Stalwart is a trademark of Stalwart Labs. Bulwark is an independent project.
