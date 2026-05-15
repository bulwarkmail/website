"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sun, Moon, ArrowLeft, Menu, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { BulwarkMark } from "@/components/bulwark-mark";

export function DocsNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
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
          {/* Cell 1 - mark + wordmark + Docs */}
          <div className="flex items-center gap-3 pr-5 sm:pr-8 lg:pr-14 py-5 border-r border-[color:var(--rule)]">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("toggle-docs-sidebar"))}
              className="lg:hidden -ml-1 p-1 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="flex items-center gap-3"
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
            <span
              className="text-foreground/30 text-[19px] leading-none hidden sm:inline"
              style={{ fontFamily: "var(--font-source-serif), Georgia, serif", fontStyle: "italic" }}
              aria-hidden
            >
              /
            </span>
            <Link
              href="/docs"
              className="hidden sm:inline-flex text-[14px] font-medium text-foreground/85 hover:text-[color:var(--rasp)] transition-colors"
              style={{ fontFamily: "var(--font-exo2)" }}
            >
              Docs
            </Link>
          </div>

          {/* Cell 2 - middle (empty, takes the inner gap between rules) */}
          <div className="px-7" />

          {/* Cell 3 - github + back home + theme */}
          <div className="flex items-center justify-end gap-4 pl-5 sm:pl-8 lg:pl-14 border-l border-[color:var(--rule)]">
            <a
              href="https://github.com/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-jetbrains)" }}
              aria-label="GitHub"
            >
              <Star className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-exo2)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
