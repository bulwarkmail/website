"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
    title: "Calendar",
    description: "Month, week, day, and agenda views",
    image: "/screenshots/03-calendar.png",
  },
  {
    title: "Contacts",
    description: "Groups, autocomplete, and vCard sync",
    image: "/screenshots/04-contacts.png",
  },
  {
    title: "Files",
    description: "Cloud file browser with upload and preview",
    image: "/screenshots/05-files.png",
  },
  {
    title: "Settings",
    description: "Identities, filters & more",
    image: "/screenshots/06-settings.png",
  },
  {
    title: "Light Mode",
    description: "Theme-aware interface across the full app",
    image: "/screenshots/07-light-mode.png",
  },
];

export function ScreenshotsSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="screenshots" className="py-16 px-4 sm:px-6">
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
            See Bulwark webmail in action
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Mail, calendar, contacts, and file management — a complete webmail experience for Stalwart Mail Server.
          </p>
        </motion.div>

        <div className={cn(
          "flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4",
          "sm:pb-0 sm:grid sm:grid-cols-3 sm:mx-0 sm:px-0",
          "lg:grid-cols-7"
        )}>
          {screenshots.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={cn(
                "group relative rounded-md border overflow-hidden transition-all duration-200 shrink-0 w-28 sm:w-auto",
                i === active
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={s.image}
                  alt={s.title}
                  width={320}
                  height={180}
                  className="w-full h-full object-cover object-top"
                  sizes="(max-width: 640px) 112px, 160px"
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
            <div className="aspect-[16/9] overflow-hidden relative">
              <Image
                src={screenshots[active].image}
                alt={screenshots[active].title}
                width={1920}
                height={1080}
                className="w-full h-full object-cover object-top"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={active === 0}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
