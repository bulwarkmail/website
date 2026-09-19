// Shared helpers for the image scripts: render an HTML document with headless
// Chromium and write it as PNG or size-capped WebP.
//
// Playwright comes from the webmail checkout (BULWARK_REPO, default ../..
// from the site), sharp from this site's own node_modules (Next.js pulls it
// in for image optimisation). Neither is a new dependency of the site.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const SITE = path.resolve(here, "..", "..");
export const REPO = process.env.BULWARK_REPO || path.resolve(SITE, "..", "..");

const siteRequire = createRequire(path.join(SITE, "package.json"));
const repoRequire = createRequire(path.join(REPO, "package.json"));

export function loadChromium() {
  try {
    return repoRequire("playwright-core").chromium;
  } catch {
    return siteRequire("playwright-core").chromium;
  }
}

export function loadSharp() {
  return siteRequire("sharp");
}

export function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
}

/** Render one HTML document to a PNG buffer at the given CSS size and scale. */
export async function renderHtml(browser, { html, width, height, scale = 1, settle = 300 }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(settle);
  const png = await page.screenshot({ type: "png", fullPage: false });
  await ctx.close();
  return png;
}

/** Write a WebP no larger than maxBytes, stepping quality down until it fits. */
export async function writeWebp(pngBuffer, outFile, { maxBytes = 400 * 1024, quality = 82, minQuality = 50 } = {}) {
  const sharp = loadSharp();
  let q = quality;
  let out;
  for (;;) {
    out = await sharp(pngBuffer).webp({ quality: q, effort: 6 }).toBuffer();
    if (out.length <= maxBytes || q <= minQuality) break;
    q -= 6;
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out);
  return { bytes: out.length, quality: q };
}

export function writePng(pngBuffer, outFile) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, pngBuffer);
  return { bytes: pngBuffer.length };
}

export const PALETTE = {
  paper: "#f5f6f8",
  paperDeep: "#eceef2",
  navy: "#0c1322",
  navyDeep: "#070b16",
  ink: "#0c1322",
  rasp: "#db2d54",
  teal: "#0f8578",
  rule: "#dddde1",
};

// The site's own family (see src/app/layout.tsx). This link is only fetched by
// the image scripts on a developer machine, never by the site.
export const FONT_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">';
