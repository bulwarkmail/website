import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { BulwarkMark } from "@/components/bulwark-mark";

const SANS = "var(--font-exo2), system-ui, sans-serif";
const SERIF = "var(--font-source-serif), 'Source Serif 4', Georgia, serif";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const COLUMNS: { h: string; links: { label: string; href: string }[] }[] = [
  {
    h: "Product",
    links: [
      { label: "Features", href: "https://github.com/bulwarkmail/webmail/blob/main/FEATURES.md" },
      { label: "Screenshots", href: "#features" },
      { label: "Changelog", href: "https://github.com/bulwarkmail/webmail/releases" },
    ],
  },
  {
    h: "Self-host",
    links: [
      { label: "Docker", href: "/docs/deployment/docker/compose" },
      { label: "Compose", href: "/docs/deployment/docker/compose" },
      { label: "Reverse proxy", href: "/docs/deployment/docker/reverse-proxy" },
      { label: "Manual install", href: "/docs/deployment/manual" },
    ],
  },
  {
    h: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/bulwarkmail" },
      { label: "Contributing", href: "https://github.com/bulwarkmail/webmail/blob/main/CONTRIBUTING.md" },
      { label: "Branding", href: "/docs/branding/guidelines" },
    ],
  },
  {
    h: "Help",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "FAQ", href: "/#faq" },
      { label: "Issues", href: "https://github.com/bulwarkmail/webmail/issues" },
      { label: "Privacy", href: "/docs/legal/privacy" },
    ],
  },
];

const LEGAL: [string, string][] = [
  ["Privacy", "/docs/legal/privacy"],
];

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-2 -2 28 28"
      fill="currentColor"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.6-.719 1.384-.984 2a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.997-2 .077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.173 4.369a.07.07 0 0 0-.032.027C1.533 9.79.617 15.064 1.067 20.275a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.371-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.245.198.372.292a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-6.025-.838-11.255-3.548-15.879a.061.061 0 0 0-.031-.028zM8.02 17.103c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function EuFlag({ size = 22 }: { size?: number }) {
  const w = Math.round(size * 1.5);
  return (
    <Image
      src="/branding/eu-flag.svg"
      alt="Flag of Europe"
      width={w}
      height={size}
      style={{ flexShrink: 0, display: "block", borderRadius: 2 }}
      unoptimized
    />
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="ed-on-navy relative px-5 sm:px-8 lg:px-14 pt-16 sm:pt-20 pb-7"
      style={{ background: "var(--navy)" }}
    >
      {/* hairline accent - raspberry stub + rule */}
      <div
        className="absolute left-5 sm:left-8 lg:left-14 right-5 sm:right-8 lg:right-14 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, var(--rasp) 0, var(--rasp) 96px, var(--rule-navy) 96px, var(--rule-navy) 100%)",
        }}
      />

      <div className="mx-auto max-w-[1440px]">
        {/* TOP - brand block + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-14">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <BulwarkMark size={32} color="var(--rasp)" />
              <span
                className="leading-none"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 24,
                  letterSpacing: "-0.015em",
                  color: "var(--paper)",
                }}
              >
                Bulwark
              </span>
            </div>
            <p
              className="m-0 mb-6 max-w-[340px]"
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 17,
                lineHeight: 1.55,
                color: "var(--paper)",
              }}
            >
              A webmail built for the decade we&apos;re actually in. Modern protocol, modern tooling, your hardware.
            </p>

            {/* EU badge */}
            <div
              className="inline-flex items-center gap-3.5 px-4 py-3"
              style={{ border: "1px solid var(--rule-navy)", background: "rgba(255,255,255,.02)" }}
            >
              <EuFlag size={22} />
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--paper)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.1,
                }}
              >
                Built in the EU
              </span>
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.h}>
              <div
                className="ed-folio mb-4"
                style={{ color: "var(--rasp)", fontStyle: "normal", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: MONO, fontSize: 11, fontWeight: 600 }}
              >
                {c.h}
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="hover:text-[color:var(--rasp)] transition-colors"
                      style={{
                        color: "var(--paper)",
                        fontFamily: SANS,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM - legal left + external links right */}
        <div
          className="flex flex-wrap justify-between items-baseline gap-4 pt-5"
          style={{ borderTop: "1px solid var(--rule-navy)", paddingTop: 22 }}
        >
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="ed-folio" style={{ color: "var(--muted-navy)" }}>
              © {year} Bulwark Mail · AGPL-3.0
            </span>
            {LEGAL.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="hover:text-[color:var(--rasp)] transition-colors"
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--paper)",
                  textDecoration: "none",
                  letterSpacing: "-0.005em",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { label: "GitHub", href: "https://github.com/bulwarkmail", icon: <Github className="w-3.5 h-3.5" /> },
              { label: "Discord", href: "https://discord.com/invite/tYCujymGrT", icon: <DiscordIcon className="w-3.5 h-3.5" /> },
              { label: "bulwark@rbm.systems", href: "mailto:bulwark@rbm.systems", icon: <Mail className="w-3.5 h-3.5" /> },
              { label: "Stalwart", href: "https://stalw.art" },
              { label: "JMAP", href: "https://jmap.io" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 hover:text-[color:var(--rasp)] transition-colors"
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--paper)",
                  textDecoration: "none",
                }}
              >
                {l.icon}
                {l.label}
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
