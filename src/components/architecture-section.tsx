"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Database, ArrowRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchNode {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  accent: string;
}

const nodes: ArchNode[] = [
  {
    icon: <Monitor className="w-6 h-6" />,
    label: "Browser",
    sublabel: "Any modern browser",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: (
      <svg viewBox="0 0 180 180" className="w-6 h-6" fill="none">
        <mask id="arch-m" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
        </mask>
        <g mask="url(#arch-m)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#arch-g1)" />
          <rect x="115" y="54" width="12" height="72" fill="url(#arch-g2)" />
        </g>
        <defs>
          <linearGradient id="arch-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-background)" />
            <stop offset="1" stopColor="var(--color-background)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arch-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-background)" />
            <stop offset="1" stopColor="var(--color-background)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Bulwark",
    sublabel: "Next.js 16 + React",
    accent: "from-primary to-primary/80",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    label: "JMAP Protocol",
    sublabel: "RFC 8620 / 8621",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: <Server className="w-6 h-6" />,
    label: "Stalwart",
    sublabel: "Mail Server",
    accent: "from-emerald-500 to-green-600",
  },
  {
    icon: <Database className="w-6 h-6" />,
    label: "Storage",
    sublabel: "Email, Calendar, Contacts",
    accent: "from-amber-500 to-orange-500",
  },
];

const flowDetails = [
  {
    title: "Client-Side Rendering",
    description: "Bulwark runs entirely in the browser. The Next.js app serves the UI, and all email operations happen via JMAP API calls directly from the client.",
  },
  {
    title: "JMAP — Not IMAP",
    description: "Unlike traditional webmail that bridges IMAP, Bulwark speaks JMAP natively. This means faster sync, real-time push via EventSource, and efficient delta updates.",
  },
  {
    title: "Zero Middleware",
    description: "No custom backend API sits between the browser and the mail server. Bulwark connects directly to JMAP endpoints, reducing latency and points of failure.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Architecture
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            A simple, modern architecture with no unnecessary layers.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            {/* Horizontal flow on desktop, vertical on mobile */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
              {nodes.map((node, i) => (
                <div key={node.label} className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
                  {/* Node */}
                  <div className="flex flex-col items-center gap-2 min-w-[120px]">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                        node.accent
                      )}
                    >
                      {node.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{node.label}</p>
                      <p className="text-[11px] text-muted-foreground">{node.sublabel}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  {i < nodes.length - 1 && (
                    <div className="flex items-center justify-center md:mx-4 py-1 md:py-0">
                      <ArrowRight className="w-5 h-5 text-muted-foreground/40 rotate-90 md:rotate-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flowDetails.map((detail, i) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-2">{detail.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {detail.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
