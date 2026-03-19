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
  FolderOpen,
  Upload,
  Download,
  ArrowRight,
  Check,
  Inbox,
  Send,
  Star,
  Archive,
  UserCheck,
  Plane,
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
      "Read, compose, reply, reply-all, forward with threading, attachments, draft editing, embedded message/rfc822 unwrapping, virtual scrolling, color tags, archive modes, TNEF extraction, email export/import, and drag-and-drop organization.",
    accent: "text-[#DB2D54]",
    accentBg: "bg-[#DB2D54]",
    colSpan: "md:col-span-5 md:row-span-2",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "JMAP Calendar (RFC 8984) with month, week, day, agenda, and task list views. Create, update, and delete events with drag-and-drop rescheduling, resize, recurring rules, iTIP invitations with RSVP trust assessment, iCal/webcal subscriptions, shared calendar grouping, and double-click quick-create.",
    accent: "text-blue-600",
    accentBg: "bg-blue-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: Users,
    title: "Contacts & vCard",
    description:
      "Contact management with JMAP sync (RFC 9553/9610), vCard import/export, address book directories with drag-and-drop, groups, autocomplete in composer, duplicate detection, and bulk operations.",
    accent: "text-violet-600",
    accentBg: "bg-violet-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: FolderOpen,
    title: "Cloud File Browser",
    description:
      "JMAP FileNode storage with upload, download, preview, folder navigation, favorites, recent files, and bulk operations.",
    accent: "text-teal-600",
    accentBg: "bg-teal-600",
    colSpan: "md:col-span-4",
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
      "SPF/DKIM/DMARC indicators, external content blocking, DOMPurify sanitization, S/MIME certificate workflows, TOTP 2FA, OAuth2/OIDC with PKCE, and trusted senders.",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-600",
    colSpan: "md:col-span-4",
  },
  {
    icon: UserCheck,
    title: "Identity Management",
    description:
      "Multiple sender identities with per-identity signatures, server refresh after changes, sub-addressing (user+tag@domain.com), and identity badges.",
    accent: "text-rose-600",
    accentBg: "bg-rose-600",
    colSpan: "md:col-span-5",
  },
  {
    icon: Filter,
    title: "Sieve Email Filters",
    description:
      "Visual rule builder for server-side filtering (RFC 9661). Conditions, actions, raw Sieve editor with syntax validation, and drag reorder.",
    accent: "text-orange-600",
    accentBg: "bg-orange-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: FileText,
    title: "Email Templates",
    description:
      "Reusable templates with placeholder variables, organized by category. Template picker in compose toolbar with search and filter.",
    accent: "text-pink-600",
    accentBg: "bg-pink-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Plane,
    title: "Vacation Responder",
    description:
      "JMAP VacationResponse with date range scheduling. Settings tab for message configuration and sidebar indicator when active.",
    accent: "text-sky-600",
    accentBg: "bg-sky-600",
    colSpan: "md:col-span-3",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Full keyboard navigation for power users. Navigate, compose, archive, delete, star \u2014 all without reaching for the mouse.",
    accent: "text-indigo-600",
    accentBg: "bg-indigo-600",
    colSpan: "md:col-span-6",
  },
  {
    icon: Palette,
    title: "Themes & Branding",
    description:
      "System-aware theming with smooth transitions, always-light email rendering, custom favicon and logo support, sidebar apps, and responsive desktop/mobile layouts.",
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
    colSpan: "md:col-span-4",
  },
  {
    icon: Zap,
    title: "Easy Deployment",
    description:
      "Docker images on GHCR (amd64/arm64). Runtime env vars, configurable bind address via HOSTNAME, health checks, structured logging, and update checks on startup.",
    accent: "text-yellow-600",
    accentBg: "bg-yellow-600",
    colSpan: "md:col-span-5",
  },
];

/* ---------- mini interactive widgets for showcase cells ---------- */

function MiniInbox() {
  const [selected, setSelected] = useState(0);
  const [starred, setStarred] = useState<number[]>([]);
  const items = [
    { from: "Sarah C.", subject: "Q4 Roadmap", time: "2m", unread: true, tag: "Work" },
    { from: "GitHub", subject: "PR #847 merged", time: "15m", unread: true, tag: "" },
    { from: "Alex M.", subject: "Re: Standup", time: "1h", unread: false, tag: "" },
    { from: "Jira", subject: "PROJ-42 assigned", time: "2h", unread: true, tag: "Work" },
    { from: "Alice R.", subject: "Lunch tomorrow?", time: "3h", unread: false, tag: "" },
  ];
  return (
    <div className="mt-4 flex flex-col flex-1">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2">
        {["Inbox", "Sent", "Drafts"].map((tab, i) => (
          <span
            key={tab}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-sm font-medium",
              i === 0 ? "bg-[#DB2D54]/10 text-[#DB2D54]" : "text-muted-foreground hover:text-foreground cursor-pointer"
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      {/* Email list */}
      <div className="border border-border bg-card rounded overflow-hidden text-[11px] flex-1">
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
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={(e) => {
                e.stopPropagation();
                setStarred((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);
              }}
              className="shrink-0 cursor-pointer"
              aria-label={starred.includes(i) ? "Unstar email" : "Star email"}
            >
              <Star className={cn("w-3 h-3", starred.includes(i) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
            </motion.button>
            {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#DB2D54] shrink-0" />}
            {!item.unread && <span className="w-1.5 shrink-0" />}
            <span className={cn("truncate w-16", item.unread ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {item.from}
            </span>
            <span className="text-muted-foreground truncate flex-1">{item.subject}</span>
            {item.tag && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-500 font-medium shrink-0">{item.tag}</span>
            )}
            <span className="text-muted-foreground/60 shrink-0">{item.time}</span>
          </motion.div>
        ))}
      </div>
      {/* Quick compose bar */}
      <div className="flex items-center gap-2 mt-2 px-2 py-1.5 border border-border rounded-sm bg-muted/30">
        <Send className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground/60">Quick compose...</span>
      </div>
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
                dragConstraints={{ top: 0, bottom: 28 }}
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
        {revealed ? "Hide details" : "Show all checks â†’"}
      </motion.button>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-muted-foreground space-y-0.5 overflow-hidden"
          >
            <p>â€¢ OAuth2/OIDC with PKCE</p>
            <p>â€¢ AES-256-GCM encrypted cookies</p>
            <p>â€¢ CSP, X-Frame-Options headers</p>
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

function MiniContacts() {
  const [query, setQuery] = useState("");
  const contacts = [
    { name: "Sarah Chen", email: "sarah@acme.co", color: "bg-violet-500" },
    { name: "Alex Morgan", email: "alex.m@corp.io", color: "bg-blue-500" },
    { name: "Sam Wilson", email: "sam.w@dev.org", color: "bg-emerald-500" },
  ];
  const filtered = query
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      )
    : contacts;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-1.5 h-8 px-2 border border-border bg-card rounded-sm">
        <Users className="w-3 h-3 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts..."
          className="flex-1 text-[11px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="border border-border bg-card rounded overflow-hidden">
        {filtered.map((c, i) => (
          <motion.div
            key={c.email}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 px-2.5 py-2 border-b border-border/50 last:border-0 hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0",
                c.color
              )}
            >
              {c.name[0]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">{c.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground px-2.5 py-3 text-center">No contacts found</p>
        )}
      </div>
    </div>
  );
}

function MiniFilesBrowser() {
  const entries = [
    { name: "Brand Assets", meta: "Folder · 12 items", kind: "folder" },
    { name: "Q1-plan.pdf", meta: "PDF · 2.4 MB", kind: "file" },
    { name: "Launch Notes.md", meta: "Markdown · 18 KB", kind: "file" },
  ];
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded-sm bg-muted text-foreground">/Files</span>
          <span>/</span>
          <span>Projects</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="w-3 h-3" />
            Upload
          </button>
          <button className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-3 h-3" />
            Sync
          </button>
        </div>
      </div>
      <div className="border border-border bg-card rounded overflow-hidden">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.name}
            onClick={() => setSelected(index)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-2.5 py-2 border-b border-border/50 last:border-0 cursor-pointer transition-colors",
              selected === index ? "bg-teal-600/5" : "hover:bg-muted/60"
            )}
          >
            <span className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-sm",
              entry.kind === "folder" ? "bg-teal-600/10 text-teal-600" : "bg-muted text-muted-foreground"
            )}>
              {entry.kind === "folder" ? <FolderOpen className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-foreground truncate">{entry.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{entry.meta}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MiniNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New email from Sarah C.", time: "just now", visible: true },
    { id: 2, text: "PR #847 comment added", time: "2m ago", visible: true },
  ]);
  const [pulse, setPulse] = useState(true);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            {pulse && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <span className="text-[10px] font-semibold text-foreground">Live Updates</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setPulse(!pulse)}
          className={cn(
            "w-7 h-4 rounded-full flex items-center px-0.5 cursor-pointer transition-colors",
            pulse ? "bg-amber-500 justify-end" : "bg-muted justify-start"
          )}
          aria-label={pulse ? "Disable live updates" : "Enable live updates"}
        >
          <motion.div layout className="w-3 h-3 rounded-full bg-white shadow-sm" />
        </motion.button>
      </div>
      <div className="space-y-1">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-2 px-2 py-1.5 bg-muted/50 rounded-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-foreground truncate">{n.text}</p>
              <p className="text-[9px] text-muted-foreground">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MiniFilterBuilder() {
  const [rules, setRules] = useState([
    { id: 1, condition: "From contains", value: "newsletter", action: "Move to â†’ Promos" },
    { id: 2, condition: "Subject starts", value: "[JIRA]", action: "Label â†’ Work" },
    { id: 3, condition: "Has attachment", value: "> 5MB", action: "Star" },
  ]);
  const [activeRule, setActiveRule] = useState<number | null>(null);

  return (
    <div className="mt-4 border border-border bg-card rounded overflow-hidden">
      {rules.map((rule, i) => (
        <motion.div
          key={rule.id}
          onClick={() => setActiveRule(activeRule === rule.id ? null : rule.id)}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-2.5 py-2 border-b border-border/50 last:border-0 cursor-pointer transition-colors",
            activeRule === rule.id ? "bg-orange-500/5" : "hover:bg-muted/60"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-foreground">
              {rule.condition}: <span className="text-orange-600">{rule.value}</span>
            </span>
            <motion.span
              animate={{ rotate: activeRule === rule.id ? 90 : 0 }}
              className="text-muted-foreground"
            >
              <ArrowRight className="w-2.5 h-2.5" />
            </motion.span>
          </div>
          <AnimatePresence>
            {activeRule === rule.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowRight className="w-2 h-2 text-orange-500" />
                  {rule.action}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function MiniVacationToggle() {
  const [active, setActive] = useState(false);
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-foreground">Auto-reply</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(!active)}
          className={cn(
            "w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors",
            active ? "bg-sky-500 justify-end" : "bg-muted justify-start"
          )}
          aria-label={active ? "Disable auto-reply" : "Enable auto-reply"}
        >
          <motion.div layout className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
        </motion.button>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            <div className="border border-border bg-muted/30 rounded-sm px-2.5 py-2">
              <p className="text-[10px] text-muted-foreground italic">
                &quot;Hi! I&apos;m out of office until Jan 6. For urgent matters, reach out to team@acme.co&quot;
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3 text-sky-500" />
              <span>Dec 23 â€“ Jan 6</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniThemePreview() {
  const [dark, setDark] = useState(false);
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-foreground">{dark ? "Dark" : "Light"} mode</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDark(!dark)}
          className={cn(
            "w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors",
            dark ? "bg-violet-500 justify-end" : "bg-muted justify-start"
          )}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <motion.div layout className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
        </motion.button>
      </div>
      <motion.div
        animate={{
          backgroundColor: dark ? "#111" : "#fff",
          borderColor: dark ? "#333" : "#e2e8f0",
        }}
        transition={{ duration: 0.3 }}
        className="border rounded-sm p-2 overflow-hidden"
      >
        <div className="flex gap-1 mb-1.5">
          {["bg-[#DB2D54]", dark ? "bg-gray-700" : "bg-gray-200", dark ? "bg-gray-700" : "bg-gray-200"].map((c, i) => (
            <div key={i} className={cn("h-1 rounded-full", c, i === 0 ? "w-4" : "w-6")} />
          ))}
        </div>
        <div className="space-y-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ backgroundColor: dark ? "#222" : "#f1f5f9" }}
              className="h-3 rounded-sm"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MiniLanguagePicker() {
  const languages = [
    { code: "EN", label: "English", greeting: "Hello!" },
    { code: "FR", label: "FranÃ§ais", greeting: "Bonjour !" },
    { code: "JA", label: "æ-¥æœ¬èªž", greeting: "ã“ã‚“ã«ã¡ã¯ï¼" },
    { code: "ES", label: "EspaÃ±ol", greeting: "Â¡Hola!" },
    { code: "DE", label: "Deutsch", greeting: "Hallo!" },
  ];
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-1">
        {languages.map((lang, i) => (
          <motion.button
            key={lang.code}
            whileTap={{ scale: 0.93 }}
            onClick={() => setSelected(i)}
            className={cn(
              "px-2 py-1 text-[10px] font-semibold rounded-sm cursor-pointer transition-colors",
              selected === i
                ? "bg-teal-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-teal-500/10 hover:text-teal-600"
            )}
          >
            {lang.code}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] text-foreground font-medium"
        >
          {languages[selected].greeting}{" "}
          <span className="text-muted-foreground font-normal">- {languages[selected].label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MiniDockerTerminal() {
  const [running, setRunning] = useState(false);
  const lines = [
    "$ docker pull ghcr.io/bulwarkmail/webmail",
    "latest: Pulling from bulwarkmail/webmail",
    "Status: Downloaded âœ“",
    "$ docker run -p 8080:80 ghcr.io/bulwarkmail/webmail",
    "â–¸ Server ready on :8080",
  ];
  const [visibleLines, setVisibleLines] = useState(0);

  return (
    <div className="mt-4">
      <motion.div
        className="bg-[#0d1117] rounded-sm border border-[#30363d] overflow-hidden font-mono"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[#30363d]">
          <span className="w-2 h-2 rounded-full bg-[#f85149]" />
          <span className="w-2 h-2 rounded-full bg-[#d29922]" />
          <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
          <span className="text-[9px] text-[#8b949e] ml-1">terminal</span>
        </div>
        <div className="px-2.5 py-2 min-h-[60px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "text-[10px] leading-relaxed",
                line.startsWith("$") ? "text-[#3fb950]" : line.includes("âœ“") || line.includes("ready") ? "text-[#58a6ff]" : "text-[#8b949e]"
              )}
            >
              {line}
            </motion.p>
          ))}
          {visibleLines === 0 && (
            <p className="text-[10px] text-[#8b949e]">
              <span className="animate-pulse">â–Š</span>
            </p>
          )}
        </div>
      </motion.div>
      {visibleLines < lines.length && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            let count = visibleLines;
            const interval = setInterval(() => {
              count++;
              setVisibleLines(count);
              if (count >= lines.length) clearInterval(interval);
            }, 300);
          }}
          className="mt-2 text-[10px] text-yellow-600 font-medium hover:underline cursor-pointer"
        >
          {visibleLines === 0 ? "Run deploy â†’" : "Continue â†’"}
        </motion.button>
      )}
      {visibleLines >= lines.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-[10px] text-emerald-600 font-medium flex items-center gap-1"
        >
          <Check className="w-3 h-3" /> Deployed successfully
        </motion.p>
      )}
    </div>
  );
}

function MiniIdentitySwitcher() {
  const identities = [
    { name: "Personal", email: "alex@gmail.com", color: "bg-rose-500" },
    { name: "Work", email: "alex@acme.co", color: "bg-blue-500" },
    { name: "Open Source", email: "alex+oss@dev.io", color: "bg-emerald-500" },
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="mt-4 border border-border bg-card rounded overflow-hidden">
      {identities.map((id, i) => (
        <motion.div
          key={id.email}
          onClick={() => setActive(i)}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-2.5 py-2 cursor-pointer transition-colors border-b border-border/50 last:border-0",
            active === i ? "bg-rose-500/5" : "hover:bg-muted/60"
          )}
        >
          <span
            className={cn(
              "w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0",
              id.color
            )}
          >
            {id.name[0]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-foreground truncate">{id.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{id.email}</p>
          </div>
          {active === i && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0"
            >
              <Check className="w-2.5 h-2.5" />
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function MiniTemplatePicker() {
  const templates = [
    { name: "Welcome", category: "Onboarding", preview: "Hi {{name}}, welcome to..." },
    { name: "Follow-up", category: "Sales", preview: "Just checking in on..." },
    { name: "Thank you", category: "Support", preview: "Thanks for reaching out..." },
  ];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mt-4 space-y-1.5">
      {templates.map((t, i) => (
        <motion.div
          key={t.name}
          onClick={() => setSelected(selected === i ? null : i)}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-2.5 py-2 border border-border rounded-sm cursor-pointer transition-colors",
            selected === i ? "border-pink-300 bg-pink-500/5" : "hover:bg-muted/60"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground">{t.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-muted rounded-sm text-muted-foreground">{t.category}</span>
          </div>
          <AnimatePresence>
            {selected === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] text-muted-foreground mt-1 overflow-hidden italic"
              >
                {t.preview}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
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
    2: <MiniContacts />,
    3: <MiniFilesBrowser />,
    4: <MiniSearchBar />,
    5: <MiniNotifications />,
    6: <MiniSecurityBadges />,
    7: <MiniIdentitySwitcher />,
    8: <MiniFilterBuilder />,
    9: <MiniTemplatePicker />,
    10: <MiniVacationToggle />,
    11: <MiniKeyboard />,
    12: <MiniThemePreview />,
    13: <MiniLanguagePicker />,
    14: <MiniDockerTerminal />,
  };

  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6">
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
            <span className="text-muted-foreground font-normal">in a self-hosted webmail client.</span>
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
                  "group relative bg-card p-5 cursor-default transition-colors duration-200 overflow-hidden flex flex-col",
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

                <div className="flex items-start gap-3 mb-1 flex-1 flex-col">
                  <div className="flex items-start gap-3">
                    <feature.icon className={cn("w-4 h-4 mt-0.5 shrink-0 transition-colors", activeFeature === idx ? feature.accent : "text-muted-foreground")} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-[13px] leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-[12px] leading-relaxed mt-1.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {hasWidget && (
                    <div className="hidden md:flex flex-col flex-1 w-full">
                      {showcaseSlots[idx]}
                    </div>
                  )}
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
