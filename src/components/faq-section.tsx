"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Does Bulwark work with non-Stalwart mail servers?",
    answer:
      "Bulwark communicates via the JMAP protocol (RFC 8620). Any mail server that implements JMAP should work. However, Stalwart is the primary tested backend and offers the best integration, including calendar and contacts support.",
  },
  {
    question: "Which JMAP RFCs are supported?",
    answer:
      "Bulwark supports RFC 8620 (JMAP Core), RFC 8621 (JMAP Mail), RFC 8984 (JMAP Calendars), RFC 9553/9610 (JMAP Contacts), and RFC 9661 for JMAP Sieve script management on compatible servers.",
  },
  {
    question: "Can I migrate from Roundcube or another webmail?",
    answer:
      "Bulwark reads directly from your JMAP-compatible mail server, so there's no webmail-to-webmail migration needed. As long as your emails, calendars, and contacts are on the server, Bulwark will display them. Just point it at your JMAP server URL and log in.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "The Docker image runs on amd64 and arm64 architectures. It requires minimal resources - around 128 MB of RAM is sufficient. For building from source, you need Node.js 18+ and npm.",
  },
  {
    question: "Is there a mobile app or PWA?",
    answer:
      "Bulwark is a responsive web application that works well on mobile browsers. A dedicated PWA mode is on the roadmap, which will enable install-to-home-screen and offline capabilities.",
  },
  {
    question: "How does Bulwark handle email security?",
    answer:
      "Emails are sanitized with DOMPurify before rendering. SPF, DKIM, and DMARC results are displayed as visual badges. External image loading is blocked by default to prevent tracking. Authentication supports TOTP 2FA and OAuth2/OIDC.",
  },
  {
    question: "Can I use multiple email accounts?",
    answer:
      "Yes. Bulwark supports up to 5 simultaneous email accounts with instant switching and per-account state preservation. Each account maintains its own JMAP session, and you can add, remove, or set a default account from the account switcher in the sidebar. Multiple sender identities with separate signatures and sub-addressing are also supported.",
  },
  {
    question: "Is Bulwark free to use?",
    answer:
      "Yes. Bulwark is open source under the AGPL v3 license. You can self-host, inspect, and modify it, and there are no premium tiers or paid features.",
  },
  {
    question: "Can I try Bulwark without a mail server?",
    answer:
      "Yes. Bulwark includes a built-in demo mode with fixture data for emails, calendars, contacts, files, filters, identities, and vacation responses. Run with the development configuration to explore the full interface without connecting to a real JMAP server.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            FAQ
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-exo2)" }}
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Everything you need to know about Bulwark.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
