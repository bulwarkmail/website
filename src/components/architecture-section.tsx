"use client";

import { motion } from "framer-motion";
import { Monitor, Server, ArrowRight, Lock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const details = [
  {
    icon: Lock,
    title: "Auth Bootstrapping Only",
    description:
      "Next.js API routes handle credential encryption (AES-256-GCM), httpOnly cookie management, and OAuth 2.0 PKCE token exchange. After auth, the browser talks JMAP directly.",
  },
  {
    icon: Settings,
    title: "Zustand Stores",
    description:
      "Feature stores (email, calendar, contacts, sieve, etc.) are initialized conditionally based on server capabilities discovered via JMAP session.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
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
            JMAP-native architecture
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            No custom REST API between the browser and Stalwart. The JMAP protocol is the API — direct, standards-based, and efficient.
          </p>
        </motion.div>

        {/* Architecture diagram — 3 nodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {/* Browser */}
              <div className="flex flex-col items-center gap-2 min-w-[140px]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <Monitor className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Browser</p>
                  <p className="text-[11px] text-muted-foreground">React + Zustand</p>
                </div>
              </div>

              {/* Arrow with label */}
              <div className="flex flex-col items-center md:mx-6">
                <span className="text-[10px] font-medium text-primary mb-1 md:mb-1.5">JMAP (RFC 8620)</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground/40 rotate-90 md:rotate-0" />
                <span className="text-[10px] text-muted-foreground mt-1 md:mt-1.5">Direct connection</span>
              </div>

              {/* Mail Server */}
              <div className="flex flex-col items-center gap-2 min-w-[140px]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                  <Server className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">JMAP Server</p>
                  <p className="text-[11px] text-muted-foreground">Email, Calendar, Contacts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, i) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{detail.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {detail.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
