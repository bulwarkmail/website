"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Support = "yes" | "no" | "partial";

interface Competitor {
  name: string;
  values: Support[];
}

const features = [
  "JMAP Native",
  "Self-Hosted",
  "Calendar",
  "Contacts",
  "Real-time Push",
  "Dark Mode",
  "i18n (8+ langs)",
  "Modern Stack",
  "Privacy First",
  "Docker Deploy",
  "Mobile App",
  "Plugin Ecosystem",
  "Offline Mode",
];

const competitors: Competitor[] = [
  {
    name: "Bulwark",
    values: ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "no"],
  },
  {
    name: "Roundcube",
    values: ["no", "yes", "partial", "yes", "no", "partial", "yes", "no", "yes", "yes", "no", "yes", "no"],
  },
  {
    name: "Rainloop",
    values: ["no", "yes", "no", "yes", "no", "yes", "yes", "no", "yes", "yes", "no", "partial", "no"],
  },
  {
    name: "SOGo",
    values: ["no", "yes", "yes", "yes", "no", "partial", "yes", "no", "yes", "yes", "yes", "no", "no"],
  },
  {
    name: "Gmail",
    values: ["no", "no", "yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "yes", "yes", "yes"],
  },
  {
    name: "Outlook",
    values: ["no", "no", "yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "yes", "yes", "yes"],
  },
];

function SupportIcon({ value }: { value: Support }) {
  if (value === "yes")
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500">
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    );
  if (value === "no")
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15 text-red-400">
        <X className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-500">
      <Minus className="w-3.5 h-3.5" strokeWidth={3} />
    </span>
  );
}

export function ComparisonSection() {
  return (
    <section id="compare" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Comparison
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            How Bulwark compares to other webmail clients
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            See how Bulwark stacks up against Roundcube, Snappymail, and hosted email providers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-x-auto rounded-xl border border-border bg-card"
        >
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 sm:py-4 px-3 sm:px-5 text-muted-foreground font-medium sticky left-0 bg-card z-10">
                  Feature
                </th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={cn(
                      "py-3 sm:py-4 px-2 sm:px-4 text-center font-semibold whitespace-nowrap text-xs sm:text-sm",
                      c.name === "Bulwark"
                        ? "text-primary bg-primary/[0.06] border-x border-t border-primary/20 rounded-t-lg"
                        : "text-foreground"
                    )}
                  >
                    {c.name === "Bulwark" && (
                      <span className="block text-[10px] font-medium text-primary/70 mb-0.5">★ This project</span>
                    )}
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={feature}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    i % 2 === 0 ? "bg-muted/20" : ""
                  )}
                >
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-foreground font-medium sticky left-0 bg-inherit z-10 whitespace-nowrap text-xs sm:text-sm">
                    {feature}
                  </td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={cn(
                        "py-2.5 sm:py-3 px-2 sm:px-4 text-center",
                        c.name === "Bulwark" && "bg-primary/[0.06] border-x border-primary/20"
                      )}
                    >
                      <span className="inline-flex justify-center">
                        <SupportIcon value={c.values[i]} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
