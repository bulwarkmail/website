import Link from "next/link";
import { BulwarkMark } from "@/components/bulwark-mark";

const COLUMNS: { h: string; links: { label: string; href: string }[] }[] = [
  {
    h: "Product",
    links: [
      { label: "Features", href: "https://github.com/bulwarkmail/webmail/blob/main/FEATURES.md" },
      { label: "Editions", href: "/docs/getting-started/editions" },
      { label: "Bulwark Lite", href: "/docs/getting-started/lite?edition=lite" },
      { label: "Changelog", href: "https://github.com/bulwarkmail/webmail/releases" },
    ],
  },
  {
    h: "Self-host",
    links: [
      { label: "Docker", href: "/docs/deployment/docker" },
      { label: "Compose", href: "/docs/deployment/docker/compose" },
      { label: "Reverse proxy", href: "/docs/deployment/docker/reverse-proxy" },
      { label: "Manual install", href: "/docs/deployment/manual" },
      { label: "Static hosting", href: "/docs/deployment/static?edition=lite" },
      { label: "Updating", href: "/docs/deployment/updating" },
    ],
  },
  {
    h: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/bulwarkmail" },
      { label: "Discord", href: "https://discord.com/invite/tYCujymGrT" },
      { label: "Contributing", href: "https://github.com/bulwarkmail/webmail/blob/main/CONTRIBUTING.md" },
      { label: "Brand and design", href: "/brand" },
      { label: "Press kit", href: "/press" },
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
              A JMAP webmail client for Stalwart Mail Server. Open source under AGPL-3.0 and built in the EU.
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
          <span>AGPL-3.0</span>
          <a href="mailto:dev@bulwarkmail.org">dev@bulwarkmail.org</a>
          <a href="https://stalw.art" target="_blank" rel="noopener noreferrer">
            Stalwart
          </a>
          <a href="https://jmap.io" target="_blank" rel="noopener noreferrer">
            JMAP
          </a>
        </div>
      </div>
    </footer>
  );
}
