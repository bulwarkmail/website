"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Lock,
  Puzzle,
  FolderSync,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "done" | "in-progress" | "planned";

interface RoadmapItem {
  icon: LucideIcon;
  title: string;
  description: string;
  status: Status;
  version?: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    icon: Sparkles,
    title: "Core Webmail",
    description:
      "Email, calendar, contacts, search, Sieve filters, identities, templates, and vacation responder.",
    status: "done",
    version: "v1.0",
  },
  {
    icon: Globe,
    title: "Internationalization",
    description:
      "Full i18n support with 8 languages: English, French, Japanese, Spanish, Italian, German, Dutch, and Portuguese.",
    status: "done",
    version: "v1.1",
  },
  {
    icon: Smartphone,
    title: "Progressive Web App",
    description:
      "Install-to-home-screen, offline caching, and push notifications for a native mobile experience.",
    status: "in-progress",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "PGP and S/MIME support for signing and encrypting emails with key management UI.",
    status: "planned",
  },
  {
    icon: FolderSync,
    title: "CalDAV / CardDAV Bridge",
    description:
      "Sync calendars and contacts with external apps like Thunderbird, Apple Calendar, and mobile devices.",
    status: "planned",
  },
  {
    icon: Puzzle,
    title: "Plugin API",
    description:
      "An extensibility layer for custom themes, toolbar actions, compose hooks, and third-party integrations.",
    status: "planned",
  },
];

const statusStyles: Record<Status, { label: string; dot: string; bg: string }> = {
  done: {
    label: "Released",
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  "in-progress": {
    label: "In Progress",
    dot: "bg-amber-500",
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  planned: {
    label: "Planned",
    dot: "bg-blue-500",
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Roadmap
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            What&apos;s coming next
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Active development with a clear path forward. Here&apos;s what we&apos;re working on.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-10">
            {roadmapItems.map((item, i) => {
              const style = statusStyles[item.status];
              const Icon = item.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={cn(
                    "relative flex items-start gap-6",
                    "md:gap-0",
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Dot on timeline */}
                  <div
                    className={cn(
                      "absolute left-6 md:left-1/2 w-3 h-3 rounded-full border-2 border-background -translate-x-1/2 mt-5 z-10",
                      style.dot
                    )}
                  />

                  {/* Spacer for mobile */}
                  <div className="w-12 shrink-0 md:hidden" />

                  {/* Card */}
                  <div
                    className={cn(
                      "flex-1 md:w-[calc(50%-2rem)]",
                      isLeft ? "md:pr-10" : "md:pl-10"
                    )}
                  >
                    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-sm font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                                style.bg
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                              {style.label}
                            </span>
                            {item.version && (
                              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {item.version}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invisible spacer for the other side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
