"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const screenshots = [
  {
    title: "Login",
    description: "OAuth2/OIDC & TOTP 2FA",
    image: "/screenshots/01-login.png",
  },
  {
    title: "Inbox",
    description: "Three-pane layout & threading",
    image: "/screenshots/02-inbox.png",
  },
  {
    title: "Email Viewer",
    description: "SPF/DKIM/DMARC badges",
    image: "/screenshots/03-email-viewer.png",
  },
  {
    title: "Compose",
    description: "Identity switching & templates",
    image: "/screenshots/04-compose.png",
  },
  {
    title: "Dark Mode",
    description: "System-aware theming",
    image: "/screenshots/05-dark-mode.png",
  },
  {
    title: "Settings",
    description: "Identities, filters & more",
    image: "/screenshots/06-settings.png",
  },
];

export function ScreenshotsSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="screenshots" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Screenshots
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-exo2)' }}>
            See it in action
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            A polished interface designed for productivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {screenshots.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={cn(
                "group relative rounded-md border overflow-hidden transition-all duration-200",
                i === active
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className={cn(
                "px-2 py-1.5 text-left border-t transition-colors",
                i === active
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border"
              )}>
                <div className={cn(
                  "text-[11px] font-medium leading-tight",
                  i === active ? "text-primary" : "text-foreground"
                )}>
                  {s.title}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 hidden md:block">
                  {s.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-md border border-border bg-card overflow-hidden shadow-sm"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={screenshots[active].image}
                alt={screenshots[active].title}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
