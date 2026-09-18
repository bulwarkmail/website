#!/usr/bin/env node
/**
 * Capture the hero-grade "beauty" screenshots of Bulwark Webmail.
 *
 *   node scripts/shoot-beauty.mjs <light|dark|all> [outDir]
 *
 * Needs the webmail dev server on :3000 in demo mode (see
 * SCREENSHOTS-TODO.md for the exact command). Writes raw captures to the
 * staging directory (default: .beauty-staging, git-ignored); frame them with
 * scripts/frame-beauty.mjs afterwards.
 *
 * Playwright is resolved from the webmail checkout (BULWARK_REPO, default
 * ../.. from this repo), so this site adds no dependency of its own.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "..");
const REPO = process.env.BULWARK_REPO || path.resolve(SITE, "..", "..");
const repoRequire = createRequire(path.join(REPO, "package.json"));
const { chromium } = repoRequire("playwright-core");

const BASE = process.env.SHOOT_BASE || "http://localhost:3000";
const themes = (process.argv[2] || "all") === "all" ? ["light", "dark"] : [process.argv[2]];
const OUT = process.argv[3] || path.join(SITE, ".beauty-staging");

// Desktop: laptop layout at 2x. Phone: iPhone-ish at 3x.
const DESKTOP = { width: Number(process.env.SHOOT_WIDTH || 1280), height: Number(process.env.SHOOT_HEIGHT || 720), scale: Number(process.env.SHOOT_SCALE || 2) };
const PHONE = { width: 390, height: 844, scale: 3 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const HIDE_DEV_CHROME = `
  nextjs-portal, [data-nextjs-toast] { display: none !important; }
  [data-tour="demo-banner"] { display: none !important; }
`;

async function newContext(browser, theme, size, extraInit) {
  const ctx = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    isMobile: size === PHONE,
    hasTouch: size === PHONE,
    colorScheme: theme,
    reducedMotion: "reduce",
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
      localStorage.setItem("theme-storage", JSON.stringify({ state: { theme: t }, version: 0 }));
      for (const k of ["bulwark-tour-completed", "tour-completed", "onboarding-completed", "welcome-dismissed", "pwa-install-dismissed", "pwa-prompt-dismissed"]) {
        localStorage.setItem(k, "true");
      }
    } catch {}
  }, theme);
  if (extraInit) await ctx.addInitScript(extraInit);
  return ctx;
}

async function signIn(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  const launch = page.locator('button:has-text("Launch Demo"), button:has-text("Sign in"), button[type="submit"]').first();
  await launch.click({ timeout: 20000 });
  await page.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 60000 }).catch(() => {});
  await sleep(8000);
  await tryClick(page, 'button:has-text("Got it")', 3000);
}

async function tryClick(page, sel, ms = 4000) {
  try {
    const l = page.locator(sel).first();
    await l.waitFor({ state: "visible", timeout: ms });
    await l.click({ timeout: ms });
    await sleep(800);
    return true;
  } catch {
    return false;
  }
}

const misses = [];
async function mustClick(page, sel, why, ms = 8000) {
  const ok = await tryClick(page, sel, ms);
  if (!ok) {
    console.log(`  ! no match for ${sel} (${why})`);
    misses.push(sel);
  }
  return ok;
}

async function shoot(page, theme, name, { width }) {
  if (page.url().includes("/login") && name !== "login") {
    console.log(`  x ${name} bounced to login`);
    misses.push(name);
    return;
  }
  await page.addStyleTag({ content: HIDE_DEV_CHROME }).catch(() => {});
  await page.mouse.move(width - 6, 6);
  await sleep(900);
  const file = path.join(OUT, `${theme}-${name}.png`);
  await page.screenshot({ path: file });
  console.log(`  + ${theme}-${name}.png`);
}

async function rail(page, label) {
  return tryClick(page, `[aria-label="${label}"], a[href$="/${label.toLowerCase()}"], button[title="${label}"]`, 6000);
}

async function desktop(browser, theme) {
  const ctx = await newContext(browser, theme, DESKTOP);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("   pageerror:", String(e).slice(0, 120)));
  console.log(`[${theme}] desktop ${DESKTOP.width}x${DESKTOP.height}@${DESKTOP.scale}`);

  // Login page as the server presents it. In demo mode that is a single
  // "Launch Demo" button, so the shot is only kept when a credential form is
  // on screen (run the dev-mock backend for that one; see SCREENSHOTS-TODO.md).
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await sleep(3000);
  const hasForm = (await page.locator('input[type="password"]').count()) > 0;
  if (hasForm) {
    await page.locator('input[type="text"], input[type="email"]').first().fill("olivia@example.com").catch(() => {});
    await shoot(page, theme, "login", DESKTOP);
  } else console.log("  - login skipped (demo backend shows no form)");
  // SHOOT_ONLY=login: just the login page (run against the dev-mock backend).
  if (process.env.SHOOT_ONLY === "login") { await ctx.close(); return; }

  await signIn(page);

  // Inbox with the reading pane on a real message.
  await mustClick(page, "text=Invoice #2024-089", "message with attachments");
  await sleep(3000);
  await shoot(page, theme, "inbox", DESKTOP);

  // Composer mid-draft.
  await page.keyboard.press("c");
  await sleep(3000);
  const to = page.locator('input[placeholder*="Recipient" i], input[placeholder*="To" i], input[name="to"]').first();
  if (await to.count()) {
    await to.click().catch(() => {});
    await page.keyboard.type("alice.johnson@example.com", { delay: 20 });
    await page.keyboard.press("Enter");
    await sleep(500);
    // Tab past the autocomplete popover, which otherwise covers the subject field.
    await page.keyboard.press("Tab");
  }
  const subject = page.locator('input[placeholder*="Subject" i], input[name="subject"]').first();
  if (await subject.count()) {
    await subject.click({ force: true }).catch(() => {});
    await page.keyboard.type("Q4 timeline, revised", { delay: 20 });
  }
  const body = page.locator(".ProseMirror, [contenteditable='true']").first();
  if (await body.count()) {
    await body.click().catch(() => {});
    await page.keyboard.type("Hi Alice,\n\nI moved the design review to the 14th so it lands after the prototype hand-off, and pulled the launch readiness check forward a week. Everything else stays where it was.\n\nThe updated plan is attached. Shout if the 14th doesn't work for your side.\n\nThanks,\nOlivia", { delay: 3 });
  }
  await sleep(1500);
  await shoot(page, theme, "composer", DESKTOP);
  // Closing a dirty composer asks "Save or discard draft?"; the first Escape
  // may only close a popover, so keep going until the dialog shows or the
  // composer is gone.
  for (let i = 0; i < 4; i++) {
    const dialog = page.locator('button:has-text("Discard")').last();
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.click({ timeout: 4000 }).catch(() => {});
      await sleep(1200);
    }
    if (!(await page.locator("text=New Message").first().isVisible().catch(() => false))) break;
    await page.keyboard.press("Escape");
    await sleep(1200);
  }
  if (await page.locator("text=New Message").first().isVisible().catch(() => false)) {
    console.log("  ? a 'New Message' element is still visible (may be the compose button's label)");
  }

  // Calendar, week view.
  await rail(page, "Calendar");
  await sleep(6000);
  await tryClick(page, 'button:has-text("Got it")', 1500);
  await mustClick(page, 'button:has-text("Week")', "calendar week view button");
  await sleep(2000);
  // The fixtures put most events in the second half of the month, and the
  // grid opens at midnight: step one week ahead and scroll to working hours.
  await tryClick(page, 'button:has-text("Today") ~ button:nth-of-type(3)', 3000);
  await sleep(2000);
  await page.locator("text=/^07:00$/").first().evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => {});
  await sleep(1500);
  await shoot(page, theme, "calendar-week", DESKTOP);
  // Docs extra: the event editor (features/calendar.md).
  if (await tryClick(page, 'button:has-text("Create event")', 4000)) {
    await sleep(2500);
    await shoot(page, theme, "calendar-create", DESKTOP);
    await page.keyboard.press("Escape");
    await sleep(1000);
  }

  // Contact detail.
  await rail(page, "Contacts");
  await sleep(6000);
  await mustClick(page, "text=Alice Johnson", "contact with activity history");
  await sleep(3000);
  await shoot(page, theme, "contact", DESKTOP);

  // Files: the Documents folder in grid view. The demo blobs carry no bytes,
  // so an open preview renders empty; the office fixtures in a grid say more.
  await rail(page, "Files");
  await sleep(6000);
  await tryClick(page, 'button[aria-label*="grid" i], button[title*="grid" i]', 3000);
  await sleep(1500);
  await page.locator("text=Documents").first().dblclick({ timeout: 6000 }).catch(() => misses.push("Documents folder"));
  await sleep(3000);
  await shoot(page, theme, "files", DESKTOP);

  // Pro shell with several tabs: opened from Settings > Layout.
  await rail(page, "Settings");
  await sleep(5000);
  const layoutTab = page.getByRole("button", { name: "Layout", exact: true }).or(page.getByRole("link", { name: "Layout", exact: true })).first();
  await layoutTab.click({ timeout: 6000 }).catch(() => misses.push("settings Layout tab"));
  await sleep(2500);
  // Flipping the switch is enough: ProInterfaceRedirect takes the standard
  // routes over and lands on /pro on desktop.
  const toggle = page.locator('[data-testid="setting-pro-interface"], [data-testid="setting-pro-interface"] button, button:near(:text("Pro Interface"))').first();
  if (await toggle.count()) {
    await toggle.scrollIntoViewIfNeeded().catch(() => {});
    await toggle.click({ timeout: 5000 }).catch(() => misses.push("pro toggle"));
    await sleep(9000);
    await tryClick(page, 'button:has-text("Got it")', 1500);
    // The address bar follows the focused tab, so the URL is no signal; the
    // tab strip only exists in the Pro shell.
    const inPro = (await page.locator('[role="tablist"]').count()) > 0;
    if (inPro) {
      // Each surface opens as its own tab in Pro: visit a few from the rail,
      // then come back to Mail and open a message so the strip has content.
      for (const label of ["Calendar", "Contacts", "Files"]) {
        await rail(page, label);
        await sleep(3500);
      }
      await tryClick(page, '[role="tab"]:has-text("Mail")', 4000);
      await sleep(2500);
      await page.locator("text=Q4 Project Timeline").first().click({ timeout: 5000 }).catch(() => {});
      await sleep(3000);
      await shoot(page, theme, "pro", DESKTOP);

      // The global search palette lives in the Pro shell: Ctrl+K toggles it
      // (pro/page.tsx), and the rail's search entry opens it too.
      const opened = (await tryClick(page, '[data-tour="nav-search"]', 3000)) || (await page.keyboard.press("Control+KeyK").then(() => true).catch(() => false));
      if (opened) {
        await sleep(1500);
        await page.keyboard.type("Q4", { delay: 40 });
        await sleep(4000);
        await shoot(page, theme, "search", DESKTOP);
        await page.keyboard.press("Escape");
        await sleep(800);
      }
    } else {
      console.log(`  - Pro shell did not open (at ${page.url()})`);
      await page.screenshot({ path: path.join(OUT, `${theme}-debug-pro.png`) }).catch(() => {});
      misses.push("pro");
    }
  } else {
    console.log("  - Pro Interface setting not found; pro shot skipped");
    await page.screenshot({ path: path.join(OUT, `${theme}-debug-settings.png`) }).catch(() => {});
    misses.push("pro");
  }

  await ctx.close();
}

// Admin dashboard (guides/admin.md). Its own session: a fresh navigation is
// fine here. Needs SHOOT_ADMIN_PASSWORD, the ADMIN_PASSWORD the server was
// started with (against a scratch ADMIN_CONFIG_DIR, never the real one).
async function admin(browser, theme) {
  const password = process.env.SHOOT_ADMIN_PASSWORD;
  if (!password) { console.log(`[${theme}] admin skipped (SHOOT_ADMIN_PASSWORD unset)`); return; }
  const ctx = await newContext(browser, theme, DESKTOP);
  const page = await ctx.newPage();
  console.log(`[${theme}] admin`);
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await sleep(3000);
  await page.locator('input[type="password"]').first().fill(password).catch(() => misses.push("admin password field"));
  await page.keyboard.press("Enter");
  await sleep(6000);
  if (page.url().includes("/login")) { console.log("  ! admin login failed"); misses.push("admin login"); await ctx.close(); return; }
  await shoot(page, theme, "admin-overview", DESKTOP);
  if (await tryClick(page, '[role="tab"]:has-text("Plugins"), button:has-text("Plugins"), a:has-text("Plugins")', 4000)) {
    await sleep(3000);
    await shoot(page, theme, "admin-plugins", DESKTOP);
  }
  await ctx.close();
}

async function phone(browser, theme) {
  const ctx = await newContext(browser, theme, PHONE);
  const page = await ctx.newPage();
  console.log(`[${theme}] phone ${PHONE.width}x${PHONE.height}@${PHONE.scale}`);
  await signIn(page);
  await sleep(2000);
  await shoot(page, theme, "phone-inbox", PHONE);
  await mustClick(page, "text=Invoice #2024-089", "message on the phone list");
  await sleep(3500);
  await shoot(page, theme, "phone-message", PHONE);
  await ctx.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const theme of themes) {
    await desktop(browser, theme);
    if (process.env.SHOOT_ONLY !== "login") {
      await phone(browser, theme);
      await admin(browser, theme);
    }
  }
  await browser.close();
  if (misses.length) {
    console.log(`missed ${misses.length} target(s): ${misses.join(", ")}`);
    process.exit(1);
  }
  console.log(`done: ${OUT}`);
})().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
