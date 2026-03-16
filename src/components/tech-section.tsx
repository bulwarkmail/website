"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const techStack = [
  {
    name: "Next.js 16",
    description: "App Router with Turbopack",
    logo: (
      <svg viewBox="0 0 180 180" className="w-8 h-8" fill="none">
        <mask id="m" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
        </mask>
        <g mask="url(#m)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#g1)" />
          <rect x="115" y="54" width="12" height="72" fill="url(#g2)" />
        </g>
        <defs>
          <linearGradient id="g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-background)" />
            <stop offset="1" stopColor="var(--color-background)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-background)" />
            <stop offset="1" stopColor="var(--color-background)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    description: "Type-safe codebase",
    logo: (
      <div className="w-8 h-8 rounded bg-[#3178c6] flex items-center justify-center">
        <span className="text-white font-bold text-xs">TS</span>
      </div>
    ),
  },
  {
    name: "Tailwind CSS v4",
    description: "Utility-first styling",
    logo: (
      <svg viewBox="0 0 54 33" className="w-8 h-5" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          fill="#06b6d4"
        />
      </svg>
    ),
  },
  {
    name: "Zustand",
    description: "Lightweight state management",
    logo: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">🐻</span>
      </div>
    ),
  },
  {
    name: "JMAP Protocol",
    description: "RFC 8620 — native, not bridged",
    logo: (
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-[10px]">JMAP</span>
      </div>
    ),
  },
  {
    name: "next-intl",
    description: "Internationalization for 8 languages",
    logo: (
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">i18n</span>
      </div>
    ),
  },
  {
    name: "DOMPurify",
    description: "HTML sanitization for email safety",
    logo: (
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Lucide Icons",
    description: "Beautiful, consistent iconography",
    logo: (
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
    ),
  },
  {
    name: "date-fns",
    description: "Modern date utility library",
    logo: (
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
    ),
  },
];

export function TechSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="tech" className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Under the hood
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight" style={{ fontFamily: 'var(--font-exo2)' }}>
            Built on JMAP &amp; Next.js
            <br />
            <span className="text-muted-foreground font-normal">zero compromises.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border rounded-md overflow-hidden">
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              onHoverStart={() => setHovered(idx)}
              onHoverEnd={() => setHovered(null)}
              className={cn(
                "flex items-center gap-4 p-6 bg-card cursor-default transition-colors duration-200",
                hovered === idx && "bg-muted/30"
              )}
            >
              <motion.div
                className="shrink-0"
                animate={{
                  scale: hovered === idx ? 1.15 : 1,
                  rotate: hovered === idx ? 5 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {tech.logo}
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{tech.name}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
