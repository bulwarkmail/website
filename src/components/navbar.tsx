"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { ArrowRight, Menu, X, Sun, Moon, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { BulwarkMark } from "@/components/bulwark-mark";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Why now", href: "#mission" },
  { label: "Self-host", href: "#deploy" },
  { label: "Docs", href: "/docs" },
  { label: "Sponsor", href: "https://github.com/sponsors/bulwarkmail" },
];

type NavbarProps = {
  stars?: number | null;
};

function formatStars(stars: number | null | undefined): string {
  if (stars == null) return "Star";
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(stars);
}

export function Navbar({ stars }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl border-b border-[color:var(--rule)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px] grid grid-cols-[auto_1fr_auto] items-stretch">
          {/* Cell 1 - mark + wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 pr-5 sm:pr-8 lg:pr-14 py-5 border-r border-[color:var(--rule)]"
            onContextMenu={(e) => {
              e.preventDefault();
              window.location.href = "/docs/branding/guidelines";
            }}
          >
            <BulwarkMark size={26} color="var(--rasp)" />
            <span
              className="font-extrabold tracking-tight text-[19px] leading-none"
              style={{ fontFamily: "var(--font-exo2)" }}
            >
              Bulwark
            </span>
          </Link>

          {/* Cell 2 - primary nav (hidden on mobile, fills the gap) */}
          <nav className="hidden md:flex items-center gap-7 px-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-foreground/85 hover:text-[color:var(--rasp)] transition-colors"
                style={{ fontFamily: "var(--font-exo2)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cell 3 - right cluster: desktop actions OR mobile menu button */}
          <div className="flex items-center justify-end gap-4 pl-5 sm:pl-8 lg:pl-14 border-l border-[color:var(--rule)]">
          <a
            href="https://github.com/bulwarkmail/webmail"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{formatStars(stars)}</span>
          </a>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hidden md:inline-flex p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <a
            href="#deploy"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold bg-[color:var(--rasp)] text-white hover:bg-[#c12649] transition-colors"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            className="md:hidden p-2 text-foreground/80"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden bg-background border-t border-[color:var(--rule)]">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2.5 text-sm text-foreground/85 hover:text-[color:var(--rasp)]"
                style={{ fontFamily: "var(--font-exo2)" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[color:var(--rule)] my-2" />
            <div className="flex items-center justify-between gap-3 px-2 py-2">
              <button
                onClick={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                  setMobileOpen(false);
                }}
                className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" /> Dark
                  </>
                )}
              </button>
              <a
                href="#deploy"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[color:var(--rasp)] text-white"
                style={{ fontFamily: "var(--font-exo2)" }}
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
