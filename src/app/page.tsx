import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github, Star } from "lucide-react";
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
  "One interface for everything your mail server holds: messages, calendars, address books and files. Bulwark threads your mail, searches all of it, and installs as a PWA on your phone.";

const FAQS = [
  {
    q: "Is Bulwark the mail server, or just the front?",
    a: "The front. Stalwart is the mail server proper. It holds the messages, it's the thing SMTP talks to, and it owns the accounts and the spam filtering. Bulwark is a client that happens to run in a browser rather than on your desktop. You need both, and Stalwart is the one to install first.",
  },
  {
    q: "Why JMAP and not IMAP?",
    a: "IMAP is from 1986 and it shows. Every folder wants its own connection, the client has to keep asking whether anything changed, and threading is something you reassemble yourself after fetching more than you needed. JMAP moves that work to the server and sends back a diff. Concretely: marking twenty messages read is one request instead of twenty.",
  },
  {
    q: "How is this different from running Roundcube or SOGo?",
    a: "Both of those are IMAP clients carrying two decades of compatibility layers, and they carry it honestly. Bulwark started at JMAP, so there was never a layer to accumulate. It's TypeScript and Next.js, and small enough that you can read what it does with your credentials in an afternoon.",
  },
  {
    q: "What does deployment look like?",
    a: "Two services in a compose file, Stalwart and Bulwark, behind whatever reverse proxy you already run. There are working examples for Caddy, Traefik and nginx. If you'd rather not use Docker at all, the manual install is written up too.",
  },
  {
    q: "Will it sit in front of an existing Stalwart deployment?",
    a: "Yes, and that's the least disruptive way to try it. Point Bulwark at the JMAP endpoint and pick OAuth or basic auth. Nothing migrates and nothing gets reformatted. Stalwart stays the source of truth; Bulwark is one more client connecting to it, and you can turn it off again without consequences.",
  },
  {
    q: "Is there a hosted version I can try first?",
    a: "There's a demo at demo.bulwarkmail.org. Shared mailbox, mostly read-only, wiped every hour. Beyond that we don't run a hosted tier and don't intend to. The whole point is people running their own, and a paid tier would slowly become the thing we optimised for. If the demo doesn't answer your question, the container starts locally in about ten minutes.",
  },
];

const STATS = {
  instances: "5,587",
  commits: "769",
  langs: 24,
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
  return "1.7.8";
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

// Panel 5 of the public adoption dashboard: "Total instances ever seen", i.e.
// every instance that has ever reported a heartbeat, not just the active ones.
async function fetchBulwarkInstances(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://grafana.external.bulwarkmail.org/api/public/dashboards/e8d712a9a7f44b399eb72a90fe36eb80/panels/5/query",
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
            . The browser stopped being the limiting factor a long time ago, and JMAP took away the protocol excuse in 2019. We started Bulwark after both of those, which is honestly the only real advantage it has.
          </p>
          <div className="border-l border-[color:var(--rule)] pl-8">
            <div className="ed-eyebrow mb-3">What 2019 changed</div>
            <ul className="flex flex-col m-0 p-0 list-none border-t border-[color:var(--rule)]">
              {[
                ["The server speaks first", "Stalwart announces a state change the moment it happens. The 30-second poll loop goes away, and so do the idle reconnects that came with it."],
                ["One round-trip per click", "Mark-read, move, and fetch-next travel as a single JMAP call."],
                ["Threading is server work", "Stalwart stitches the conversation once. The browser renders what it's handed."],
                ["Typed across the wire", "JMAP pins down the exact response shapes, and the client is strict TypeScript, so any drift between them fails at compile time."],
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
          Four apps that behave<br />like one application.
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
          Stalwart already stores all of it. What was missing was a front end that doesn&apos;t make you feel the seam between mail and calendar, and doesn&apos;t ask you to forgive it for being self-hosted.
        </p>

        {/* Plate grid - responsive: stack on mobile, 2x2 on lg, overlap-y on xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {([
            { light: "/screenshots/light-pane-at-bottom.png", dark: "/screenshots/dark-pane-at-bottom.png", label: "Mail · reading view" },
            { light: "/screenshots/light-calendar.png", dark: "/screenshots/dark-calendar.png", label: "Calendar · month" },
            { light: "/screenshots/light-settings.png", dark: "/screenshots/dark-settings.png", label: "Settings · accounts & signing" },
            { light: "/screenshots/light-composer.png", dark: "/screenshots/dark-composer.png", label: "Mail · drafting" },
            { light: "/screenshots/light-themes.webp", dark: "/screenshots/dark-themes.webp", label: "Themes · pick one or write your own" },
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
          The wizard handles what would otherwise be a config file. You&apos;ll probably spend longer picking a logo on the branding screen than you will pointing Bulwark at your mail server.
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
          It&apos;s AGPL, which means<br />
          <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
            you can just fix it.
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
              &ldquo;We&apos;re writing the webmail we wanted in 2026 and didn&apos;t find: a JMAP-native client with an interface built this decade. It&apos;s AGPL and self-hosted, run by the people who use it rather than sold to them.&rdquo;
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
// SECTION: Other projects - 2x2 grid of clickable tiles
// -----------------------------------------------------------------------------
function OtherProjectsSection() {
  const projects: { tag: string; accent: string; meta: string; body: string; href: string }[] = [
    {
      tag: "Protocol bridge",
      accent: "Legacy Proxy",
      meta: "JMAP in front · IMAP, SMTP, ManageSieve, CardDAV behind",
      body: "A translation layer that lets JMAP clients read a classic IMAP account as if it were native. The proxy speaks JMAP on one side and the ordinary mailbox protocols on the other, and the mail never leaves the server that already holds it.",
      href: "https://github.com/bulwarkmail/legacy-proxy",
    },
    {
      tag: "Mobile app · beta",
      accent: "Mobile",
      meta: "React Native · Android on GitHub, iOS next",
      body: "The same account in your pocket: mail, calendar, contacts and files, woken by push when something arrives. Android builds are on GitHub today; iOS follows once we have the hardware to sign it.",
      href: "https://github.com/bulwarkmail/native",
    },
    {
      tag: "Hosted service",
      accent: "Relay",
      meta: "JMAP push in, Firebase push out · one shared instance",
      body: "Turns the mail server's push notifications into Firebase pushes, so the mobile app wakes without every self-hoster standing up their own Firebase project. All the relay ever sees is a device token and a hashed state id; message content never reaches it.",
      href: "https://github.com/bulwarkmail/relay",
    },
    {
      tag: "Extension directory",
      accent: "Extensions",
      meta: "Plugins and themes · installed from a ZIP",
      body: "Plugins add toolbar buttons, sidebar apps, shortcuts and workflows the stock client doesn't have; themes change how it looks. The directory lists free and open-source extensions that have passed review.",
      href: "https://extensions.bulwarkmail.org/",
    },
  ];

  return (
    <section className="ed-section bg-[color:var(--alt-section)]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 mb-12 sm:mb-16">
          <h2
            className="text-foreground"
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
              margin: 0,
              fontSize: "clamp(2rem, 5vw, 5rem)",
            }}
          >
            Other{" "}
            <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
              projects.
            </span>
          </h2>
          <p
            className="text-foreground/60"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 16,
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 380,
            }}
          >
            The webmail is the main repo. These grew up around it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <a
              key={p.accent}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col border border-[color:var(--rule)] p-6 sm:p-9 transition-colors duration-150 hover:border-foreground/40 hover:bg-[color:var(--background)]"
            >
              <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                <span className="ed-eyebrow">{p.tag}</span>
                <ArrowUpRight
                  className="w-5 h-5 shrink-0 text-foreground/35 transition-all duration-150 group-hover:text-[color:var(--rasp)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </div>
              <h3
                className="text-foreground"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  margin: "0 0 8px",
                  fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)",
                }}
              >
                Bulwark{" "}
                <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
                  {p.accent}
                </span>
              </h3>
              <div className="ed-folio" style={{ marginBottom: 18 }}>
                {p.meta}
              </div>
              <p
                className="text-foreground/85"
                style={{
                  fontFamily: SERIF,
                  fontSize: 17,
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {p.body}
              </p>
              <div className="mt-auto pt-7">
                <span
                  className="text-foreground"
                  style={{
                    fontFamily: MONO,
                    fontSize: 12.5,
                    borderBottom: "1.5px solid var(--rasp)",
                    paddingBottom: 3,
                  }}
                >
                  {p.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
              </div>
            </a>
          ))}
        </div>
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
            Before you{" "}
            <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
              install it.
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
          Anything past this is in the{" "}
          <Link
            href="/docs"
            style={{
              color: "var(--rasp)",
              borderBottom: "1px solid var(--rasp)",
              textDecoration: "none",
            }}
          >
            documentation
          </Link>
          . If it isn&apos;t, that&apos;s a documentation bug, and the{" "}
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
            issue tracker
          </a>{" "}
          is where to say so.
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
      "A self-hosted webmail client for Stalwart Mail Server, built with Next.js and JMAP. Email, calendar, contacts, and file storage in one interface, running on your own hardware.",
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
