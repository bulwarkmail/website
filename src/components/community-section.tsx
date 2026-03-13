"use client";

import { motion } from "framer-motion";
import {
  Github,
  MessageSquare,
  Languages,
  Bug,
  GitPullRequest,
  ExternalLink,
} from "lucide-react";

const links = [
  {
    icon: Bug,
    label: "Report a bug",
    href: "https://github.com/bulwarkmail/webmail/issues",
  },
  {
    icon: GitPullRequest,
    label: "Submit a PR",
    href: "https://github.com/bulwarkmail/webmail/pulls",
  },
  {
    icon: MessageSquare,
    label: "Discussions",
    href: "https://github.com/bulwarkmail/webmail/discussions",
  },
  {
    icon: Languages,
    label: "Help translate (8 languages so far)",
    href: "https://github.com/bulwarkmail/webmail/tree/main/messages",
  },
];

export function CommunitySection() {
  return (
    <section id="community" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Community
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            Get involved
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Bulwark is MIT-licensed and developed in the open. Bug reports, translations, and code contributions all happen on GitHub.
          </p>
        </motion.div>

        {/* GitHub repo card */}
        <motion.a
          href="https://github.com/bulwarkmail/webmail"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors mb-6"
        >
          <Github className="w-8 h-8 text-foreground shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono text-muted-foreground">bulwarkmail /</span>
              <span className="text-sm font-mono font-semibold text-foreground">webmail</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              A modern webmail client built on the JMAP protocol
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.a>

        {/* Contribution links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border bg-card divide-y divide-border"
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
