"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Menu, X, Sun, Moon } from "@/components/icons";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { BulwarkMark } from "@/components/bulwark-mark";
import { EditionSwitch } from "@/components/edition-switch";
import { EditionLink } from "@/components/edition-link";
import { ICON } from "@/lib/icon";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Install", href: "/#install" },
  { label: "Docs", href: "/docs" },
  { label: "Extensions", href: "https://extensions.bulwarkmail.org/" },
  { label: "Sponsor", href: "https://github.com/sponsors/bulwarkmail" },
];

/**
 * The nav sits on the field, together with the hero below it. It is not
 * sticky and has no scroll state. Every control in it is 36px high.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dark = mounted && resolvedTheme === "dark";

  return (
    <header className="bw-field">
      <div className="bw-w">
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

          <nav className="bw-nav-links" aria-label="Main">
            {navLinks.map((link) => (
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
            <EditionLink href="/#install" className="bw-btn bw-btn-sm">
              Get started
              <ArrowRight size={16} {...ICON} />
            </EditionLink>
            <button
              type="button"
              className="bw-iconbtn bw-nav-phone"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close the menu" : "Open the menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} {...ICON} /> : <Menu size={20} {...ICON} />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="bw-nav-menu bw-nav-phone" aria-label="Main">
            {navLinks.map((link) => (
              <EditionLink key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </EditionLink>
            ))}
            <EditionLink href="/#install" className="bw-btn" onClick={() => setMobileOpen(false)}>
              Get started
              <ArrowRight size={16} {...ICON} />
            </EditionLink>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
