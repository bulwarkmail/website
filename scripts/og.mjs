#!/usr/bin/env node
/**
 * Render the Open Graph cards, one per edition, into public/:
 *
 *   node scripts/og.mjs
 *
 * 1200x630 PNG (social crawlers are unreliable with WebP), drawn in HTML: the
 * edition's flat field, the mark and wordmark, the hero heading, and the light
 * inbox screenshot leaving the card at the right and the bottom. Re-run
 * whenever the heading, the field colour or the inbox screenshot changes;
 * layout.tsx and page.tsx reference the files by name.
 */
import path from "node:path";
import { SITE, PALETTE, FONT_LINK, dataUri, loadChromium, renderHtml, writePng } from "./lib/render.mjs";

const W = 1200;
const H = 630;

const EDITIONS = {
  full: {
    file: "og-full.png",
    field: PALETTE.rasp,
    name: "Bulwark",
    heading: "Webmail for Stalwart Mail Server.",
  },
  lite: {
    file: "og-lite.png",
    field: PALETTE.teal,
    name: "Bulwark Lite",
    heading: "Webmail for Stalwart, served as static files.",
  },
};

const MARK_PATHS = [
  "M373.467 557.247L55.226 271.52V385.564C55.226 398.153 62.453 415.6 71.355 424.501L107.525 460.671C116.426 469.573 123.653 487.02 123.653 499.609V682.08C123.655 718.462 133.336 750.017 152.047 778.668L373.467 557.247z",
  "M626.533 557.247L944.774 271.52V396.969C944.774 403.263 941.16 411.987 936.709 416.437L884.411 468.736C879.96 473.186 876.347 481.91 876.347 488.204V682.08C876.345 718.462 866.664 750.017 847.953 778.668L626.533 557.247z",
  "M500 638.743C466.206 638.738 448.855 625.316 424.448 603.033L197.809 829.672C261.382 884.635 364.213 931.859 500 990C635.787 931.859 738.618 884.635 802.191 829.672L575.552 603.033C551.145 625.316 533.794 638.738 500 638.743z",
  "M483.028 563.647L63.713 187.183C59.029 182.978 55.226 174.454 55.226 168.159V122.542C55.226 116.247 60.206 109.988 66.339 108.573L215.181 74.225C221.314 72.809 226.293 76.77 226.293 83.065V176.92L352.034 147.895C358.167 146.479 363.147 140.219 363.147 133.925V51.483C363.147 45.189 368.126 38.93 374.259 37.514L488.888 11.061C495.021 9.646 504.979 9.646 511.112 11.061L625.741 37.514C631.874 38.93 636.853 45.189 636.853 51.483V133.925C636.853 140.219 641.833 146.479 647.966 147.895L773.707 176.92V83.065C773.707 76.77 778.686 72.809 784.819 74.225L933.661 108.573C939.794 109.988 944.774 116.247 944.774 122.542V168.159C944.774 174.454 940.971 182.978 936.287 187.183L516.972 563.647C512.288 567.852 504.684 567.852 500 567.852C495.316 567.852 487.712 567.852 483.028 563.647z",
];

/** The Bulwark mark (same paths as bulwark-mark.tsx), white on the field. */
function markSvg(fill, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 1000 1000" aria-hidden="true">${MARK_PATHS.map((d) => `<path fill="${fill}" d="${d}"/>`).join("")}</svg>`;
}

function html(e, shot) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}<style>
    html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; }
    body { background: ${e.field}; color: #ffffff; font-family: "Hanken Grotesk", system-ui, sans-serif;
      display: grid; grid-template-columns: 520px 1fr; }
    .text { padding: 64px 0 64px 72px; display: grid; align-content: space-between; }
    .brand { display: flex; align-items: center; gap: 14px; font-weight: 600; font-size: 28px; letter-spacing: -0.01em; }
    h1 { margin: 0; font-weight: 400; font-size: 60px; line-height: 1.06; letter-spacing: -0.015em; }
    .site { font-size: 24px; }
    .shot { align-self: end; margin-left: 56px; width: 900px; height: 506px; overflow: hidden;
      border: 1px solid ${PALETTE.rule}; border-right: 0; border-bottom: 0; box-sizing: border-box; }
    .shot img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 0 0; }
  </style></head><body>
    <div class="text">
      <div class="brand">${markSvg("#ffffff", 40)}<span>${e.name}</span></div>
      <h1>${e.heading}</h1>
      <div class="site">bulwarkmail.org</div>
    </div>
    <div class="shot"><img src="${shot}" alt=""></div>
  </body></html>`;
}

async function main() {
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const shot = dataUri(path.join(SITE, "public", "screenshots", "light-inbox.webp"));
  for (const e of Object.values(EDITIONS)) {
    const png = await renderHtml(browser, { html: html(e, shot), width: W, height: H, scale: 1, settle: 1500 });
    const out = path.join(SITE, "public", e.file);
    const r = writePng(png, out);
    console.log(`  + public/${e.file} ${(r.bytes / 1024).toFixed(0)}KB`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
