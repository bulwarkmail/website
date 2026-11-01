import Link from "next/link";
import { BulwarkMark } from "@/components/bulwark-mark";
import { MadeInEuBadge } from "@/components/eu-badge";

const COLUMNS: { h: string; links: { label: string; href: string }[] }[] = [
  {
    h: "Bulwark for",
    links: [
      { label: "Organisations", href: "/organisations" },
      { label: "Small businesses", href: "/small-business" },
      { label: "Homelab", href: "/homelab" },
      { label: "Which way to run it?", href: "/choose" },
      { label: "Try the demo", href: "https://demo.bulwarkmail.org" },
    ],
  },
  {
    h: "Product",
    links: [
      { label: "All features", href: "/docs/features/overview" },
      { label: "Bulwark Lite", href: "/docs/getting-started/lite" },
      { label: "Security and updates", href: "/docs/deployment/security-updates" },
      { label: "Extensions", href: "https://extensions.bulwarkmail.org/" },
      { label: "Changelog", href: "https://github.com/bulwarkmail/webmail/releases" },
    ],
  },
  {
    h: "Self-host",
    links: [
      { label: "Docker", href: "/docs/deployment/docker" },
      { label: "Compose with Stalwart", href: "/docs/deployment/docker/compose" },
      { label: "Reverse proxy", href: "/docs/deployment/docker/reverse-proxy" },
      { label: "Static hosting", href: "/docs/deployment/static" },
      { label: "Install on Stalwart", href: "/docs/deployment/stalwart-app" },
      { label: "Requirements", href: "/docs/deployment/requirements" },
      { label: "Updating", href: "/docs/deployment/updating" },
    ],
  },
  {
    h: "Project",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "FAQ", href: "/#faq" },
      { label: "GitHub", href: "https://github.com/bulwarkmail" },
      { label: "Discord", href: "https://discord.com/invite/tYCujymGrT" },
      { label: "Sponsor", href: "https://github.com/sponsors/bulwarkmail" },
      { label: "Contributing", href: "/docs/development/contributing" },
      { label: "Brand and design", href: "/brand" },
      { label: "Press kit", href: "/press" },
      { label: "Privacy", href: "/docs/legal/privacy" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bw-foot">
      <div className="bw-w">
        <div className="bw-foot-in">
          <div className="bw-foot-brand">
            <Link href="/" className="bw-brandmark">
              <BulwarkMark size={24} />
              <span>Bulwark</span>
            </Link>
            <p>
              A JMAP webmail client for Stalwart Mail Server. Open source under AGPL-3.0.
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.h}>
              <h3>{c.h}</h3>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bw-foot-legal">
          <span>© {year} Bulwark Mail</span>
          <a href="mailto:dev@bulwarkmail.org">dev@bulwarkmail.org</a>
          <a href="https://stalw.art" target="_blank" rel="noopener noreferrer">
            Stalwart
          </a>
          <a href="https://jmap.io" target="_blank" rel="noopener noreferrer">
            JMAP
          </a>
          <span>Stalwart is a trademark of Stalwart Labs. Bulwark is an independent project.</span>
          <MadeInEuBadge />
        </div>
      </div>
    </footer>
  );
}
