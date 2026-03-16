"use client";

import Image from "next/image";
import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/branding/logo/Bulwark%20Logo%20Color.svg" alt="Bulwark" width={36} height={36} className="w-9 h-9" onContextMenu={(e) => { e.preventDefault(); window.location.href = '/docs/branding/guidelines'; }} />
            <span className="font-bold text-foreground tracking-tight text-[17px]" style={{ fontFamily: 'var(--font-exo2)' }}>
              Bulwark
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://stalw.art/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Stalwart
            </a>
            <a
              href="https://jmap.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              JMAP Protocol
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            AGPL-3.0 &copy; {new Date().getFullYear()} Bulwark
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" /> for Stalwart Mail Server
          </p>
        </div>
      </div>
    </footer>
  );
}
