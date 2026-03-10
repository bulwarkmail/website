"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Shield,
  Zap,
  Globe,
  Calendar,
  Users,
  Search,
  Bell,
  Keyboard,
  Palette,
  Filter,
  FileText,
  ArrowRight,
  Check,
  Inbox,
  Send,
  Star,
  Archive,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
  colSpan: string;
}

const features: Feature[] = [
  {
    icon: Mail,
    title: "Full Email Experience",
    description:
      "Read, compose, reply, forward with threading, attachments, drafts auto-save, and virtual scrolling for large mailboxes.",
    accent: "text-[#DB2D54]",
    accentBg: "bg-[#DB2D54]",
    colSpan: "md:col-span-5 md:row-span-2",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "Month, week, day, agenda views. Drag-and-drop, resize, recurring events, iTIP invitations with RSVP directly from email.",
    accent: "text-blue-600",
    accentBg: "bg-blue-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: Users,
    title: "Contacts & vCard",
    description:
      "Contact management with JMAP sync, vCard import/export, groups, autocomplete in composer, and duplicate detection.",
    accent: "text-violet-600",
    accentBg: "bg-violet-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "JMAP filter panel with search chips, cross-mailbox queries, and advanced filtering by sender, date, attachment and more.",
    accent: "text-cyan-600",
    accentBg: "bg-cyan-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: Bell,
    title: "Real-time Push",
    description:
      "JMAP EventSource for live updates. Instant unread counts, email arrival notifications, and connection status indicator.",
    accent: "text-amber-600",
    accentBg: "bg-amber-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "SPF/DKIM/DMARC indicators, external content blocking, DOMPurify sanitization, TOTP 2FA, and OAuth2/OIDC with PKCE.",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: Filter,
    title: "Sieve Email Filters",
    description:
      "Visual rule builder for server-side filtering. Conditions, actions, raw Sieve editor with syntax validation and drag reorder.",
    accent: "text-orange-600",
    accentBg: "bg-orange-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: FileText,
    title: "Email Templates",
    description:
      "Reusable templates with placeholder variables, organized by category. Template picker in compose toolbar with search.",
    accent: "text-pink-600",
    accentBg: "bg-pink-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Full keyboard navigation for power users. Navigate, compose, archive, delete, star — all without reaching for the mouse.",
    accent: "text-indigo-600",
    accentBg: "bg-indigo-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Palette,
    title: "Light & Dark Themes",
    description:
      "System-aware theming with smooth transitions. Three-pane layout with responsive design for desktop and mobile.",
    accent: "text-violet-600",
    accentBg: "bg-violet-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Globe,
    title: "8 Languages",
    description:
      "English, French, Japanese, Spanish, Italian, German, Dutch, Portuguese. Auto-detection with persistent preference.",
    accent: "text-teal-600",
    accentBg: "bg-teal-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Zap,
    title: "Easy Deployment",
    description:
      "Docker images on Docker Hub and GHCR (amd64/arm64). Runtime env vars, health check endpoint, structured logging.",
    accent: "text-yellow-600",
    accentBg: "bg-yellow-600",
    colSpan: "md:col-span-3",
  },
];

/* ---------- mini interactive widgets for showcase cells ---------- */

function MiniInbox() {
  const [selected, setSelected] = useState(0);
  const items = [
    { from: "Sarah C.", subject: "Q4 Roadmap", time: "2m", unread: true },
    { from: "GitHub", subject: "PR #847 merged", time: "15m", unread: true },
    { from: "Alex M.", subject: "Re: Standup", time: "1h", unread: false },
  ];
  return (
    <div className="mt-4 border border-border bg-card rounded overflow-hidden text-[11px]">
      {items.map((item, i) => (
        <motion.div
          key={i}
          onClick={() => setSelected(i)}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-2.5 py-2 cursor-pointer transition-colors border-b border-border/50 last:border-0",
            selected === i ? "bg-[#DB2D54]/5" : "hover:bg-muted/60"
          )}
        >
          {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#DB2D54] shrink-0" />}
          {!item.unread && <span className="w-1.5 shrink-0" />}
          <span className={cn("truncate flex-1", item.unread ? "font-semibold text-foreground" : "text-muted-foreground")}>
            {item.from}
          </span>
          <span className="text-muted-foreground truncate max-w-[80px]">{item.subject}</span>
          <span className="text-muted-foreground/60 shrink-0">{item.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const hours = ["9 AM", "10 AM", "11 AM", "12 PM"];
  const [dragged, setDragged] = useState(false);
  return (
    <div className="mt-4 border border-border bg-card rounded overflow-hidden text-[11px]">
      {hours.map((h, i) => (
        <div key={h} className="flex border-b border-border/50 last:border-0">
          <span className="w-12 py-2 px-2 text-muted-foreground/60 border-r border-border/50 shrink-0 text-[10px]">{h}</span>
          <div className="flex-1 py-1 px-1 min-h-[28px] relative">
            {i === 0 && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 56 }}
                dragElastic={0.1}
                onDragStart={() => setDragged(true)}
                onDragEnd={() => setTimeout(() => setDragged(false), 600)}
                whileHover={{ scale: 1.02 }}
                className="bg-blue-500 text-white rounded-sm px-1.5 py-0.5 text-[10px] font-medium cursor-grab active:cursor-grabbing select-none"
              >
                Team standup
              </motion.div>
            )}
            {i === 2 && (
              <div className="bg-emerald-500 text-white rounded-sm px-1.5 py-0.5 text-[10px] font-medium">
                Design review
              </div>
            )}
          </div>
        </div>
      ))}
      <AnimatePresence>
        {dragged && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-2 py-1 text-[10px] text-[#DB2D54] font-medium text-center bg-[#DB2D54]/5"
          >
            Drag to reschedule!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniSecurityBadges() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {["SPF", "DKIM", "DMARC"].map((badge, i) => (
          <motion.span
            key={badge}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <Check className="w-2.5 h-2.5" />
            {badge}
          </motion.span>
        ))}
      </div>
      <motion.button
        onClick={() => setRevealed(!revealed)}
        whileTap={{ scale: 0.97 }}
        className="text-[10px] text-[#DB2D54] font-medium hover:underline cursor-pointer"
      >
        {revealed ? "Hide details" : "Show all checks →"}
      </motion.button>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-muted-foreground space-y-0.5 overflow-hidden"
          >
            <p>• OAuth2/OIDC with PKCE</p>
            <p>• AES-256-GCM encrypted cookies</p>
            <p>• CSP, X-Frame-Options headers</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniKeyboard() {
  const shortcuts = [
    { keys: ["C"], action: "Compose" },
    { keys: ["E"], action: "Archive" },
    { keys: ["#"], action: "Delete" },
    { keys: ["S"], action: "Star" },
    { keys: ["/"], action: "Search" },
  ];
  const [pressed, setPressed] = useState<string | null>(null);
  return (
    <div className="mt-4 space-y-1">
      {shortcuts.map((s) => (
        <motion.div
          key={s.keys[0]}
          onHoverStart={() => setPressed(s.keys[0])}
          onHoverEnd={() => setPressed(null)}
          className={cn(
            "flex items-center justify-between px-2 py-1.5 rounded-sm transition-colors text-[11px]",
            pressed === s.keys[0] ? "bg-[#DB2D54]/5" : ""
          )}
        >
          <span className="text-muted-foreground">{s.action}</span>
          <kbd
            className={cn(
              "px-1.5 py-0.5 text-[10px] font-mono rounded-sm border transition-all",
              pressed === s.keys[0]
                ? "bg-[#DB2D54] text-white border-[#DB2D54] scale-110 shadow-sm"
                : "bg-muted border-border text-foreground"
            )}
          >
            {s.keys[0]}
          </kbd>
        </motion.div>
      ))}
    </div>
  );
}

function MiniSearchBar() {
  const [query, setQuery] = useState("");
  const chips = ["from:sarah", "has:attachment", "in:inbox"];
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-1.5 h-8 px-2 border border-border bg-card rounded-sm">
        <Search className="w-3 h-3 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emails..."
          className="flex-1 text-[11px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {chips.map((chip) => (
          <motion.button
            key={chip}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuery((q) => q ? `${q} ${chip}` : chip)}
            className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-sm hover:bg-[#DB2D54]/10 hover:text-[#DB2D54] transition-colors cursor-pointer"
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ---------- bento grid ---------- */

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  // Showcase features get interactive widgets
  const showcaseSlots: Record<number, React.ReactNode> = {
    0: <MiniInbox />,
    1: <MiniCalendar />,
    3: <MiniSearchBar />,
    5: <MiniSecurityBadges />,
    8: <MiniKeyboard />,
  };

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#DB2D54]/8 text-[#DB2D54] text-xs font-medium mb-4">
            <Zap className="w-3 h-3" />
            Feature-rich
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Everything you need
            <br />
            <span className="text-muted-foreground font-normal">in a webmail client.</span>
          </h2>
        </motion.div>

        {/* --- Bento layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-border">
          {features.map((feature, idx) => {
            const hasWidget = showcaseSlots[idx];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onHoverStart={() => setActiveFeature(idx)}
                className={cn(
                  "group relative bg-card p-5 cursor-default transition-colors duration-200 overflow-hidden",
                  feature.colSpan,
                  activeFeature === idx && "bg-muted/30"
                )}
              >
                {/* Hover indicator line */}
                <motion.div
                  className={cn("absolute top-0 left-0 right-0 h-[2px]", feature.accentBg)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeFeature === idx ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />

                <div className="flex items-start gap-3 mb-1">
                  <feature.icon className={cn("w-4 h-4 mt-0.5 shrink-0 transition-colors", activeFeature === idx ? feature.accent : "text-muted-foreground")} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-[13px] leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-[12px] leading-relaxed mt-1.5">
                      {feature.description}
                    </p>
                    {hasWidget && (
                      <div className="hidden md:block">
                        {showcaseSlots[idx]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom-right arrow on hover */}
                <motion.div
                  className="absolute bottom-3 right-4"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: activeFeature === idx ? 1 : 0, x: activeFeature === idx ? 0 : -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className={cn("w-3.5 h-3.5", feature.accent)} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
