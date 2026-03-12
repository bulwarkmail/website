"use client";

import { motion } from "framer-motion";
import {
  Github,
  MessageSquare,
  BookOpen,
  Languages,
  Bug,
  GitPullRequest,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityCard {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  accent: string;
}

const cards: CommunityCard[] = [
  {
    icon: Github,
    title: "Star & Fork",
    description: "Browse the source, star the repo, and fork it to start contributing.",
    href: "https://github.com/root-fr/jmap-webmail",
    linkLabel: "View on GitHub",
    accent: "from-gray-500 to-gray-700",
  },
  {
    icon: Bug,
    title: "Report Issues",
    description: "Found a bug or have a feature request? Open an issue and help us improve.",
    href: "https://github.com/root-fr/jmap-webmail/issues",
    linkLabel: "Open an issue",
    accent: "from-red-500 to-rose-600",
  },
  {
    icon: GitPullRequest,
    title: "Pull Requests",
    description: "Submit PRs for bug fixes, features, or improvements. All contributions welcome.",
    href: "https://github.com/root-fr/jmap-webmail/pulls",
    linkLabel: "Submit a PR",
    accent: "from-emerald-500 to-green-600",
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    description: "Ask questions, share ideas, and connect with other self-hosters.",
    href: "https://github.com/root-fr/jmap-webmail/discussions",
    linkLabel: "Join discussions",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    icon: Languages,
    title: "Translate",
    description: "Help bring Bulwark to more languages. We currently support 8 — help us add more.",
    href: "https://github.com/root-fr/jmap-webmail/tree/main/messages",
    linkLabel: "Help translate",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Read the docs, learn about JMAP, and understand the architecture.",
    href: "https://github.com/root-fr/jmap-webmail#readme",
    linkLabel: "Read the docs",
    accent: "from-amber-500 to-orange-600",
  },
];

export function CommunitySection() {
  return (
    <section id="community" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Community
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            Built by the community
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Bulwark is open source and thrives on contributions. Here&apos;s how you can get involved.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                    card.accent
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {card.description}
                </p>
                <span className="text-xs font-medium text-primary group-hover:underline">
                  {card.linkLabel} &rarr;
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
