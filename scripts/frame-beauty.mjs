#!/usr/bin/env node
/**
 * Compose the raw captures from scripts/shoot-beauty.mjs into framed "beauty"
 * images: a browser window on the paper/navy background with a soft shadow,
 * a laptop-and-phone pair, and a light/dark split.
 *
 *   node scripts/frame-beauty.mjs [stagingDir] [outDir]
 *
 * Defaults: .beauty-staging -> public/beauty. Output is WebP, at most 400 KB
 * each (quality steps down until it fits). Everything is drawn in HTML/CSS
 * and rendered with headless Chromium, so re-running after a UI change is
 * the whole workflow; nothing is edited by hand.
 */
import fs from "node:fs";
import path from "node:path";
import { SITE, PALETTE, dataUri, loadChromium, renderHtml, writeWebp } from "./lib/render.mjs";

const STAGING = process.argv[2] || path.join(SITE, ".beauty-staging");
const OUT = process.argv[3] || path.join(SITE, "public", "beauty");

// Output size. 1600x1000 CSS px at 1.5x gives 2400x1500, sharp enough for
// the 1440px-wide landing column on a retina display while staying under the
// size cap.
const W = 1600;
const H = 1000;
const SCALE = 1.5;

const DESKTOP_SHOTS = ["inbox", "composer", "search", "calendar-week", "contact", "files", "pro", "login"];

const URLS = {
  inbox: "mail.example.com/mail/folder/inbox",
  composer: "mail.example.com/mail/folder/inbox",
  search: "mail.example.com/mail",
  "calendar-week": "mail.example.com/calendar",
  contact: "mail.example.com/contacts",
  files: "mail.example.com/files",
  pro: "mail.example.com/pro",
  login: "mail.example.com/login",
};

function shell(theme, body, extraCss = "") {
  const dark = theme === "dark";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; }
    body { background: ${dark ? PALETTE.navyDeep : PALETTE.paper}; font-family: system-ui, sans-serif; position: relative; }
    .glow { position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, ${dark ? "rgba(219,45,84,0.16)" : "rgba(219,45,84,0.10)"} 0%, transparent 62%); }
    .grid { position: absolute; inset: 0; background-image:
      linear-gradient(${dark ? "rgba(245,246,248,0.045)" : "rgba(12,19,34,0.05)"} 1px, transparent 1px),
      linear-gradient(90deg, ${dark ? "rgba(245,246,248,0.045)" : "rgba(12,19,34,0.05)"} 1px, transparent 1px);
      background-size: 48px 48px; }
    .win { position: absolute; border-radius: 12px; overflow: hidden;
      background: ${dark ? "#131a2a" : "#ffffff"};
      border: 1px solid ${dark ? "rgba(245,246,248,0.14)" : "rgba(12,19,34,0.14)"};
      box-shadow: 0 40px 90px -30px ${dark ? "rgba(0,0,0,0.85)" : "rgba(12,19,34,0.35)"}, 0 12px 30px -16px ${dark ? "rgba(0,0,0,0.7)" : "rgba(12,19,34,0.25)"}; }
    .bar { height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 14px;
      background: ${dark ? "#0f1626" : "#f1f2f5"}; border-bottom: 1px solid ${dark ? "rgba(245,246,248,0.10)" : "rgba(12,19,34,0.10)"}; }
    .dot { width: 11px; height: 11px; border-radius: 50%; background: ${dark ? "rgba(245,246,248,0.22)" : "rgba(12,19,34,0.18)"}; }
    .url { margin-left: 14px; flex: 1; max-width: 520px; height: 24px; border-radius: 6px; display: flex; align-items: center; padding: 0 12px;
      font: 500 11.5px ui-monospace, "JetBrains Mono", Menlo, monospace; letter-spacing: 0.02em;
      color: ${dark ? "rgba(245,246,248,0.65)" : "rgba(12,19,34,0.6)"}; background: ${dark ? "rgba(245,246,248,0.06)" : "rgba(12,19,34,0.05)"}; }
    .url::before { content: ""; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; background: #2ea36b; }
    .win img { display: block; width: 100%; height: auto; }
    .phone { position: absolute; border-radius: 38px; overflow: hidden; background: #000; padding: 10px;
      box-shadow: 0 40px 80px -30px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.08); }
    .phone .screen { border-radius: 30px; overflow: hidden; }
    .phone img { display: block; width: 100%; height: auto; }
    ${extraCss}
  </style></head><body>${body}</body></html>`;
}

function browserWindow({ src, url, left, top, width, dark }) {
  void dark;
  return `<div class="win" style="left:${left}px;top:${top}px;width:${width}px">
    <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">${url}</span></div>
    <img src="${src}" alt="">
  </div>`;
}

function file(theme, name) {
  const p = path.join(STAGING, `${theme}-${name}.png`);
  return fs.existsSync(p) ? p : null;
}

async function main() {
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const written = [];
  const missing = [];

  for (const theme of ["light", "dark"]) {
    const dark = theme === "dark";
    // Single browser frames.
    for (const name of DESKTOP_SHOTS) {
      const shot = file(theme, name);
      if (!shot) { missing.push(`${theme}-${name}`); continue; }
      const width = 1440;
      const body = `
        <div class="grid"></div>
        <div class="glow" style="width:900px;height:900px;right:-300px;top:-380px"></div>
        ${browserWindow({ src: dataUri(shot), url: URLS[name] ?? "mail.example.com", left: (W - width) / 2, top: 72, width, dark })}`;
      const png = await renderHtml(browser, { html: shell(theme, body), width: W, height: H, scale: SCALE });
      const out = path.join(OUT, `${theme}-${name}.webp`);
      const r = await writeWebp(png, out);
      written.push(`${path.basename(out)} ${(r.bytes / 1024).toFixed(0)}KB q${r.quality}`);
    }

    // Laptop and phone pair.
    const laptop = file(theme, "inbox");
    const phone = file(theme, "phone-message") || file(theme, "phone-inbox");
    if (laptop && phone) {
      const body = `
        <div class="grid"></div>
        <div class="glow" style="width:1000px;height:1000px;left:-420px;bottom:-500px"></div>
        ${browserWindow({ src: dataUri(laptop), url: URLS.inbox, left: 60, top: 90, width: 1180, dark })}
        <div class="phone" style="right:90px;bottom:-40px;width:300px">
          <div class="screen"><img src="${dataUri(phone)}" alt=""></div>
        </div>`;
      const png = await renderHtml(browser, { html: shell(theme, body), width: W, height: H, scale: SCALE });
      const out = path.join(OUT, `${theme}-laptop-phone.webp`);
      const r = await writeWebp(png, out);
      written.push(`${path.basename(out)} ${(r.bytes / 1024).toFixed(0)}KB q${r.quality}`);
    } else {
      missing.push(`${theme}-laptop-phone (needs inbox + phone-message)`);
    }
  }

  // Light/dark split of the inbox: one image that shows both themes. The
  // page background is neutral paper-deep so it sits on either theme.
  const light = file("light", "inbox");
  const darkShot = file("dark", "inbox");
  if (light && darkShot) {
    const width = 1440;
    const left = (W - width) / 2;
    const body = `
      <div class="grid"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(115deg, ${PALETTE.paper} 0 50%, ${PALETTE.navyDeep} 50% 100%)"></div>
      ${browserWindow({ src: dataUri(light), url: URLS.inbox, left, top: 72, width, dark: false })}
      <div style="position:absolute;inset:0;clip-path:polygon(58% 0, 100% 0, 100% 100%, 42% 100%)">
        ${browserWindow({ src: dataUri(darkShot), url: URLS.inbox, left, top: 72, width, dark: true }).replace('class="win"', 'class="win win-dark"')}
      </div>
      <div style="position:absolute;top:0;bottom:0;left:50%;width:2px;background:${PALETTE.rasp};transform:skewX(-16deg);transform-origin:top"></div>`;
    const css = `.win-dark { background:#131a2a; border-color: rgba(245,246,248,0.14); }
      .win-dark .bar { background:#0f1626; border-bottom-color: rgba(245,246,248,0.10); }
      .win-dark .dot { background: rgba(245,246,248,0.22); }
      .win-dark .url { color: rgba(245,246,248,0.65); background: rgba(245,246,248,0.06); }`;
    const png = await renderHtml(browser, { html: shell("light", body, css), width: W, height: H, scale: SCALE });
    const out = path.join(OUT, "split-inbox.webp");
    const r = await writeWebp(png, out);
    written.push(`${path.basename(out)} ${(r.bytes / 1024).toFixed(0)}KB q${r.quality}`);
  } else {
    missing.push("split-inbox (needs light + dark inbox)");
  }

  await browser.close();
  for (const w of written) console.log("  +", w);
  if (missing.length) console.log("missing captures:", missing.join(", "));
  console.log(`output: ${OUT}`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
