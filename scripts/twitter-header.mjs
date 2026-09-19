#!/usr/bin/env node
/**
 * Render the X / Twitter profile header into public/press/:
 *
 *   node scripts/twitter-header.mjs          # twitter-header.png (1500x500) + @2x
 *   node scripts/twitter-header.mjs --guides # also twitter-header-guides.png
 *
 * Same system as the OG cards (scripts/og.mjs): the flat raspberry field, the
 * white mark and wordmark, the hero heading at regular weight, and the light
 * inbox screenshot leaving the header at the right and the bottom.
 *
 * Safe areas. The profile picture covers the bottom-left corner on desktop
 * (about x 0-400, y 300-500 at 1500x500), and phones crop roughly 60px off the
 * top and bottom. Text therefore sits top-left, above the avatar and inside
 * y 60-440; the corner under the avatar is empty field. `--guides` draws both
 * zones over the render so they can be checked.
 */
import path from "node:path";
import { SITE, PALETTE, FONT_LINK, dataUri, loadChromium, renderHtml, writePng } from "./lib/render.mjs";

const W = 1500;
const H = 500;

const MARK_PATHS = [
  "M373.467 557.247L55.226 271.52V385.564C55.226 398.153 62.453 415.6 71.355 424.501L107.525 460.671C116.426 469.573 123.653 487.02 123.653 499.609V682.08C123.655 718.462 133.336 750.017 152.047 778.668L373.467 557.247z",
  "M626.533 557.247L944.774 271.52V396.969C944.774 403.263 941.16 411.987 936.709 416.437L884.411 468.736C879.96 473.186 876.347 481.91 876.347 488.204V682.08C876.345 718.462 866.664 750.017 847.953 778.668L626.533 557.247z",
  "M500 638.743C466.206 638.738 448.855 625.316 424.448 603.033L197.809 829.672C261.382 884.635 364.213 931.859 500 990C635.787 931.859 738.618 884.635 802.191 829.672L575.552 603.033C551.145 625.316 533.794 638.738 500 638.743z",
  "M483.028 563.647L63.713 187.183C59.029 182.978 55.226 174.454 55.226 168.159V122.542C55.226 116.247 60.206 109.988 66.339 108.573L215.181 74.225C221.314 72.809 226.293 76.77 226.293 83.065V176.92L352.034 147.895C358.167 146.479 363.147 140.219 363.147 133.925V51.483C363.147 45.189 368.126 38.93 374.259 37.514L488.888 11.061C495.021 9.646 504.979 9.646 511.112 11.061L625.741 37.514C631.874 38.93 636.853 45.189 636.853 51.483V133.925C636.853 140.219 641.833 146.479 647.966 147.895L773.707 176.92V83.065C773.707 76.77 778.686 72.809 784.819 74.225L933.661 108.573C939.794 109.988 944.774 116.247 944.774 122.542V168.159C944.774 174.454 940.971 182.978 936.287 187.183L516.972 563.647C512.288 567.852 504.684 567.852 500 567.852C495.316 567.852 487.712 567.852 483.028 563.647z",
];

function markSvg(fill, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 1000 1000" aria-hidden="true">${MARK_PATHS.map((d) => `<path fill="${fill}" d="${d}"/>`).join("")}</svg>`;
}

const GUIDES = `
  <div class="g g-crop" style="top:0;height:60px"></div>
  <div class="g g-crop" style="bottom:0;height:60px"></div>
  <div class="g g-avatar"></div>`;

function html(shot, guides) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}<style>
    html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; }
    body { position: relative; background: ${PALETTE.rasp}; color: #ffffff;
      font-family: "Hanken Grotesk", system-ui, sans-serif; }
    .text { position: absolute; left: 88px; top: 80px; width: 600px; }
    .brand { display: flex; align-items: center; gap: 14px; font-weight: 600; font-size: 30px; letter-spacing: -0.01em; }
    h1 { margin: 32px 0 0; font-weight: 400; font-size: 64px; line-height: 1.06; letter-spacing: -0.015em; }
    .shot { position: absolute; left: 760px; top: 88px; width: 960px; height: 540px; overflow: hidden;
      border: 1px solid ${PALETTE.rule}; border-right: 0; border-bottom: 0; box-sizing: border-box; }
    .shot img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 0 0; }
    .g { position: absolute; left: 0; right: 0; background: rgba(0,0,0,.35); outline: 2px dashed #ffd400; outline-offset: -2px; }
    .g-avatar { left: 0; right: auto; width: 400px; top: 300px; height: 200px; border-radius: 0 200px 0 0; background: rgba(0,0,0,.45); }
  </style></head><body>
    <div class="text">
      <div class="brand">${markSvg("#ffffff", 44)}<span>Bulwark</span></div>
      <h1>Webmail for<br>Stalwart Mail Server.</h1>
    </div>
    <div class="shot"><img src="${shot}" alt=""></div>
    ${guides ? GUIDES : ""}
  </body></html>`;
}

async function main() {
  const withGuides = process.argv.includes("--guides");
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const shot = dataUri(path.join(SITE, "public", "screenshots", "light-inbox.webp"));
  const out = (name) => path.join(SITE, "public", "press", name);
  const jobs = [
    ["twitter-header.png", 1, false],
    ["twitter-header@2x.png", 2, false],
    ...(withGuides ? [["twitter-header-guides.png", 1, true]] : []),
  ];
  for (const [file, scale, guides] of jobs) {
    const png = await renderHtml(browser, { html: html(shot, guides), width: W, height: H, scale, settle: 1500 });
    const r = writePng(png, out(file));
    console.log(`  + public/press/${file} ${(r.bytes / 1024).toFixed(0)}KB`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
