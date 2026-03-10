"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const screenshots = [
  {
    title: "Login",
    description: "Clean, minimal authentication with OAuth2/OIDC support",
    gradient: "from-primary/5 via-transparent to-blue-500/5",
  },
  {
    title: "Inbox",
    description: "Three-pane layout with virtual scrolling and threaded conversations",
    gradient: "from-blue-500/5 via-transparent to-purple-500/5",
  },
  {
    title: "Email Viewer",
    description: "Rich HTML rendering with SPF/DKIM/DMARC badges and inline attachments",
    gradient: "from-purple-500/5 via-transparent to-emerald-500/5",
  },
  {
    title: "Compose",
    description: "Full-featured composer with identity switching and template support",
    gradient: "from-emerald-500/5 via-transparent to-amber-500/5",
  },
  {
    title: "Dark Mode",
    description: "System-aware theming with smooth transitions",
    gradient: "from-amber-500/5 via-transparent to-primary/5",
  },
  {
    title: "Settings",
    description: "Comprehensive settings with identities, filters, templates, and vacation responder",
    gradient: "from-cyan-500/5 via-transparent to-pink-500/5",
  },
];

export function ScreenshotsSection() {
  const [active, setActive] = useState(0);

  const next = () => setActive((i) => (i + 1) % screenshots.length);
  const prev = () => setActive((i) => (i - 1 + screenshots.length) % screenshots.length);

  return (
    <section id="screenshots" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Screenshots
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-exo2)' }}>
            See it in action
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            A polished interface designed for productivity — from login to compose.
          </p>
        </motion.div>

        <div className="relative">
          {/* Screenshot area */}
          <div className={cn("rounded-md border border-border overflow-hidden bg-gradient-to-br", screenshots[active].gradient)}>
            <div className="aspect-video flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-3xl mx-auto"
                >
                  <div className="rounded-md border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="px-3 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">
                          mail.example.com/{screenshots[active].title.toLowerCase().replace(" ", "-")}
                        </div>
                      </div>
                    </div>
                    {/* Content placeholder */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground/10 mb-2">
                          {screenshots[active].title}
                        </p>
                        <p className="text-sm text-muted-foreground/50">
                          Screenshot Preview
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-card/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-card/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {screenshots.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={cn(
                "px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-300",
                i === active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-muted-foreground mt-4 text-sm"
          >
            {screenshots[active].description}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
