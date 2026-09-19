"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BulwarkMark } from "@/components/bulwark-mark";
import { EditionSwitch } from "@/components/edition-switch";
import { EditionLink } from "@/components/edition-link";
import { ICON } from "@/lib/icon";

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Getting started", href: "/docs/getting-started/introduction" },
  { label: "Deployment", href: "/docs/deployment/docker" },
  { label: "Features", href: "/docs/features/email" },
  { label: "GitHub", href: "https://github.com/bulwarkmail/webmail" },
];

/**
 * The docs nav is the same field as the landing nav, and it stays at the top
 * while a long page scrolls. On a phone the page menu and the search live in
 * the bar below it (docs-sidebar.tsx).
 */
export function DocsNavbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dark = mounted && resolvedTheme === "dark";

  return (
    <header className="bw-field bw-docs-nav">
      <div className="bw-w bw-w-docs">
        <div className="bw-nav-in">
          <Link
            href="/"
            className="bw-brandmark"
            onContextMenu={(e) => {
              e.preventDefault();
              window.location.href = "/brand";
            }}
          >
            <BulwarkMark size={24} color="currentColor" />
            <span>Bulwark</span>
          </Link>

          <nav className="bw-nav-links" aria-label="Documentation">
            {links.map((link) => (
              <EditionLink key={link.href} href={link.href}>
                {link.label}
              </EditionLink>
            ))}
          </nav>

          <div className="bw-nav-r">
            <EditionSwitch />
            <button
              type="button"
              onClick={() => setTheme(dark ? "light" : "dark")}
              className="bw-iconbtn"
              aria-label="Switch between light and dark"
            >
              {dark ? <Sun size={16} {...ICON} /> : <Moon size={16} {...ICON} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
