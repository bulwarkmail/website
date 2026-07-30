import Link from "next/link";
import { getDocSections } from "@/lib/docs";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  Compass,
  Container,
  Palette,
  Puzzle,
  Rocket,
  Scale,
  Server,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { InstallQuickstart } from "@/components/docs/install-quickstart";

export const metadata: Metadata = {
  title: "Documentation - Bulwark Webmail for Stalwart",
  description:
    "Documentation for Bulwark, the open-source JMAP webmail client for Stalwart Mail Server: installation, configuration, features, and Docker deployment.",
  alternates: {
    canonical: "/docs",
  },
};

const SANS = "var(--font-exo2), system-ui, sans-serif";
const SERIF = "var(--font-source-serif), Georgia, serif";

const STEPS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "01",
    title: "Run this command",
    body: (
      <>
        Docker is the only thing you need beforehand. There&apos;s nothing to clone and no{" "}
        <code className="font-mono text-[0.85em]">.env</code> file to write first. Paste it, press enter, and
        give it a few seconds to pull.
      </>
    ),
  },
  {
    n: "02",
    title: "Open localhost:3000",
    body: (
      <>
        From here the setup wizard takes over. It probes your JMAP server and works out whether to use OAuth
        or basic auth, generates a session secret, takes your logos if you have any, and finishes by setting
        the admin password. You won&apos;t need to edit a config file afterwards.
      </>
    ),
  },
  {
    n: "03",
    title: "Point it at a mail server",
    body: (
      <>
        Bulwark is the front; <Link href="/docs/getting-started/configuration/stalwart-setup" className="underline decoration-[color:var(--rasp)] underline-offset-2 hover:text-[color:var(--rasp)]">Stalwart</Link>{" "}
        is the server. If you don&apos;t have one yet, install Stalwart first and come back. The wizard handles the wiring.
      </>
    ),
  },
];

type PathOption = {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  "getting-started": Rocket,
  features: Sparkles,
  deployment: Server,
  guides: Compass,
  extensions: Puzzle,
  development: Code2,
  branding: Palette,
  legal: Scale,
};

const PATHS: PathOption[] = [
  {
    icon: Container,
    tag: "Recommended",
    title: "Docker",
    desc: "One command and one container, then a web wizard for everything else. Right for almost everyone.",
    href: "/docs/deployment/docker",
    cta: "Docker guide",
  },
  {
    icon: Terminal,
    tag: "Guided",
    title: "Install script",
    desc: "An interactive shell installer for hosts that already run Node. It asks you the same questions the wizard does.",
    href: "/docs/getting-started/installation",
    cta: "Run the script",
  },
  {
    icon: Server,
    tag: "Hands-on",
    title: "Manual install",
    desc: "Clone the repo and wire up the env file yourself. Takes the longest and leaves nothing hidden.",
    href: "/docs/deployment/manual",
    cta: "Manual install",
  },
];

export default function DocsPage() {
  const sections = getDocSections();

  return (
    <div className="max-w-[920px]">
      {/* Hero */}
      <div className="mb-10 sm:mb-12">
        <div className="ed-eyebrow mb-4">Documentation</div>
        <h1
          className="text-foreground"
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            margin: "0 0 1rem",
          }}
        >
          The{" "}
          <span style={{ color: "var(--rasp)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
            manual.
          </span>
        </h1>
        <p
          className="text-foreground/70"
          style={{
            fontFamily: SERIF,
            fontSize: "1.0625rem",
            lineHeight: 1.55,
            maxWidth: "640px",
          }}
        >
          The three steps below take you from nothing to a working inbox in about five minutes. Everything
          after them is reference: configuration, features, deployment, and the extension API.
        </p>
      </div>

      {/* Start here - 3-step quickstart */}
      <section className="mb-16 sm:mb-20" aria-labelledby="start-here">
        <details open className="group">
          <summary
            className="flex items-baseline justify-between gap-4 pb-3 border-b-2 border-foreground cursor-pointer list-none [&::-webkit-details-marker]:hidden"
          >
            <h2
              id="start-here"
              className="text-foreground"
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Start here.
            </h2>
            <ChevronRight
              aria-hidden
              className="w-5 h-5 text-foreground/60 transition-transform group-open:rotate-90 self-center"
            />
          </summary>

          <ol className="m-0 p-0 list-none">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[auto_1fr] gap-4 sm:gap-8 py-6 border-b border-[color:var(--rule)]"
            >
              <div
                aria-hidden
                className="text-[color:var(--rasp)]"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  minWidth: "2.5rem",
                }}
              >
                {step.n}
              </div>
              <div>
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    letterSpacing: "-0.01em",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-foreground/70 m-0"
                  style={{ fontFamily: SERIF, fontSize: "1rem", lineHeight: 1.55 }}
                >
                  {step.body}
                </p>
                {step.n === "01" ? (
                  <div className="mt-4">
                    <InstallQuickstart />
                  </div>
                ) : null}
                {step.n === "02" ? (
                  <p
                    className="mt-3 text-foreground/55"
                    style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "0.9375rem", margin: "0.75rem 0 0" }}
                  >
                    Stuck on the wizard? See{" "}
                    <Link href="/docs/getting-started/configuration" className="underline decoration-[color:var(--rasp)] underline-offset-2 hover:text-[color:var(--rasp)]">
                      configuration
                    </Link>{" "}
                    or{" "}
                    <Link href="/docs/getting-started/configuration/authentication" className="underline decoration-[color:var(--rasp)] underline-offset-2 hover:text-[color:var(--rasp)]">
                      authentication
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            </li>
          ))}
          </ol>
        </details>
      </section>

      {/* Pick a path */}
      <section className="mb-16 sm:mb-20" aria-labelledby="pick-a-path">
        <div className="flex items-baseline justify-between gap-4 pb-3 border-b-2 border-foreground">
          <h2
            id="pick-a-path"
            className="text-foreground"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Or pick a path.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[color:var(--rule)]">
          {PATHS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className={`group flex flex-col p-6 transition-colors hover:bg-[color:var(--alt-section)] border-b md:border-b-0 md:border-r border-[color:var(--rule)] ${idx === PATHS.length - 1 ? "md:border-r-0" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-[color:var(--rasp)]" />
                  <span className="ed-eyebrow">{p.tag}</span>
                </div>
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.015em",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-foreground/70 flex-1"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                    margin: "0 0 1rem",
                  }}
                >
                  {p.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-foreground group-hover:text-[color:var(--rasp)] transition-colors"
                  style={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem" }}
                >
                  {p.cta}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Full TOC */}
      <section aria-labelledby="full-manual">
        <div className="flex items-baseline justify-between gap-4 pb-3 border-b-2 border-foreground">
          <h2
            id="full-manual"
            className="text-foreground"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Browse the full manual.
          </h2>
        </div>

        <div>
          {sections.map((section) => {
            const SectionIcon = SECTION_ICONS[section.slug] ?? BookOpen;
            return (
            <div
              key={section.slug}
              className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-10 py-6 border-b border-[color:var(--rule)]"
            >
              <div className="flex items-start gap-2 lg:pt-1">
                <SectionIcon className="w-4 h-4 text-[color:var(--rasp)] shrink-0 mt-0.5" />
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {section.label}
                </h3>
              </div>
              <ul className="m-0 p-0 list-none">
                {section.items.map((item) => (
                  <li key={item.slug} className="border-b border-[color:var(--rule)] last:border-b-0">
                    <Link
                      href={`/docs/${item.slug}`}
                      className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-6 py-2.5 items-baseline"
                    >
                      <span
                        className="text-foreground group-hover:text-[color:var(--rasp)] transition-colors inline-flex items-center gap-2"
                        style={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.005em" }}
                      >
                        <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        {item.title}
                      </span>
                      {item.description ? (
                        <span
                          className="hidden sm:inline text-foreground/55 truncate"
                          style={{ fontFamily: SERIF, fontSize: "0.875rem", fontStyle: "italic", maxWidth: "320px" }}
                        >
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
