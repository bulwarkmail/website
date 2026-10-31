import { ArrowRight, ArrowUpRight, Calendar, Check, Code2, Contact, Folder, Globe, Mail, MapPin, Minus, Plus, Zap } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { InstallChoice } from "@/components/install-choice";
import { DockerSteps, LiteSteps } from "@/components/install-steps";
import { CodeBlock } from "@/components/code-block";
import { Shot, Tile } from "@/components/ui";
import { TableSection, TileSection } from "@/components/sections";
import { ICON } from "@/lib/icon";
import { BULWARK_VERSION } from "@/lib/version";

// =============================================================================
// Landing page, "Flat fields".
//
// Nav and hero share one flat field, the screenshot leaves it at the right
// edge of the page, and the field returns once for install. Every section is
// a heading plus at most one paragraph; no section has a label above it.
//
// One page for both ways to run Bulwark. Where Bulwark and Bulwark Lite
// differ, the text says so.
// =============================================================================

const GITHUB = "https://github.com/bulwarkmail/webmail";
const GITHUB_API = "https://api.github.com/repos/bulwarkmail/webmail";

// Fallbacks for when the live lookups below fail. Refresh them with each
// release: `ls locales | wc -l` in the webmail checkout.
const FALLBACK = { instances: 6457, langs: 29, version: "1.19.1" };

// The latest published release, not main's VERSION file, so the JSON-LD
// never names a version that hasn't shipped.
async function fetchLatestVersion(): Promise<string> {
  try {
    const res = await fetch(`${GITHUB_API}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string };
      if (typeof data.tag_name === "string") return data.tag_name.replace(/^v/, "");
    }
  } catch {
    // fall through
  }
  return FALLBACK.version;
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

// -----------------------------------------------------------------------------
// SECTION: Hero - on the field, the screenshot leaves it at the right page edge
// -----------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="bw-field bw-hero">
      <div className="bw-w">
        <div className="bw-hero-in">
          <div className="bw-hero-text">
            <h1 className="bw-h1">Webmail for Stalwart Mail Server.</h1>
            <p className="bw-lead">
              Bulwark puts mail, calendar, contacts and files in one browser client that talks JMAP to your own server,
              for a household, a small team or a whole organisation.
            </p>
            <div className="bw-btns">
              <Link href="/#install" className="bw-btn">
                Get started <ArrowRight size={16} {...ICON} />
              </Link>
              <a href="https://demo.bulwarkmail.org" target="_blank" rel="noopener noreferrer" className="bw-btn bw-btn-ghost">
                Try the demo <ArrowUpRight size={16} {...ICON} />
              </a>
            </div>
          </div>
          <Shot
            name="inbox"
            alt="The Bulwark inbox with a conversation open in the reading pane"
            className="bw-hero-shot"
            sizes="(max-width: 900px) 120vw, 60vw"
            window
            priority
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Sponsors - one quiet bar under the hero. Logos are masks filled
// with the text colour, so every brand reads the same in both themes.
// -----------------------------------------------------------------------------
type Sponsor = {
  name: string;
  href: string;
  /** Logo path under /public. Rendered through a CSS mask, so only its alpha matters. */
  logo: string;
  /** Logo width divided by its height. */
  ratio: number;
  /** Rendered height in px. One-line wordmarks sit around 26, two-line ones need more to stay legible. */
  height: number;
};

const SPONSORS: Sponsor[] = [
  { name: "Superspace", href: "https://superspace.nl", logo: "/logos/superspace.svg", ratio: 255 / 42.5, height: 26 },
  { name: "RBM Systems", href: "https://rbm.systems", logo: "/logos/rbmsys.svg", ratio: 124 / 31.48, height: 30 },
  { name: "Ingenieurbüro Lepthien", href: "https://lepthien.info/", logo: "/logos/lepthien.svg", ratio: 4, height: 40 },
];

function SponsorsSection() {
  return (
    <section className="bw-band bw-sponsors" aria-label="Sponsors">
      <div className="bw-w">
        <div className="bw-sponsors-in">
          <span className="bw-sponsors-label">Sponsored by</span>
          {SPONSORS.map(({ name, href, logo, ratio, height }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bw-sponsor"
              aria-label={name}
            >
              <span
                className="bw-sponsor-logo"
                style={{ "--logo": `url(${logo})`, "--ratio": ratio, "--h": `${height}px` } as React.CSSProperties}
              />
            </a>
          ))}
          <a
            href="https://github.com/sponsors/bulwarkmail"
            target="_blank"
            rel="noopener noreferrer"
            className="bw-link bw-sponsors-cta"
          >
            Become a sponsor <ArrowUpRight size={14} {...ICON} />
          </a>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Fact row
// -----------------------------------------------------------------------------
function FactsSection({ langs }: { langs: number }) {
  const facts = [
    { icon: Code2, title: "Open source", text: "AGPL-3.0, developed in public on GitHub." },
    { icon: Zap, title: "Built on JMAP", text: "Stalwart pushes each change, and the client fetches only the difference." },
    { icon: Globe, title: `${langs} languages`, text: "Including Arabic, Hebrew and Persian, written right to left." },
    { icon: MapPin, title: "Built in the EU", text: "Runs on your hardware. Your mail stays on your Stalwart server." },
  ];
  return (
    <section className="bw-sec-tight">
      <div className="bw-w">
        <div className="bw-facts">
          {facts.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon size={24} {...ICON} />
              <h3 className="bw-h3">{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: The four apps
// -----------------------------------------------------------------------------
function AppsSection() {
  return (
    <section id="features" className="bw-sec">
      <div className="bw-w">
        <div className="bw-head">
          <h2 className="bw-h2">Everything Stalwart stores, in one interface.</h2>
          <p>
            Stalwart keeps your messages, calendars, address books and files. Bulwark shows all four in the same
            window, with a single search across them.
          </p>
        </div>
        <div className="bw-tiles">
          <Tile
            href="/docs/features/email"
            icon={Mail}
            title="Mail"
            text="Threaded conversations, a unified inbox, Sieve filters and scheduled send."
          />
          <Tile
            href="/docs/features/calendar"
            icon={Calendar}
            title="Calendar"
            text="Month, week, day and agenda views with invitations and free/busy."
          />
          <Tile
            href="/docs/features/contacts"
            icon={Contact}
            title="Contacts"
            text="Several address books, groups, and vCard import and export."
          />
          <Tile
            href="/docs/features/files"
            icon={Folder}
            title="Files"
            text="Stalwart's file storage with previews and sharing, and office editing with Collabora or ONLYOFFICE."
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Text-and-figure rows. The figure is always product UI, shown whole
// in a browser window rather than cropped to a detail.
// -----------------------------------------------------------------------------
type FeatureRowProps = {
  heading: string;
  text: React.ReactNode;
  link: { label: string; href: string };
  shot: { name: string; alt: string };
  /** Figure on the left, on the quiet surface band. */
  flip?: boolean;
};

function FeatureRow({ heading, text, link, shot, flip }: FeatureRowProps) {
  return (
    <section className={flip ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className={`bw-split bw-split-center ${flip ? "bw-split-8-4" : "bw-split-4-8"}`}>
          <div className={flip ? "bw-stack bw-order-last" : "bw-stack"}>
            <h2 className="bw-h2">{heading}</h2>
            <p className="bw-muted">{text}</p>
            <Link href={link.href} className="bw-tlink">
              {link.label} <ArrowRight size={16} {...ICON} />
            </Link>
          </div>
          <Shot name={shot.name} alt={shot.alt} window />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Two ways to run it
// -----------------------------------------------------------------------------

// Verified against scripts/lite/lib.mjs, lib/auth/lite-oauth.ts and the IS_LITE
// gates in the webmail checkout (1.19.1). If a row here can't be traced to one
// of those, take it out.
const EDITION_ROWS: [string, boolean | string, boolean | string][] = [
  ["Mail, calendar, contacts and files", true, true],
  ["Several accounts at once", true, true],
  ["Sign-in with a password and TOTP", true, true],
  ["Single sign-on (OAuth, OpenID Connect)", true, "Only when Stalwart serves Lite"],
  ["Policies, locks and organisation signatures", true, "From a policy.json file"],
  ["Admin console and setup wizard", true, false],
  ["Plugins, such as S/MIME", true, false],
  ["Settings that follow you between devices", true, false],
  ["Office document editing", true, false],
  ["Web push notifications", true, false],
  ["Runs on", "Docker or Node.js, amd64 and arm64", "Any static web host, a small nginx container, or Stalwart"],
];

function YesNo({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <>{value}</>;
  return value ? (
    <span className="bw-yn bw-yn-yes">
      <Check size={16} {...ICON} /> Yes
    </span>
  ) : (
    <span className="bw-yn bw-yn-no">
      <Minus size={16} {...ICON} /> No
    </span>
  );
}

function EditionsSection() {
  return (
    <section className="bw-sec">
      <div className="bw-w">
        <div className="bw-split bw-split-4-8">
          <div className="bw-head">
            <h2 className="bw-h2">Run it as a container, or as static files.</h2>
            <p>
              Bulwark runs as a Node.js container with an admin console. Bulwark Lite is the same client built as
              static files, for any web host or for Stalwart to serve itself. Lite leaves out the admin console,
              plugins, office editing and web push.
            </p>
            <Link href="/docs/getting-started/editions" className="bw-tlink">
              Compare the two <ArrowRight size={16} {...ICON} />
            </Link>
            <Link href="/choose" className="bw-tlink">
              Take the one-minute quiz <ArrowRight size={16} {...ICON} />
            </Link>
          </div>
          <div className="bw-table-wrap">
            <table className="bw-table bw-table-compare">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Bulwark</th>
                  <th scope="col">Bulwark Lite</th>
                </tr>
              </thead>
              <tbody>
                {EDITION_ROWS.map(([feature, full, lite]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td>
                      <YesNo value={full} />
                    </td>
                    <td>
                      <YesNo value={lite} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Install - the field returns once. Three numbered steps for each way
// to install; the choice between them lives inside this section only.
// -----------------------------------------------------------------------------
function InstallSection() {
  return (
    <section id="install" className="bw-sec bw-field">
      <div className="bw-w">
        <div className="bw-split bw-split-5-7">
          <div className="bw-stack">
            <h2 className="bw-h2">Install Bulwark in three steps.</h2>
            <p>You need a Stalwart server, and Docker for the container or any web host for Lite.</p>
          </div>
          <InstallChoice
            label="How to install"
            choices={[
              { id: "docker", label: "With Docker", panel: <DockerSteps /> },
              { id: "static", label: "As static files", panel: <LiteSteps /> },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Other projects
// -----------------------------------------------------------------------------
function ProjectsSection() {
  return (
    <section className="bw-sec">
      <div className="bw-w">
        <div className="bw-head">
          <h2 className="bw-h2">More from the Bulwark project.</h2>
        </div>
        <div className="bw-tiles">
          <Tile
            href="https://github.com/bulwarkmail/native"
            title="Bulwark Mobile"
            text="Mail, calendar, contacts and files on Android and iOS, as a beta."
          />
          <Tile
            href="https://github.com/bulwarkmail/legacy-proxy"
            title="Legacy Proxy"
            text="Lets Bulwark read an existing IMAP account. Pre-1.0, mail and contacts only."
          />
          <Tile
            href="https://github.com/bulwarkmail/homeassistant-jmap"
            title="Home Assistant"
            text="Unread counts and new-mail events from any JMAP server. Pre-1.0."
          />
          <Tile
            href="https://extensions.bulwarkmail.org/"
            title="Extensions"
            text="Plugins and themes, installed from the admin console."
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Open source - heading, one paragraph and the two buttons. The
// sponsors themselves are in the bar under the hero.
// -----------------------------------------------------------------------------
function OpenSourceSection({ instances }: { instances: number }) {
  return (
    <section className="bw-sec bw-band">
      <div className="bw-w">
        <div className="bw-stack" style={{ maxWidth: 720 }}>
          <h2 className="bw-h2">Bulwark is open source under AGPL-3.0.</h2>
          <p className="bw-muted">
            The code, the issue tracker and the release notes are public, and{" "}
            <a
              href="https://grafana.external.bulwarkmail.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bw-link"
            >
              {instances.toLocaleString("en-US")} instances
            </a>{" "}
            have reported in so far. Sponsors pay for the work.
          </p>
          <div className="bw-btns" style={{ marginTop: 8 }}>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="bw-btn">
              View source on GitHub <ArrowUpRight size={16} {...ICON} />
            </a>
            <a
              href="https://github.com/sponsors/bulwarkmail"
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn bw-btn-ghost"
            >
              Become a sponsor <ArrowUpRight size={16} {...ICON} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: FAQ
// -----------------------------------------------------------------------------
type Faq = { q: string; a: React.ReactNode };

const FAQS: Faq[] = [
  {
    q: "Is Bulwark the mail server?",
    a: "Bulwark is the client. Stalwart is the mail server: it holds the messages, speaks SMTP, and owns the accounts and the spam filtering. Install Stalwart first, then point Bulwark at it.",
  },
  {
    q: "Why JMAP?",
    a: "JMAP moves threading, search and change tracking to the server and returns only what changed. The inbox updates by push, and marking twenty messages as read is one request.",
  },
  {
    q: "Bulwark or Bulwark Lite?",
    a: "Choose Lite if you already run a web server and your users sign in with a password. Choose Bulwark for OAuth, plugins, settings sync or the admin console. Both build from the same commit and store nothing of their own, so switching is a redeploy.",
  },
  {
    q: "Does it work with a Stalwart server I already run?",
    a: (
      <>
        Yes, if it runs Stalwart 0.16.6 or newer, or 1.0 with Bulwark {BULWARK_VERSION} or newer. Point Bulwark at the
        JMAP endpoint and sign in with the accounts you have. Nothing migrates, and Stalwart stays the source of truth.
        Before a server moves to 1.0, read the{" "}
        <Link href="/docs/deployment/updating/stalwart-1-0" className="bw-link">
          upgrade guide
        </Link>
        .
      </>
    ),
  },
  {
    q: "What does deployment look like?",
    a: "One container next to Stalwart, behind the reverse proxy you already use, or Bulwark Lite as a folder on any web host. There are examples for Caddy, Traefik and nginx, a Compose file for Stalwart and Bulwark together, standalone builds on every release for installs without Docker, and the Lite zip.",
  },
  {
    q: "Why does Lite need a CORS setting on the mail server?",
    a: "In Lite the browser talks to Stalwart directly, from your static host's origin, and browsers only allow that when the mail server says so. One setting in Stalwart allows it: the Permissive CORS policy, under Settings > Network > HTTP > Security in its web admin.",
  },
  {
    q: "Can I try it first?",
    a: (
      <>
        Yes.{" "}
        <a href="https://demo.bulwarkmail.org" target="_blank" rel="noopener noreferrer" className="bw-link">
          demo.bulwarkmail.org
        </a>{" "}
        runs the client on sample data with no mail server behind it, so you can click through mail, calendar,
        contacts and files, but nothing is saved or sent and a reload starts over. Installing the container against
        your own Stalwart takes about ten minutes.
      </>
    ),
  },
];

function FaqSection() {
  return (
    <section id="faq" className="bw-sec">
      <div className="bw-w">
        <div className="bw-split bw-split-4-8">
          <h2 className="bw-h2">Questions about running Bulwark</h2>
          <div className="bw-faq">
            {FAQS.map((f, i) => {
              const open = i === 0;
              return (
                <details key={f.q} open={open}>
                  <summary>
                    {f.q}
                    <Plus size={18} {...ICON} />
                  </summary>
                  <p>{f.a}</p>
                </details>
              );
            })}
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
  const [version, instances, langs] = await Promise.all([
    fetchLatestVersion(),
    fetchBulwarkInstances(),
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
    downloadUrl: GITHUB,
    softwareVersion: version,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Bulwark Mail", url: "https://bulwarkmail.org" },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        <HeroSection />
        <SponsorsSection />
        <FactsSection langs={langs ?? FALLBACK.langs} />
        <TileSection
          id="who"
          heading="Bulwark runs for a family, a small business or a whole organisation."
          text="Each of them runs Stalwart for the mail. Bulwark is the client their people use every day."
          columns={3}
          tiles={[
            {
              title: "Organisations",
              text: "Single sign-on, policies per domain or group, and one signature for everyone.",
              href: "/organisations",
            },
            {
              title: "Small businesses",
              text: "A shared mailbox and shared calendars, installed as one container.",
              href: "/small-business",
            },
            {
              title: "Home and homelab",
              text: "One container next to Stalwart, arm64 images, or static files with no Node process.",
              href: "/homelab",
            },
          ]}
        />
        <TableSection
          heading="Stalwart is the mail server. Bulwark is the client."
          text="Install Stalwart first, then point Bulwark at it. Stalwart stores your mail; Bulwark reads and writes it over JMAP and keeps no copy."
          link={{ label: "Setting up Stalwart", href: "/docs/getting-started/configuration/stalwart-setup" }}
          columns={["Stalwart does", "Bulwark adds"]}
          rows={[
            ["Receives and sends mail, filters spam", "Mail, calendar, contacts and files in one browser window"],
            ["Stores mailboxes, calendars, address books and files", "Search across all four, and push updates as they happen"],
            ["Holds the accounts, groups and shared mailboxes", "Policies, locks and signatures per domain or group"],
            ["Can be your OpenID Connect provider", "Sign-in through that provider or another one, and an admin console"],
          ]}
        />
        <AppsSection />
        <FeatureRow
          heading="Mail opens as threads, with search across every folder."
          text="The server threads each conversation and a unified inbox covers every account. Sieve filters, templates and S/MIME are built in."
          link={{ label: "Mail features", href: "/docs/features/email" }}
          shot={{ name: "composer", alt: "The composer with a draft open over the inbox" }}
        />
        <FeatureRow
          flip
          heading="The calendar handles invitations and recurring events."
          text="Scroll freely through month, week, day and agenda views. Invitations arrive as mail and are answered from the message, and shared calendars show who is free."
          link={{ label: "Calendar features", href: "/docs/features/calendar" }}
          shot={{ name: "calendar", alt: "The calendar in month view with several events" }}
        />
        <FeatureRow
          heading="Files sit on the mail server, next to your mail."
          text="Bulwark browses Stalwart's file storage with previews, sharing and folder upload. With Collabora Online or ONLYOFFICE, office documents open for editing in the browser; Bulwark Lite leaves that out."
          link={{ label: "Files features", href: "/docs/features/files" }}
          shot={{ name: "files", alt: "The files list with folders and documents" }}
        />
        <EditionsSection />
        <InstallSection />
        <ProjectsSection />
        <OpenSourceSection instances={instances ?? FALLBACK.instances} />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
