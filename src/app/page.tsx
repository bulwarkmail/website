import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight, ArrowUpRight, ExternalLink, Github, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BulwarkMark } from "@/components/bulwark-mark";
import { ThemeImage } from "@/components/theme-image";

// =============================================================================
// Editorial homepage - "21st Century" voice
//
// Single-column editorial flow on paper/navy. Tonal contrast between sections
// (paper → paper-deep → navy → paper → navy) replaces card chrome. Brand
// raspberry is the only accent; type carries the layout.
// =============================================================================

const SANS = "var(--font-exo2), system-ui, sans-serif";
const SERIF = "var(--font-source-serif), 'Source Serif 4', Georgia, serif";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const HERO_TITLE = ["Webmail built for", "the 21st", "century."];
const HERO_ACCENT_RANGE: [number, number] = [3, 5]; // "the 21st century."
const HERO_DECK =
  "Email turned fifty in 2021. Webmail has been frozen in place since Gmail and Outlook drew the map. Bulwark is what mail looks like when someone finally writes it for the decade we're in: open protocol, instant push, your hardware.";

const FAQS = [
  {
    q: "Is Bulwark the mail server, or just the front?",
    a: "Just the front. Stalwart is the server: it stores mail, speaks SMTP, runs spam, holds auth. Bulwark is the JMAP client you point your browser at. You run both, but the heavy lifting lives a layer down.",
  },
  {
    q: "Why JMAP and not IMAP?",
    a: "JMAP was designed for the modern web. One TLS connection, push instead of polling, batched mutations, threading on the server. The result is a webmail that feels like a native app instead of a Gmail polyfill.",
  },
  {
    q: "How is this different from running Roundcube or SOGo?",
    a: "Bulwark is built fresh for Stalwart and JMAP - no PHP, no plugin-of-plugins archaeology. The codebase is TypeScript and Next.js, the protocol is open, and the surface area is small enough to read in an afternoon.",
  },
  {
    q: "What does deployment look like?",
    a: "A docker-compose file with two services - Stalwart and Bulwark - sitting behind your reverse proxy of choice. Caddy, Traefik, nginx; we have working examples for each. Manual install is documented if you prefer.",
  },
  {
    q: "Will it sit in front of an existing Stalwart deployment?",
    a: "Yes. Point Bulwark at the JMAP endpoint, set up OAuth or basic auth, and you're done. No data migration, no reformatting of mailboxes; Stalwart stays the source of truth and Bulwark is just another client talking to it.",
  },
  {
    q: "Is there a hosted version I can try first?",
    a: "There's a limited demo at demo.bulwarkmail.org - read-only-ish, shared mailbox, reset every hour, kept up to honestly look like the real thing. Beyond that, no hosted tier we run. The project is for people who would rather host their own; a hosted plan would quietly become the thing we're funded by, and we'd rather not. If the demo isn't enough, the container runs locally in ten minutes.",
  },
];

const STATS = {
  instances: "1,403",
  commits: "769",
  langs: 16,
};

const GITHUB_API = "https://api.github.com/repos/bulwarkmail/webmail";

async function fetchLatestVersion(): Promise<string> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/bulwarkmail/webmail/refs/heads/main/VERSION",
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      return (await res.text()).trim();
    }
  } catch {
    // fall through
  }
  return "1.5.2";
}

async function fetchGithubStars(): Promise<number | null> {
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    if (typeof data.stargazers_count === "number") return data.stargazers_count;
  } catch {
    // fall through
  }
  return null;
}

// GitHub doesn't expose a commit count directly. Asking for one commit per page
// makes the Link header's last-page number equal to the total commit count.
async function fetchGithubCommits(): Promise<number | null> {
  try {
    const res = await fetch(`${GITHUB_API}/commits?per_page=1`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const link = res.headers.get("link");
    if (link) {
      const m = link.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
      if (m) return Number(m[1]);
    }
    // Repo with a single commit returns no Link header.
    const data = (await res.json()) as unknown[];
    return Array.isArray(data) ? data.length : null;
  } catch {
    // fall through
  }
  return null;
}

// Counts entries under /locales on the default branch. Each entry represents
// one translated language (whether it's a JSON file or a per-locale directory).
async function fetchLocaleCount(): Promise<number | null> {
  try {
    const res = await fetch(`${GITHUB_API}/contents/locales`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ name: string; type: string }>;
    if (!Array.isArray(data)) return null;
    return data.filter((e) => e.name !== "." && !e.name.startsWith(".")).length;
  } catch {
    // fall through
  }
  return null;
}

async function fetchBulwarkInstances(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://grafana.external.bulwarkmail.org/api/public/dashboards/e8d712a9a7f44b399eb72a90fe36eb80/panels/1/query",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { A?: { frames?: { data?: { values?: number[][] } }[] } };
    };
    const value = data.results?.A?.frames?.[0]?.data?.values?.[0]?.[0];
    if (typeof value === "number") return value;
  } catch {
    // fall through
  }
  return null;
}

function HeroTitle() {
  const words = HERO_TITLE.join(" ").split(" ");
  const [from, to] = HERO_ACCENT_RANGE;
  return (
    <>
      {words.map((w, i) => {
        const inRange = i >= from && i <= to;
        const trailingBreak = i === 1 || i === 4; // after "for" and "21st"
        return (
          <span key={i}>
            <span className={inRange ? "ed-hero-underline" : undefined}>{w}</span>
            {i < words.length - 1 ? (trailingBreak ? <br /> : " ") : null}
          </span>
        );
      })}
    </>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Hero
// -----------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 sm:px-8 lg:px-14 pt-20 sm:pt-28 pb-14 sm:pb-20">
      {/* Background mark - center sits on the right edge of the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 150, right: -800, opacity: 0.07, zIndex: 0 }}
      >
        <BulwarkMark size={1600} color="var(--rasp)" />
      </div>
      <div className="relative mx-auto max-w-[1440px]" style={{ zIndex: 1 }}>
        {/* Title */}
        <h1
          className="ed-display animate-fade-in-up text-foreground"
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
            fontSize: "clamp(3rem, 11vw, 9.75rem)",
            maxWidth: "1300px",
          }}
        >
          <HeroTitle />
        </h1>

        {/* Deck + CTAs */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-20 items-end animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <p
            className="text-foreground/70"
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: "clamp(1.1rem, 1.6vw, 1.375rem)",
              lineHeight: 1.45,
              maxWidth: "700px",
            }}
          >
            {HERO_DECK}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className="ed-cta-primary">
              Read the docs <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="ed-cta-ghost"
            >
              <Github className="w-4 h-4" />
              View source
            </a>
          </div>
        </div>

        {/* Sponsors strip */}
        <div className="mt-16 sm:mt-20 pt-6 border-t border-[color:var(--rule)]">
          <p className="ed-eyebrow text-center mb-6">Backed by</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-12">
            <a
              href="https://rbm.systems"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/rbmsys.svg" alt="RBM Sys" className="h-9 w-auto" />
            </a>
            <a
              href="https://lepthien.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo"
            >
              <Image
                src="/logos/logo(3).png"
                alt="Le Phien Lab"
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </a>
            <a
              href="https://github.com/sponsors/bulwarkmail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 border border-dashed border-[color:var(--rule)] text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors text-sm"
              style={{ fontFamily: SANS }}
            >
              Become a sponsor
            </a>
          </div>
        </div>

        {/* Inbox screenshot - flat, hairline border */}
        <div className="mt-14 sm:mt-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="block w-2 h-2" style={{ background: "var(--rasp)" }} />
            <span className="ed-runhead">Mail · reading view</span>
          </div>
          <ThemeImage
            light="/screenshots/light-viewer.png"
            dark="/screenshots/dark-viewer.png"
            alt="Bulwark mail reading view"
            width={2560}
            height={1440}
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="ed-plate"
            style={{ borderRadius: 10 }}
          />
        </div>

      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Mission ("Email is fifty. Webmail doesn't have to be.")
// -----------------------------------------------------------------------------

// Email's birthday: October 1, 1971 - used as the reference date for showing
// how old email actually is on every page render.
const EMAIL_BIRTH = new Date(1971, 9, 1);

function emailAge(now: Date = new Date()): number {
  let age = now.getFullYear() - EMAIL_BIRTH.getFullYear();
  const m = now.getMonth() - EMAIL_BIRTH.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < EMAIL_BIRTH.getDate())) age--;
  return age;
}

const NUMBER_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const NUMBER_TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const NUMBER_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToWord(n: number): string {
  if (n < 0) return "";
  if (n < 10) return NUMBER_ONES[n];
  if (n < 20) return NUMBER_TEENS[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (t >= NUMBER_TENS.length) return String(n);
  return o === 0 ? NUMBER_TENS[t] : `${NUMBER_TENS[t]}-${NUMBER_ONES[o]}`;
}

function MissionSection() {
  const ageWord = numberToWord(emailAge());
  const ticks: { y: string; t: string; hi?: boolean }[] = [
    { y: "1971", t: "first email sent" },
    { y: "1996", t: "Hotmail launches" },
    { y: "2008", t: "Roundcube 0.2" },
    { y: "2019", t: "JMAP standardised", hi: true },
    { y: "2026", t: "Bulwark v1", hi: true },
  ];
  return (
    <section id="mission" className="ed-section">
      <div className="mx-auto max-w-[1440px]">
        <h2
          className="text-foreground"
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1.02,
            margin: "0 0 48px",
            maxWidth: "1180px",
            fontSize: "clamp(2.25rem, 11vw, 8.25rem)",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
        >
          Email is{" "}
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: "var(--rasp)" }}>
            {ageWord}.
          </span>{" "}
          Webmail doesn&apos;t have to be.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start mb-16 sm:mb-20">
          <p
            className="text-foreground"
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: "clamp(1.1rem, 1.5vw, 1.375rem)",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "640px",
            }}
          >
            Most self-hosted webmail still feels like 2008 because{" "}
            <em style={{ fontStyle: "normal", fontFamily: SERIF, color: "var(--rasp)" }}>
              most of it was written then
            </em>
            . The protocols caught up in 2019. The web caught up before that. Mail was the last surface waiting; Bulwark is what catching up looks like.
          </p>
          <div className="border-l border-[color:var(--rule)] pl-8">
            <div className="ed-eyebrow mb-3">What 2019 changed</div>
            <ul className="flex flex-col m-0 p-0 list-none border-t border-[color:var(--rule)]">
              {[
                ["Push, not polling", "Server tells the client when state changes; no 30-second IMAP loop, no idle reconnects."],
                ["One round-trip per click", "Mark-read, move, and fetch-next batched into a single JMAP call."],
                ["Threading at the server", "Conversations stitched in Stalwart, not reassembled per-render in the browser."],
                ["Typed across the wire", "JMAP defines exact response shapes; the client is strict TS, so drift is a compile error."],
              ].map(([name, desc]) => (
                <li
                  key={name}
                  className="grid grid-cols-[minmax(160px,_38%)_1fr] gap-6 items-baseline py-2 border-b border-[color:var(--rule)]"
                >
                  <span
                    className="text-foreground"
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "-0.005em",
                      whiteSpace: "nowrap",
                      lineHeight: 1.3,
                    }}
                  >
                    {name}
                  </span>
                  <span
                    className="text-foreground/70"
                    style={{ fontFamily: SERIF, fontSize: "14px", lineHeight: 1.3 }}
                  >
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline - vertical on mobile, horizontal from sm up */}
        <ul className="sm:hidden flex flex-col m-0 p-0 list-none pt-4 border-t border-[color:var(--rule)]">
          {ticks.map((t) => (
            <li
              key={`m-${t.y}`}
              className="grid items-center gap-4 py-5 border-b border-[color:var(--rule)]"
              style={{ gridTemplateColumns: "auto auto 1fr" }}
            >
              <div
                aria-hidden
                style={{
                  width: t.hi ? 14 : 10,
                  height: t.hi ? 14 : 10,
                  background: t.hi ? "var(--rasp)" : "var(--foreground)",
                  borderRadius: t.hi ? 0 : "50%",
                }}
              />
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontSize: "clamp(3rem, 16vw, 5rem)",
                  color: t.hi ? "var(--rasp)" : "var(--foreground)",
                }}
              >
                {t.y}
              </div>
              <div
                className="ed-eyebrow text-right"
                style={{ letterSpacing: "0.14em", lineHeight: 1.35, fontSize: 12 }}
              >
                {t.t}
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden sm:block overflow-x-auto pt-4">
          <div className="min-w-[640px]">
            {/* Year row */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${ticks.length}, 1fr)` }}
            >
              {ticks.map((t) => (
                <div
                  key={`y-${t.y}`}
                  className="text-left pr-4"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                    color: t.hi ? "var(--rasp)" : "var(--foreground)",
                  }}
                >
                  {t.y}
                </div>
              ))}
            </div>

            {/* Dots + line row: line is absolutely positioned at this row's
                vertical center, dots sit on the same center so the line
                visibly passes through them. */}
            <div className="relative" style={{ height: 14, marginTop: 16 }}>
              <div
                className="absolute"
                style={{
                  left: 0,
                  right: 12,
                  top: "50%",
                  height: 1,
                  background: "var(--rule)",
                  transform: "translateY(-50%)",
                }}
              />
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "var(--rasp)",
                }}
              />
              <div
                className="grid relative h-full"
                style={{ gridTemplateColumns: `repeat(${ticks.length}, 1fr)` }}
              >
                {ticks.map((t) => (
                  <div key={`d-${t.y}`} className="relative pr-4 h-full">
                    <div
                      style={{
                        width: t.hi ? 12 : 8,
                        height: t.hi ? 12 : 8,
                        background: t.hi ? "var(--rasp)" : "var(--foreground)",
                        borderRadius: t.hi ? 0 : "50%",
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Label row */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${ticks.length}, 1fr)`, marginTop: 18 }}
            >
              {ticks.map((t) => (
                <div
                  key={`l-${t.y}`}
                  className="ed-eyebrow text-left pr-4"
                  style={{ letterSpacing: "0.1em", lineHeight: 1.4 }}
                >
                  {t.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Surfaces - overlapping screenshot plates on navy
// -----------------------------------------------------------------------------
function SurfacesSection() {
  return (
    <section id="features" className="ed-section ed-on-navy relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{
        top: -200, right: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(219,45,84,0.20) 0%, transparent 60%)",
      }} />
      <div className="mx-auto max-w-[1440px] relative">
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "16px 0 24px",
            maxWidth: "1100px",
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            color: "var(--paper)",
          }}
        >
          One window. Mail, calendar,<br />contacts, files; all current.
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontSize: "clamp(1rem, 1.4vw, 1.1875rem)",
            lineHeight: 1.5,
            color: "var(--muted-navy)",
            maxWidth: 720,
            margin: "0 0 64px",
          }}
        >
          Everything Stalwart already serves, surfaced through a single window with the fit and finish you stopped expecting from self-hosted software a long time ago.
        </p>

        {/* Plate grid - responsive: stack on mobile, 2x2 on lg, overlap-y on xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {([
            { light: "/screenshots/light-pane-at-bottom.png", dark: "/screenshots/dark-pane-at-bottom.png", label: "Mail · reading view" },
            { light: "/screenshots/light-calendar.png", dark: "/screenshots/dark-calendar.png", label: "Calendar · month" },
            { light: "/screenshots/light-settings.png", dark: "/screenshots/dark-settings.png", label: "Settings · accounts & signing" },
            { light: "/screenshots/light-composer.png", dark: "/screenshots/dark-composer.png", label: "Mail · drafting" },
            { light: "/screenshots/light-themes.png", dark: "/screenshots/dark-themes.png", label: "Themes · pick one or write your own" },
            { src: "/screenshots/dark-viewer.png", label: "A glimpse of dark mode", showOnly: "light" as const },
            { src: "/screenshots/light-viewer.png", label: "A glimpse of light mode", showOnly: "dark" as const },
          ] as Array<{ label: string } & ({ light: string; dark: string } | { src: string; showOnly?: "light" | "dark" })>).map((p) => {
            const key = "src" in p ? p.src : p.light;
            const visibilityClass =
              "showOnly" in p && p.showOnly === "light"
                ? "theme-light-only"
                : "showOnly" in p && p.showOnly === "dark"
                  ? "theme-dark-only"
                  : "";
            return (
              <div key={key} className={visibilityClass}>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="block w-2 h-2" style={{ background: "var(--rasp)" }} />
                  <span className="ed-runhead" style={{ color: "var(--muted-navy)" }}>
                    {p.label}
                  </span>
                </div>
                {"src" in p ? (
                  <Image
                    src={p.src}
                    alt={p.label}
                    width={2560}
                    height={1440}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="ed-plate"
                  />
                ) : (
                  <ThemeImage
                    light={p.light}
                    dark={p.dark}
                    alt={p.label}
                    width={2560}
                    height={1440}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="ed-plate"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Overview - install + suite
// -----------------------------------------------------------------------------
function OverviewSection() {
  const apps: [string, string][] = [
    ["Mail", "threading, unified inbox, full-text search, Sieve filters, S/MIME, templates"],
    ["Calendar", "month / week / day / agenda, recurring events, iMIP invitations, CalDAV subscriptions"],
    ["Contacts", "multiple address books, groups, vCard import / export"],
    ["Files", "Stalwart's JMAP FileNode storage with previews and folder upload"],
  ];
  return (
    <section id="deploy" className="ed-section">
      <div className="mx-auto max-w-[1440px]">
        <h2
          className="text-foreground"
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 28px",
            maxWidth: 1100,
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
          }}
        >
          Installing it takes less time<br />
          than uninstalling{" "}
          <span
            className="group relative inline-block"
            style={{
              color: "var(--rasp)",
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              cursor:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'/%3E%3C/svg%3E\") 16 16, pointer",
            }}
          >
            Outlook.
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clippy.gif"
              alt=""
              aria-hidden="true"
              className="absolute left-full top-1/2 -translate-y-1/2 -ml-16 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ width: 220, height: "auto" }}
            />
          </span>
        </h2>
        <p
          className="text-foreground/70"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.4vw, 1.375rem)",
            lineHeight: 1.5,
            maxWidth: 820,
            margin: "0 0 56px",
          }}
        >
          The wizard handles the parts that would otherwise be in a config file. You&apos;ll probably spend longer picking a logo on the branding screen than configuring the mail server.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT - Features (apps list + infra panel) */}
          <div className="flex flex-col gap-10">
            <div>
              <div className="ed-eyebrow mb-4">What you get</div>
              <div className="border-t-2 border-foreground">
                {apps.map((a) => (
                  <div
                    key={a[0]}
                    className="py-5 border-b border-[color:var(--rule)]"
                  >
                    <div
                      className="text-foreground"
                      style={{
                        fontFamily: SANS,
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {a[0]}
                    </div>
                    <div
                      className="text-foreground/70 mt-1.5"
                      style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.5 }}
                    >
                      {a[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT - Install steps */}
          <div className="flex flex-col gap-10">
            <div>
              <div className="ed-eyebrow mb-4">Quick start</div>
              <ol className="border-t-2 border-foreground m-0 p-0 list-none">
                {[
                  ["Fetch the compose file", "curl -O https://bulwarkmail.org/compose.yml", "$"],
                  ["Bring the container up", "docker compose up -d", "$"],
                  ["Open the setup wizard", "https://mail.example.com", "$"],
                  ["Click through a few screens", "server · auth · security · logging · branding", "→"],
                ].map(([t, c, p]) => (
                  <li
                    key={t}
                    className="py-5 border-b border-[color:var(--rule)]"
                  >
                    <div
                      className="text-foreground"
                      style={{
                        fontFamily: SANS,
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {t}
                    </div>
                    <div
                      className="mt-1.5 text-foreground/70 inline-flex items-center gap-1.5"
                      style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.005em" }}
                    >
                      {p === "→" ? (
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                      ) : (
                        <span>{p}</span>
                      )}
                      <span>{c}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Commons - navy, big star count
// -----------------------------------------------------------------------------
function CommonsSection({
  stars,
  instances,
  commits,
  langs,
}: {
  stars: number | null;
  instances: number | null;
  commits: number | null;
  langs: number | null;
}) {
  return (
    <section className="ed-section ed-on-navy relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{
        bottom: -200, left: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(219,45,84,0.20) 0%, transparent 60%)",
      }} />
      <div className="mx-auto max-w-[1440px] relative">
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 64px",
            maxWidth: 1100,
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            color: "var(--paper)",
          }}
        >
          Fork it, file an issue,<br />
          <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
            send a patch.
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-end">
          <div>
            <div
              className="inline-flex items-baseline gap-4"
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                lineHeight: 0.82,
                letterSpacing: "-0.055em",
                color: "var(--rasp)",
                fontSize: "clamp(6rem, 20vw, 17.5rem)",
              }}
            >
              {stars ?? "-"}
              <Star
                aria-hidden
                strokeWidth={1.5}
                style={{
                  width: "0.28em",
                  height: "0.28em",
                  color: "var(--paper)",
                  flexShrink: 0,
                  alignSelf: "center",
                  transform: "translateY(-0.15em)",
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-7">
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(1.1rem, 1.6vw, 1.625rem)",
                lineHeight: 1.45,
                fontStyle: "italic",
                margin: 0,
                color: "var(--paper)",
              }}
            >
              &ldquo;We&apos;re writing the webmail we wanted in 2026 and didn&apos;t find. Modern protocol, modern tooling, modern UI. Not a SaaS. Not a startup. Not for sale.&rdquo;
            </p>
            <div className="ed-folio" style={{ color: "var(--muted-navy)" }}>
              from our contributing guide
            </div>
            <div
              className="grid grid-cols-3 pt-6"
              style={{ borderTop: "1px solid var(--rule-navy)" }}
            >
              {[
                {
                  n: instances != null ? instances.toLocaleString("en-US") : STATS.instances,
                  k: "confirmed instances",
                  href: "https://grafana.external.bulwarkmail.org",
                },
                {
                  n: commits != null ? commits.toLocaleString("en-US") : STATS.commits,
                  k: "commits",
                  href: "https://github.com/bulwarkmail/webmail/commits/main",
                },
                {
                  n: langs != null ? String(langs) : String(STATS.langs),
                  k: "languages",
                },
              ].map(({ n, k, href }, i) => {
                const content = (
                  <>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
                        color: "var(--paper)",
                      }}
                    >
                      {n}
                    </div>
                    <div className="ed-folio mt-2" style={{ color: "var(--muted-navy)" }}>
                      {k}
                    </div>
                  </>
                );
                return (
                  <div
                    key={k}
                    className={i === 0 ? "" : "pl-5"}
                    style={{ borderLeft: i === 0 ? "none" : "1px solid var(--rule-navy)" }}
                  >
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition-opacity hover:opacity-80"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-14 relative">
          <a
            href="https://github.com/bulwarkmail/webmail"
            target="_blank"
            rel="noopener noreferrer"
            className="ed-cta-primary"
          >
            <Star className="w-4 h-4" /> Star on GitHub
          </a>
          <a
            href="https://github.com/bulwarkmail/webmail"
            target="_blank"
            rel="noopener noreferrer"
            className="ed-cta-ghost"
            style={{ color: "var(--paper)", borderColor: "var(--paper)" }}
          >
            <Github className="w-4 h-4" /> Read the source
          </a>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Other projects
// -----------------------------------------------------------------------------
function OtherProjectsSection() {
  const projects: { tag: string; name: string; accent: string; meta: React.ReactNode; href: string; body: React.ReactNode }[] = [
    {
      tag: "Project",
      name: "bulwark",
      accent: "legacy proxy",
      meta: (
        <>
          JMAP <ArrowLeftRight className="inline w-[0.95em] h-[0.95em] align-[-0.15em]" aria-hidden /> IMAP / SMTP /
          <br />
          ManageSieve / CardDAV
        </>
      ),
      href: "https://github.com/bulwarkmail/legacy-proxy",
      body: (
        <>
          <p style={{ margin: "0 0 1em" }}>
            <em>bulwark legacy proxy</em> is a translation layer that puts a{" "}
            <strong>JMAP for Mail</strong> server in front of a classic{" "}
            <strong>IMAP / SMTP / ManageSieve / CardDAV</strong> stack. It speaks RFC 8620 + RFC 8621 to clients, and standard mailbox protocols to whatever server already holds the user&apos;s mail. No new mail store, no migration: the mail keeps living in the existing IMAP server, and a modern JMAP client sees the account as if it were native.
          </p>
          <div
            style={{
              borderLeft: "2px solid var(--rasp)",
              paddingLeft: 22,
              margin: "24px 0",
              fontStyle: "italic",
            }}
          >
            A JMAP client (Bulwark webmail, JMAP-enabled mobile apps, custom tooling) authenticates against this proxy. The proxy holds an IMAP connection open to the real mail server and translates each JMAP method into the equivalent IMAP / SMTP / ManageSieve / CardDAV operation.
          </div>
        </>
      ),
    },
    {
      tag: "Project · Beta",
      name: "Bulwark",
      accent: "Mobile",
      meta: "React Native · Expo SDK 54\nAndroid shipping · iOS soon",
      href: "https://github.com/bulwarkmail/native",
      body: (
        <>
          <div
            className="ed-eyebrow"
            style={{
              display: "inline-block",
              color: "var(--rasp)",
              border: "1.5px solid var(--rasp)",
              padding: "5px 10px",
              marginBottom: 18,
            }}
          >
            Beta · work in progress
          </div>
          <p style={{ margin: "0 0 1em" }}>
            <em>Bulwark Mobile</em> is a <strong>React Native (Expo SDK 54)</strong> client for Bulwark Webmail - a JMAP-based mail, calendar, contacts and Files app, with built-in <strong>FCM notifications</strong>.
          </p>
          <p style={{ margin: 0 }}>
            The Android build is on GitHub today. An iOS release will follow once we have the hardware to sign and ship it properly.
          </p>
        </>
      ),
    },
    {
      tag: "Project",
      name: "Bulwark",
      accent: "Relay",
      meta: (
        <>
          JMAP PushSubscription <ArrowLeftRight className="inline w-[0.95em] h-[0.95em] align-[-0.15em]" aria-hidden /> FCM
          <br />
          one hosted instance for all
        </>
      ),
      href: "https://github.com/bulwarkmail/relay",
      body: (
        <>
          <p style={{ margin: "0 0 1em" }}>
            <em>Bulwark Relay</em> is a push notification relay for Bulwark Webmail. It terminates <strong>JMAP PushSubscription</strong> pushes from the user&apos;s mail server and forwards them to <strong>Firebase Cloud Messaging</strong>, so the mobile app wakes up and fetches new mail over its own JMAP connection.
          </p>
          <p style={{ margin: 0 }}>
            Designed so self-hosters don&apos;t need their own Firebase project: a single hosted instance serves every Bulwark client that opts in. The relay never sees mail content - only opaque FCM tokens, state-id hashes, and timing.
          </p>
        </>
      ),
    },
    {
      tag: "Project · Open directory",
      name: "Bulwark",
      accent: "Extensions.",
      meta: "Plugins + themes · authored\nin JS, shipped from a manifest",
      href: "https://extensions.bulwarkmail.org/",
      body: (
        <>
          <p style={{ margin: "0 0 1em" }}>
            Bulwark Webmail can be extended with two kinds of third-party add-ons. <strong>Plugins</strong> add hooks, UI buttons, sidebar apps, keyboard shortcuts, and whole new workflows that integrate with the JMAP client. <strong>Themes</strong> customize fonts, colors, and layouts to reshape the look and feel of the inbox.
          </p>
          <p style={{ margin: "0 0 28px" }}>
            Both are published on the <em>Bulwark Extensions</em> directory, which hosts free and open-source extensions that have passed review.
          </p>
        </>
      ),
    },
  ];

  return (
    <section className="ed-section bg-[color:var(--alt-section)]">
      <div className="mx-auto max-w-[1440px]">
        <h2
          className="text-foreground"
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 48px",
            maxWidth: 1100,
            fontSize: "clamp(2rem, 5vw, 5rem)",
          }}
        >
          Other{" "}
          <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
            projects.
          </span>
        </h2>

        {projects.map((p, idx) => (
          <div
            key={p.name + p.accent}
            className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-16 items-start pt-9 border-t-2 border-foreground"
            style={{ marginTop: idx === 0 ? 0 : 64 }}
          >
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--rasp)",
                  marginBottom: 14,
                }}
              >
                {p.tag}
              </div>
              <h3
                className="text-foreground"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  margin: "0 0 14px",
                  fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                }}
              >
                {p.name}
                <br />
                <span
                  style={{
                    color: "var(--rasp)",
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {p.accent}
                </span>
              </h3>
              <div className="ed-folio mb-5">
                {p.meta}
              </div>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground"
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  borderBottom: "1.5px solid var(--rasp)",
                  paddingBottom: 4,
                }}
              >
                {p.href.replace(/^https?:\/\//, "")} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div
              className="text-foreground"
              style={{
                fontFamily: SERIF,
                fontSize: 19,
                lineHeight: 1.6,
                maxWidth: 820,
              }}
            >
              {p.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Questions - centered reading column FAQ
// -----------------------------------------------------------------------------
function QuestionsSection() {
  return (
    <section id="faq" className="ed-section">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-baseline justify-between gap-8 mb-10 sm:mb-14 max-w-[1040px]">
          <h2
            className="text-foreground"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              margin: 0,
              fontSize: "clamp(2.5rem, 9vw, 8.25rem)",
            }}
          >
            The obvious{" "}
            <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
              questions.
            </span>
          </h2>
        </div>

        <div className="max-w-[1040px] relative">
          {FAQS.map((f, i) => {
            const last = i === FAQS.length - 1;
            return (
              <article
                key={i}
                style={{
                  paddingBottom: last ? 0 : 24,
                  marginBottom: last ? 0 : 24,
                  borderBottom: last ? "none" : "1px solid var(--rule)",
                }}
              >
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: SANS,
                    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.3,
                    margin: "0 0 8px",
                    textWrap: "balance",
                  }}
                >
                  {f.q}
                </h3>
                <p
                  className="text-foreground/80 m-0"
                  style={{
                    fontFamily: SERIF,
                    fontSize: 16,
                    lineHeight: 1.55,
                  }}
                >
                  {f.a}
                </p>
              </article>
            );
          })}
        </div>

        <div
          className="max-w-[1040px] mt-10 text-foreground/70"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 17,
            lineHeight: 1.5,
          }}
        >
          The{" "}
          <Link
            href="/docs"
            style={{
              color: "var(--rasp)",
              borderBottom: "1px solid var(--rasp)",
              textDecoration: "none",
            }}
          >
            documentation
          </Link>{" "}
          covers the rest. Or{" "}
          <a
            href="https://github.com/bulwarkmail/webmail/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--rasp)",
              borderBottom: "1px solid var(--rasp)",
              textDecoration: "none",
            }}
          >
            open an issue
          </a>{" "}
          on GitHub; a person reads every one.
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Final CTA - navy with 4px double rasp top border
// -----------------------------------------------------------------------------
function FinalCtaSection() {
  return (
    <section
      className="ed-section ed-on-navy"
      style={{ borderTop: "4px double var(--rasp)" }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20 items-end">
          <h2
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              margin: 0,
              fontSize: "clamp(2.75rem, 10vw, 8.25rem)",
              color: "var(--paper)",
            }}
          >
            Catch
            <br />
            mail{" "}
            <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontWeight: 400, fontStyle: "italic" }}>
              up.
            </span>
          </h2>
          <div className="flex flex-col">
            <Link
              href="/docs"
              className="ed-cta-primary"
              style={{
                justifyContent: "space-between",
                padding: "20px 24px",
                fontSize: 17,
              }}
            >
              Read the docs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://github.com/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="ed-cta-ghost"
              style={{
                justifyContent: "space-between",
                color: "var(--paper)",
                borderColor: "var(--paper)",
                padding: "19px 24px",
                fontSize: 17,
                marginTop: 0,
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Star className="w-4 h-4" /> View source
              </span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// PAGE
// =============================================================================
export default async function Home() {
  const [version, stars, instances, commits, langs] = await Promise.all([
    fetchLatestVersion(),
    fetchGithubStars(),
    fetchBulwarkInstances(),
    fetchGithubCommits(),
    fetchLocaleCount(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bulwark Webmail",
    applicationCategory: "CommunicationApplication",
    operatingSystem: "Web, Docker, Linux",
    description:
      "A modern, self-hosted webmail client for Stalwart Mail Server. Built with Next.js and JMAP for fast, private, self-hosted email, calendar, contacts, and file storage.",
    url: "https://bulwarkmail.org",
    downloadUrl: "https://github.com/bulwarkmail/webmail",
    softwareVersion: version,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Bulwark Mail", url: "https://bulwarkmail.org" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar stars={stars} />

      <main>
        <HeroSection />
        <MissionSection />
        <SurfacesSection />
        <OverviewSection />
        <CommonsSection stars={stars} instances={instances} commits={commits} langs={langs} />
        <OtherProjectsSection />
        <QuestionsSection />
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
