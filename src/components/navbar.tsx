"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "Deploy", href: "#deploy" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: "/docs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <img src="/branding/logo/Bulwark%20Logo%20Color.svg" alt="Bulwark" className="w-9 h-9" onContextMenu={(e) => { e.preventDefault(); window.location.href = '/docs/branding/guidelines'; }} />
          <span className="font-bold text-foreground tracking-tight text-[17px]" style={{ fontFamily: 'var(--font-exo2)' }}>
            Bulwark
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-5 bg-border/60 mx-2" />
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <a
            href="https://github.com/bulwarkmail/webmail"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-3 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-border/60 my-1.5" />
              <div className="flex items-center gap-2 px-3 py-1.5">
                <button
                  onClick={() => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); setMobileOpen(false); }}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <a
                  href="https://github.com/bulwarkmail/webmail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
