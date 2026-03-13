"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function DocsNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-background border-b border-border/30"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/branding/logo/Bulwark%20Logo%20Color.svg" alt="Bulwark" className="w-7 h-7" onContextMenu={(e) => { e.preventDefault(); window.location.href = '/docs/branding/guidelines'; }} />
            <span
              className="font-bold text-foreground tracking-tight text-[15px]"
              style={{ fontFamily: "var(--font-exo2)" }}
            >
              Bulwark
            </span>
          </Link>
          <span className="text-border">/</span>
          <Link href="/docs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
