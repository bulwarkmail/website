import { ArrowRight, ArrowUpRight, Calendar, Check, Code2, Contact, Folder, Globe, Mail, MapPin, Minus, Plus, Zap } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionLink } from "@/components/edition-link";
import { EditionSwitch } from "@/components/edition-switch";
import { CodeBlock } from "@/components/code-block";
import { Ed, Shot, Tile } from "@/components/ui";
import { ICON } from "@/lib/icon";
import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/og";
import { BULWARK_VERSION } from "@/lib/version";

// =============================================================================
// Landing page, "Flat fields".
//
// Nav and hero share one flat field, the screenshot leaves it at the right
// edge of the page, and the field returns once for install. Every section is
// a heading plus at most one paragraph; no section has a label above it.
//
// Two editions, one page. Copy that differs between Bulwark and Bulwark Lite
// is rendered twice through <Ed>, and the data-edition attribute on <html>
// (set before paint, see layout.tsx) shows one of them. That keeps this a
// server component with no flash.
// =============================================================================

type Edition = "full" | "lite";

const GITHUB = "https://github.com/bulwarkmail/webmail";
const GITHUB_API = "https://api.github.com/repos/bulwarkmail/webmail";

// Fallbacks for when the live lookups below fail. Refresh them with each
// release: `ls locales | wc -l` in the webmail checkout.
const FALLBACK = { instances: 5587, langs: 27 };

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
  return "1.10.0";
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
            <h1 className="bw-h1">
              <Ed full="Webmail for Stalwart Mail Server." lite="Webmail for Stalwart, served as static files." />
            </h1>
            <p className="bw-lead">
              <Ed
                full="Bulwark puts mail, calendar, contacts and files in one browser client that talks JMAP to your own server."
                lite="Bulwark Lite is the same client as a folder of HTML and JavaScript. Upload it to any web host and the browser talks JMAP to Stalwart directly."
              />
            </p>
            <div className="bw-btns">
              <span className="ed-full-only">
                <EditionLink href="/docs" className="bw-btn">
                  Read the docs <ArrowRight size={16} {...ICON} />
                </EditionLink>
              </span>
              <span className="ed-lite-only">
                <EditionLink href="/docs/getting-started/lite" className="bw-btn">
                  Read the Lite guide <ArrowRight size={16} {...ICON} />
                </EditionLink>
              </span>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="bw-btn bw-btn-ghost">
                View source <ArrowUpRight size={16} {...ICON} />
              </a>
            </div>
          </div>
          <Shot
            name="inbox"
            alt="The Bulwark inbox with a message open in the reading pane"
            className="bw-hero-shot"
            sizes="(max-width: 900px) 120vw, 60vw"
            priority
          />
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
    { icon: Globe, title: `${langs} languages`, text: "Translated by the people who use it." },
    { icon: MapPin, title: "Built in the EU", text: "Runs on your hardware and stores nothing of its own." },
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
            text="Threaded conversations, a unified inbox, Sieve filters and S/MIME."
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
            text={
              <Ed
                full="Stalwart's file storage with previews, sharing and office editing."
                lite="Stalwart's file storage with previews, sharing and folder upload."
              />
            }
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Text-and-figure rows. The figure is always product UI.
// -----------------------------------------------------------------------------
type FeatureRowProps = {
  heading: string;
  text: React.ReactNode;
  link: { label: string; href: string };
  shot: { name: string; alt: string; pos?: string };
  /** Figure on the left, on the quiet surface band. */
  flip?: boolean;
};

function FeatureRow({ heading, text, link, shot, flip }: FeatureRowProps) {
  return (
    <section className={flip ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className={`bw-split bw-split-center ${flip ? "bw-split-7-5" : "bw-split-5-7"}`}>
          <div className={flip ? "bw-stack bw-order-last" : "bw-stack"}>
            <h2 className="bw-h2">{heading}</h2>
            <p className="bw-muted">{text}</p>
            <EditionLink href={link.href} className="bw-tlink">
              {link.label} <ArrowRight size={16} {...ICON} />
            </EditionLink>
          </div>
          <Shot name={shot.name} alt={shot.alt} pos={shot.pos} />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Editions
// -----------------------------------------------------------------------------

// Verified against scripts/lite/lib.mjs and the IS_LITE gates in the webmail
// checkout. If a row here can't be traced to one of those, take it out.
const EDITION_ROWS: [string, boolean | string, boolean | string][] = [
  ["Mail, calendar, contacts and files", true, true],
  ["Sign-in with a password", true, true],
  ["OAuth and single sign-on", true, false],
  ["Plugins and sidebar apps", true, false],
  ["Settings that follow you between devices", true, false],
  ["Admin console and setup wizard", true, false],
  ["Office document editing", true, false],
  ["Web push and the update notice", true, false],
  ["Runs on", "Docker or Node.js", "Any static web host"],
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
            <h2 className="bw-h2">Two editions from the same code.</h2>
            <p>
              Bulwark runs as a Node.js container with an admin console. Bulwark Lite is the same client exported as
              static files, for hosts that only serve HTML.
            </p>
            <EditionLink href="/docs/getting-started/editions" className="bw-tlink">
              Compare the editions <ArrowRight size={16} {...ICON} />
            </EditionLink>
            <EditionLink href="/choose" className="bw-tlink">
              Take the one-minute quiz <ArrowRight size={16} {...ICON} />
            </EditionLink>
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
// SECTION: Install - the field returns once. Three numbered steps per edition;
// the numbers are a real sequence.
// -----------------------------------------------------------------------------
function InstallSection() {
  return (
    <section id="install" className="bw-sec bw-field">
      <div className="bw-w">
        <div className="bw-split bw-split-5-7">
          <div className="bw-stack">
            <h2 className="bw-h2">
              <Ed full="Run Bulwark as one container." lite="Upload Bulwark Lite in three steps." />
            </h2>
            <p>
              <Ed
                full="Docker is the only requirement. There is nothing to clone and no config file to write first."
                lite="Lite is a folder of HTML, JavaScript and one JSON file. It runs on any host that serves static files, with one setting changed on the mail server."
              />
            </p>
            <EditionSwitch wide />
          </div>

          <div>
            <div className="ed-full-only">
              <ol className="bw-steps">
                <li>
                  <span className="bw-steps-n">1</span>
                  <div>
                    Run the container.
                    <CodeBlock
                      prompt
                      code="docker run -d -p 3000:3000 ghcr.io/bulwarkmail/webmail:latest"
                      label="Copy the command"
                    />
                  </div>
                </li>
                <li>
                  <span className="bw-steps-n">2</span>
                  <div>
                    Open <code className="bw-icode">http://localhost:3000</code>. The setup wizard finds your Stalwart
                    server and sets the admin password.
                  </div>
                </li>
                <li>
                  <span className="bw-steps-n">3</span>
                  <div>
                    Put your{" "}
                    <EditionLink href="/docs/deployment/docker/reverse-proxy" className="bw-link">
                      reverse proxy
                    </EditionLink>{" "}
                    in front. The docs have examples for Caddy, nginx and Traefik.
                  </div>
                </li>
              </ol>
            </div>
            <div className="ed-lite-only">
              <ol className="bw-steps">
                <li>
                  <span className="bw-steps-n">1</span>
                  <div>
                    Download <code className="bw-icode">bulwark-lite-&lt;version&gt;.zip</code> from the{" "}
                    <a
                      href={`${GITHUB}/releases/latest`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bw-link"
                    >
                      latest release
                    </a>{" "}
                    and unzip it.
                  </div>
                </li>
                <li>
                  <span className="bw-steps-n">2</span>
                  <div>
                    Set <code className="bw-icode">jmapServerUrl</code> in <code className="bw-icode">config.json</code>{" "}
                    to your Stalwart server.
                  </div>
                </li>
                <li>
                  <span className="bw-steps-n">3</span>
                  <div>
                    Upload the folder, and turn on the Permissive CORS policy in Stalwart&apos;s HTTP settings. The{" "}
                    <EditionLink href="/docs/deployment/static" className="bw-link">
                      static hosting
                    </EditionLink>{" "}
                    page has the steps and host snippets.
                  </div>
                </li>
              </ol>
            </div>
          </div>
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
            href="https://github.com/bulwarkmail/legacy-proxy"
            title="Bulwark Legacy Proxy"
            text="Lets a JMAP client read a classic IMAP account, with CardDAV and Sieve behind it."
          />
          <Tile
            href="https://github.com/bulwarkmail/native"
            title="Bulwark Mobile"
            text="Mail, calendar, contacts and files on Android. iOS follows."
          />
          <Tile
            href="https://github.com/bulwarkmail/relay"
            title="Bulwark Relay"
            text="Turns JMAP push into phone notifications and never sees message content."
          />
          <Tile
            href="https://extensions.bulwarkmail.org/"
            title="Bulwark Extensions"
            text="Reviewed plugins and themes, installed from a ZIP."
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: Open source - text and buttons left, sponsors as a compact list
// -----------------------------------------------------------------------------
function OpenSourceSection({ instances }: { instances: number }) {
  return (
    <section className="bw-sec bw-band">
      <div className="bw-w">
        <div className="bw-split bw-split-7-5">
          <div className="bw-stack">
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
          <div className="bw-tiles bw-tiles-1">
            <Tile compact href="https://rbm.systems" title="RBM Systems" text="rbm.systems" />
            <Tile compact href="https://lepthien.info/" title="Ingenieurbüro Lepthien" text="lepthien.info" />
            <Tile
              compact
              href="https://github.com/sponsors/bulwarkmail"
              title="Your organisation"
              text="Sponsor Bulwark on GitHub"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// SECTION: FAQ
// -----------------------------------------------------------------------------
type Faq = { q: string; a: React.ReactNode; edition?: Edition };

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
        <EditionLink href="/docs/deployment/updating/stalwart-1-0" className="bw-link">
          upgrade guide
        </EditionLink>
        .
      </>
    ),
  },
  {
    edition: "full",
    q: "What does deployment look like?",
    a: "One container next to Stalwart, behind the reverse proxy you already use. There are working examples for Caddy, Traefik and nginx, a compose file for the pair, and a standalone tarball on every release for installs without Docker.",
  },
  {
    edition: "lite",
    q: "What does deployment look like?",
    a: "A folder. Unzip the release, set the server URL in config.json, and upload it to whatever already serves your HTML: nginx, Caddy, Netlify, Cloudflare Pages, GitHub Pages or an S3 bucket. Updating means uploading the next zip over it.",
  },
  {
    edition: "lite",
    q: "Why does Lite need a CORS setting on the mail server?",
    a: "In Lite the browser talks to Stalwart directly, from your static host's origin, and browsers only allow that when the mail server says so. One setting in Stalwart allows it: the Permissive CORS policy, under Settings > Network > HTTP > Security in its web admin.",
  },
  {
    q: "Can I try it first?",
    a: "A demo runs at demo.bulwarkmail.org with a shared mailbox that resets every hour. The container also starts on your own machine in about ten minutes.",
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
              const editionClass =
                f.edition === "full" ? "ed-full-only" : f.edition === "lite" ? "ed-lite-only" : undefined;
              return (
                <details key={`${f.edition ?? "both"}-${f.q}`} className={editionClass} open={open}>
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

// The edition is client state, but a shared link carries it as ?edition=lite,
// and that is the one place the metadata API can see it: crawlers get the
// Lite card for Lite links and the Bulwark card otherwise.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string | string[] }>;
}): Promise<Metadata> {
  const { edition } = await searchParams;
  if (edition !== "lite") return {};
  const title = "Bulwark Lite - webmail for Stalwart, served as static files";
  const description =
    "Bulwark Lite is Bulwark Webmail exported as static files: upload a folder to any web host, point it at Stalwart, and the browser talks JMAP directly. No Node.js process.";
  return {
    title,
    description,
    openGraph: {
      title,
      description: "Bulwark Webmail exported as static files. Upload a folder and point config.json at Stalwart.",
      url: `https://bulwarkmail.org/?edition=lite`,
      images: [OG_IMAGES.lite],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Bulwark Webmail exported as static files. Upload a folder and point config.json at Stalwart.",
      images: [OG_IMAGES.lite.url],
    },
  };
}

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
        <FactsSection langs={langs ?? FALLBACK.langs} />
        <AppsSection />
        <FeatureRow
          heading="Mail opens as threads, with search across every folder."
          text="The server threads each conversation and a unified inbox covers every account. Sieve filters, templates and S/MIME are built in."
          link={{ label: "Mail features", href: "/docs/features/email" }}
          shot={{ name: "composer", alt: "The composer with a draft open over the inbox", pos: "100% 100%" }}
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
          text={
            <Ed
              full="Bulwark browses Stalwart's file storage with previews, sharing and folder upload. Office documents open for editing in the browser."
              lite="Bulwark Lite browses Stalwart's file storage with previews, sharing and folder upload."
            />
          }
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
