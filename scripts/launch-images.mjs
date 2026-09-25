#!/usr/bin/env node
/**
 * Render the Stalwart 1.0 launch images into public/press/launch/:
 *
 *   node scripts/launch-images.mjs                  # every board
 *   node scripts/launch-images.mjs card header      # only the boards named
 *   node scripts/launch-images.mjs header --guides  # also profile-header-guides.png
 *
 * The boards follow the "Stalwart 1.0 Launch Graphics" canvas:
 *
 *   card    og-{full,lite}-{light,dark}.png  1200x630   link card per edition, light or dark inbox
 *   post    post.png                         1600x900   Bulwark and Stalwart 1.0 over JMAP, six ticks
 *   square  square.png                       1080x1080  the six capabilities as tiles
 *   header  profile-header.png               1500x500   same safe areas as twitter-header.mjs
 *
 * WHAT THE TICKS STAND FOR. The post and the square tick six capabilities, and
 * each tick claims a feature checked against Stalwart's v1.0.0 branch (live
 * runs on a server built from 2663169eb, 2026-09-25):
 *
 *   Mail, Calendar, Contacts, Files  verified: the live UI tests passed on 1.0.
 *   Filters                          verified: every Sieve script Bulwark generates
 *                                    compiles on 1.0's Sieve compiler (sieve-rs 1.0.1).
 *   Push                             NOT VERIFIED. Web push goes through the public
 *                                    push relay, which the live run could not use.
 *                                    Check push through a live relay on a 1.0 server
 *                                    before publishing the post or the square; the
 *                                    square's "Every part of the app, tested on the
 *                                    new release." rests on that check too.
 *
 * The script repeats the Push warning whenever it renders those two boards.
 * Publish nothing here before the Stalwart 1.0 test plan has passed.
 *
 * Every file is PNG. They are uploaded to social platforms or read by link
 * crawlers, which take PNG everywhere but WebP only in places (see og.mjs), so
 * the WebP size cap in lib/render.mjs does not apply.
 *
 * Screenshots, standard theme only. The cards use the raw docs captures
 * public/screenshots/{light,dark}-inbox.webp. The header uses the calendar week
 * view in public/beauty/light-calendar-week.webp, cropped to the app inside the
 * frame, so the frame's ground, shadow, rounded window and browser bar are cut
 * away. Both sit in a 1px frame and leave the image at the right and the bottom,
 * as on the OG cards.
 *
 * Rules the boards keep: "Stalwart" is plain text, with no logo and never
 * "official", "certified" or "partner". Raspberry is Bulwark and neutral grey is
 * Stalwart, so no Stalwart element sits on the raspberry field; the Lite cards
 * use teal. Headings are Hanken Grotesk at 400, radius 0, no shadows, no
 * gradients. The post and the square carry the trademark line.
 *
 * Fonts come from Google Fonts, so rendering needs network access. The script
 * stops when a face fails to load rather than render in a fallback font.
 */
import path from "node:path";
import { SITE, PALETTE, FONT_LINK, loadChromium, loadSharp, renderHtml, writePng } from "./lib/render.mjs";

const OUT = path.join(SITE, "public", "press", "launch");

// Site tokens (src/app/globals.css).
const T = {
  page: "#ffffff",
  text: "#18181b",
  muted: "#56565d",
  surface: "#f4f4f5",
  rule: PALETTE.rule,
  ruleDark: "#36363b",
  onField: "#ffffff",
};

const EDITIONS = {
  full: { field: PALETTE.rasp, name: ["Bulwark"] },
  lite: { field: PALETTE.teal, name: ["Bulwark", "Lite"] },
};

const HEADING = "Bulwark works with Stalwart 1.0.";
const DISCLAIMER = "Stalwart is a trademark of Stalwart Labs. Bulwark is an independent project.";
// The second sentence holds once Stalwart ships its 0.16 to 1.0 migration. The
// v1.0.0 branch still refuses a 0.16 data directory, and the test plan's upgrade
// run checks it.
const POST_LEAD =
  "Bulwark is the client, Stalwart is the mail server, and both speak JMAP. Your mail, calendar, contacts and files carry over to the new release.";

// The six ticks. `unchecked` marks one not yet confirmed on 1.0 (see the top).
const CAPABILITIES = [
  { name: "Mail", icon: "mail", text: "Threads, search, tags and scheduled send.", urn: "urn:ietf:params:jmap:mail" },
  { name: "Calendar", icon: "calendar", text: "Events, invitations and shared calendars.", urn: "urn:ietf:params:jmap:calendars" },
  { name: "Contacts", icon: "addressBook", text: "Address books, groups, photos and birthdays.", urn: "urn:ietf:params:jmap:contacts" },
  { name: "Files", icon: "folder", text: "Folders, uploads, sharing and previews.", urn: "urn:ietf:params:jmap:filenode" },
  { name: "Filters", icon: "filter", text: "Sieve rules and vacation replies.", urn: "urn:ietf:params:jmap:sieve" },
  {
    name: "Push",
    icon: "bell",
    text: "New mail and events arrive without a reload.",
    urn: "urn:ietf:params:jmap:core",
    unchecked: "web push has not been checked through a live relay on a 1.0 server",
  },
];

// Screenshot geometry: the width the app is drawn at, as on the canvas.
const CARD_SHOT_WIDTH = 1040;
const HEADER_SHOT_WIDTH = 1000;
// The app capture sits at x 121-2280, y 171-1385 inside the 2400x1500 beauty
// frame. Trim a pixel off the window edge and stop above the rounded corners.
const WEEK_VIEW = {
  file: "public/beauty/light-calendar-week.webp",
  extract: { left: 122, top: 172, width: 2156, height: 1188 },
};

const FONTS = `${FONT_LINK}<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">`;
const FACES = [
  ["Hanken Grotesk", 400],
  ["Hanken Grotesk", 500],
  ["Hanken Grotesk", 600],
  ["JetBrains Mono", 400],
];

const MARK_PATHS = [
  "M373.467 557.247L55.226 271.52V385.564C55.226 398.153 62.453 415.6 71.355 424.501L107.525 460.671C116.426 469.573 123.653 487.02 123.653 499.609V682.08C123.655 718.462 133.336 750.017 152.047 778.668L373.467 557.247z",
  "M626.533 557.247L944.774 271.52V396.969C944.774 403.263 941.16 411.987 936.709 416.437L884.411 468.736C879.96 473.186 876.347 481.91 876.347 488.204V682.08C876.345 718.462 866.664 750.017 847.953 778.668L626.533 557.247z",
  "M500 638.743C466.206 638.738 448.855 625.316 424.448 603.033L197.809 829.672C261.382 884.635 364.213 931.859 500 990C635.787 931.859 738.618 884.635 802.191 829.672L575.552 603.033C551.145 625.316 533.794 638.738 500 638.743z",
  "M483.028 563.647L63.713 187.183C59.029 182.978 55.226 174.454 55.226 168.159V122.542C55.226 116.247 60.206 109.988 66.339 108.573L215.181 74.225C221.314 72.809 226.293 76.77 226.293 83.065V176.92L352.034 147.895C358.167 146.479 363.147 140.219 363.147 133.925V51.483C363.147 45.189 368.126 38.93 374.259 37.514L488.888 11.061C495.021 9.646 504.979 9.646 511.112 11.061L625.741 37.514C631.874 38.93 636.853 45.189 636.853 51.483V133.925C636.853 140.219 641.833 146.479 647.966 147.895L773.707 176.92V83.065C773.707 76.77 778.686 72.809 784.819 74.225L933.661 108.573C939.794 109.988 944.774 116.247 944.774 122.542V168.159C944.774 174.454 940.971 182.978 936.287 187.183L516.972 563.647C512.288 567.852 504.684 567.852 500 567.852C495.316 567.852 487.712 567.852 483.028 563.647z",
];

// Tabler icons (outline, 24px grid), drawn at 1.5px with square caps.
const ICONS = {
  mail: ["M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z", "M3 7l9 6l9 -6"],
  calendar: ["M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z", "M16 3v4", "M8 3v4", "M4 11h16"],
  addressBook: [
    "M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z",
    "M10 16h6",
    "M11 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    "M4 8h3",
    "M4 12h3",
    "M4 16h3",
  ],
  folder: ["M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"],
  filter: ["M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"],
  bell: ["M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6", "M9 17v1a3 3 0 0 0 6 0v-1"],
  server: [
    "M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z",
    "M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z",
    "M7 8v.01",
    "M7 16v.01",
  ],
  arrowsExchange: ["M21 17h-18", "M6 10l-3 -3l3 -3", "M3 7h18", "M18 20l3 -3l-3 -3"],
  check: ["M5 12l5 5l10 -10"],
};

/** The Bulwark mark (same paths as bulwark-mark.tsx). */
function mark(fill, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 1000 1000" aria-hidden="true">${MARK_PATHS.map((d) => `<path fill="${fill}" d="${d}"/>`).join("")}</svg>`;
}

function icon(name, size, stroke) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${ICONS[name].map((d) => `<path d="${d}"/>`).join("")}</svg>`;
}

function page(width, height, css, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONTS}<style>
    html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
    body { position: relative; font-family: "Hanken Grotesk", system-ui, sans-serif; }
    h1 { margin: 0; font-weight: 400; line-height: 1.06; letter-spacing: -0.015em; }
    p { margin: 0; }
    p, .tile-text { text-wrap: pretty; } /* no one-word last lines */
    svg { display: block; flex-shrink: 0; }
    .brand { display: flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 600; letter-spacing: -0.01em; }
    ${css}
  </style></head><body>${body}</body></html>`;
}

/** A screenshot resized with sharp to the width it is drawn at, as a PNG data URI. */
async function shot(file, width, extract) {
  let image = loadSharp()(path.join(SITE, file));
  if (extract) image = image.extract(extract);
  const png = await image.resize({ width }).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function cardHtml(edition, src, frame) {
  return page(
    1200,
    630,
    `body { background: ${edition.field}; color: ${T.onField}; }
    .brand { position: absolute; left: 72px; top: 64px; }
    .text { position: absolute; left: 72px; top: 188px; width: 470px; display: flex; flex-direction: column; gap: 24px; }
    h1 { font-size: 60px; }
    .text p { font-size: 21px; line-height: 1.45; }
    .site { position: absolute; left: 72px; bottom: 60px; font-size: 21px; }
    .shot { position: absolute; left: 576px; top: 124px; width: 624px; height: 506px; overflow: hidden;
      box-sizing: border-box; border: 1px solid ${frame}; border-right: 0; border-bottom: 0; }
    .shot img { display: block; width: ${CARD_SHOT_WIDTH}px; }`,
    `<div class="brand">${mark(T.onField, 40)}${edition.name.map((n) => `<span>${n}</span>`).join("")}</div>
    <div class="text"><h1>${HEADING}</h1><p>Mail, calendar, contacts and files, from launch day.</p></div>
    <div class="site">bulwarkmail.org</div>
    <div class="shot"><img src="${src}" alt=""></div>`,
  );
}

function postHtml(field) {
  const caps = CAPABILITIES.map(
    (c) => `<div class="cap">${icon(c.icon, 24, T.text)}<span>${c.name}</span>${icon("check", 20, field)}</div>`,
  ).join("");
  return page(
    1600,
    900,
    `body { background: ${T.page}; color: ${T.text}; }
    .post { box-sizing: border-box; height: 100%; padding: 64px 80px 56px; display: flex; flex-direction: column; gap: 40px; }
    .intro { display: flex; flex-direction: column; gap: 16px; }
    h1 { font-size: 60px; }
    .intro p { max-width: 1000px; font-size: 24px; line-height: 1.45; color: ${T.muted}; }
    .board { display: flex; flex-direction: column; flex-grow: 1; }
    .pair { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); flex-grow: 1; }
    .tile { box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
    .tile-bulwark { padding: 40px; background: ${field}; color: ${T.onField}; }
    .tile-stalwart { padding: 40px 40px 40px 72px; background: ${T.surface}; border: 1px solid ${T.rule}; border-left: 0; }
    .tile-copy { display: flex; flex-direction: column; gap: 8px; }
    .tile-name { font-size: 40px; line-height: 1.12; letter-spacing: -0.015em; }
    .tile-line { font-size: 21px; line-height: 1.45; }
    .tile-stalwart .tile-line { color: ${T.muted}; }
    .link { position: absolute; inset: 0; display: grid; place-items: center; }
    .jmap { padding: 14px 20px; background: ${T.page}; border: 1px solid ${T.rule}; display: flex; align-items: center; gap: 10px;
      font-size: 21px; font-weight: 500; }
    .caps { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); border-left: 1px solid ${T.rule}; }
    .cap { box-sizing: border-box; height: 72px; padding: 0 20px; border-right: 1px solid ${T.rule}; border-bottom: 1px solid ${T.rule};
      display: flex; align-items: center; gap: 12px; }
    .cap span { flex-grow: 1; font-size: 19px; }
    .foot { display: flex; justify-content: space-between; align-items: center; font-size: 15px; color: ${T.muted}; }
    .foot .site { font-size: 19px; color: ${T.text}; }`,
    `<div class="post">
      <div class="brand">${mark(field, 40)}<span>Bulwark</span></div>
      <div class="intro"><h1>${HEADING}</h1><p>${POST_LEAD}</p></div>
      <div class="board">
        <div class="pair">
          <div class="tile tile-bulwark">${mark(T.onField, 64)}<div class="tile-copy">
            <div class="tile-name">Bulwark</div><div class="tile-line">The client, in the browser, as Lite and on your phone</div></div></div>
          <div class="tile tile-stalwart">${icon("server", 64, T.text)}<div class="tile-copy">
            <div class="tile-name">Stalwart 1.0</div><div class="tile-line">The mail server you already run</div></div></div>
          <div class="link"><div class="jmap">${icon("arrowsExchange", 24, field)}<span>JMAP</span></div></div>
        </div>
        <div class="caps">${caps}</div>
      </div>
      <div class="foot"><span class="site">bulwarkmail.org</span><span>${DISCLAIMER}</span></div>
    </div>`,
  );
}

function squareHtml(field) {
  const tiles = CAPABILITIES.map(
    (c) => `<div class="tile">${icon(c.icon, 32, field)}
      <div class="tile-title">${c.name}</div>
      <div class="tile-text">${c.text}</div>
      <div class="tile-grow"></div>
      <div class="tile-foot"><span class="urn">${c.urn}</span>${icon("check", 20, field)}</div>
    </div>`,
  ).join("");
  return page(
    1080,
    1080,
    `body { background: ${T.page}; color: ${T.text}; display: flex; flex-direction: column; }
    .top { box-sizing: border-box; height: 420px; padding: 64px; background: ${field}; color: ${T.onField};
      display: flex; flex-direction: column; justify-content: space-between; }
    .top-copy { display: flex; flex-direction: column; gap: 20px; }
    h1 { font-size: 60px; }
    .top p { font-size: 21px; line-height: 1.45; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); flex-grow: 1; }
    .tile { box-sizing: border-box; padding: 28px; border-bottom: 1px solid ${T.rule}; display: flex; flex-direction: column; gap: 12px; }
    .tile:not(:nth-child(3n)) { border-right: 1px solid ${T.rule}; }
    .tile-title { font-size: 21px; line-height: 1.2; }
    .tile-text { font-size: 15px; line-height: 1.45; color: ${T.muted}; }
    .tile-grow { flex-grow: 1; }
    .tile-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 8px; }
    .urn { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 12.5px; color: ${T.muted}; }
    .foot { box-sizing: border-box; height: 72px; padding: 0 64px; display: flex; justify-content: space-between; align-items: center;
      font-size: 13.5px; color: ${T.muted}; }
    .foot .site { font-size: 17px; color: ${T.text}; }`,
    `<div class="top">
      <div class="brand">${mark(T.onField, 40)}<span>Bulwark</span></div>
      <div class="top-copy"><h1>${HEADING}</h1><p>Every part of the app, tested on the new release.</p></div>
    </div>
    <div class="grid">${tiles}</div>
    <div class="foot"><span class="site">bulwarkmail.org</span><span>${DISCLAIMER}</span></div>`,
  );
}

// Profile header safe areas, as in twitter-header.mjs: the avatar covers about
// x 0-400, y 300-500, and phones crop about 60px off the top and the bottom.
const GUIDES = `
  <div class="g g-crop" style="top:0;height:60px"></div>
  <div class="g g-crop" style="bottom:0;height:60px"></div>
  <div class="g g-avatar"></div>`;

function headerHtml(field, src, guides) {
  return page(
    1500,
    500,
    `body { background: ${field}; color: ${T.onField}; }
    .text { position: absolute; left: 80px; top: 64px; width: 660px; display: flex; flex-direction: column; gap: 20px; }
    h1 { font-size: 64px; }
    .text p { font-size: 21px; line-height: 1.45; }
    .shot { position: absolute; left: 820px; top: 72px; width: 680px; height: 428px; overflow: hidden;
      box-sizing: border-box; border: 1px solid ${T.rule}; border-right: 0; border-bottom: 0; }
    .shot img { display: block; width: ${HEADER_SHOT_WIDTH}px; }
    .g { position: absolute; left: 0; right: 0; background: rgba(0,0,0,.35); outline: 2px dashed #ffd400; outline-offset: -2px; }
    .g-avatar { left: 0; right: auto; width: 400px; top: 300px; height: 200px; border-radius: 0 200px 0 0; background: rgba(0,0,0,.45); }`,
    `<div class="text"><h1>${HEADING}</h1><p>bulwarkmail.org</p></div>
    <div class="shot"><img src="${src}" alt=""></div>
    ${guides ? GUIDES : ""}`,
  );
}

/** Each board returns its render jobs: { file, width, height, html }. */
const BOARDS = {
  async card() {
    const shots = {
      light: { src: await shot("public/screenshots/light-inbox.webp", CARD_SHOT_WIDTH), frame: T.rule },
      dark: { src: await shot("public/screenshots/dark-inbox.webp", CARD_SHOT_WIDTH), frame: T.ruleDark },
    };
    return Object.entries(EDITIONS).flatMap(([edition, e]) =>
      Object.entries(shots).map(([theme, s]) => ({
        file: `og-${edition}-${theme}.png`,
        width: 1200,
        height: 630,
        html: cardHtml(e, s.src, s.frame),
      })),
    );
  },
  async post() {
    return [{ file: "post.png", width: 1600, height: 900, html: postHtml(EDITIONS.full.field) }];
  },
  async square() {
    return [{ file: "square.png", width: 1080, height: 1080, html: squareHtml(EDITIONS.full.field) }];
  },
  async header({ guides }) {
    const src = await shot(WEEK_VIEW.file, HEADER_SHOT_WIDTH, WEEK_VIEW.extract);
    const job = (file, withGuides) => ({ file, width: 1500, height: 500, html: headerHtml(EDITIONS.full.field, src, withGuides) });
    return [job("profile-header.png", false), ...(guides ? [job("profile-header-guides.png", true)] : [])];
  },
};

/** Stop when a face fails to load: Chromium would silently fall back to another font. */
async function assertFonts(browser) {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const probes = FACES.map(([family, weight]) => `<span style="font: ${weight} 20px '${family}'">Bulwark 1.0</span>`).join("");
  await pg.setContent(`<!doctype html><html><head>${FONTS}</head><body>${probes}</body></html>`, { waitUntil: "load" });
  const loaded = await pg.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.status === "loaded")
      .map((f) => ({ family: f.family.replace(/["']/g, ""), weights: f.weight.split(" ").map(Number) }));
  });
  await ctx.close();
  const missing = FACES.filter(
    ([family, weight]) =>
      !loaded.some((f) => f.family === family && weight >= f.weights[0] && weight <= f.weights[f.weights.length - 1]),
  );
  if (missing.length) {
    throw new Error(`fonts did not load (network access to Google Fonts?): ${missing.map((f) => f.join(" ")).join(", ")}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const guides = args.includes("--guides");
  const names = args.filter((a) => !a.startsWith("--"));
  const unknown = names.filter((n) => !Object.hasOwn(BOARDS, n));
  if (unknown.length) throw new Error(`unknown board ${unknown.join(", ")}; pick from ${Object.keys(BOARDS).join(", ")}`);
  const boards = names.length ? names : Object.keys(BOARDS);

  const chromium = loadChromium();
  const browser = await chromium.launch();
  try {
    await assertFonts(browser);
    for (const board of boards) {
      for (const job of await BOARDS[board]({ guides })) {
        const png = await renderHtml(browser, { html: job.html, width: job.width, height: job.height, scale: 1, settle: 1500 });
        const r = writePng(png, path.join(OUT, job.file));
        console.log(`  + public/press/launch/${job.file} ${(r.bytes / 1024).toFixed(0)}KB`);
      }
    }
  } finally {
    await browser.close();
  }

  if (boards.includes("post") || boards.includes("square")) {
    for (const c of CAPABILITIES.filter((cap) => cap.unchecked)) {
      console.warn(`  ! ${c.name} tick: ${c.unchecked}. Check it before publishing post.png or square.png.`);
    }
  }
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
