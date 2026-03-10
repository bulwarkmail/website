"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Clock,
  Check,
  ChevronRight,
  Search,
  Inbox,
  Send,
  FileText,
  AlertCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Inbox, label: "Inbox", count: 12, active: true },
  { icon: Star, label: "Starred", count: 3 },
  { icon: Send, label: "Sent" },
  { icon: FileText, label: "Drafts", count: 1 },
  { icon: Archive, label: "Archive" },
  { icon: AlertCircle, label: "Spam", count: 2 },
  { icon: Trash2, label: "Trash" },
];

const emails = [
  {
    id: 1,
    sender: "Sarah Chen",
    avatar: "SC",
    avatarColor: "bg-blue-500",
    subject: "Q4 Product Roadmap Review",
    preview: "Hi team, I've attached the updated roadmap for Q4. Please review the priorities and...",
    time: "2m ago",
    unread: true,
    starred: true,
    hasAttachment: true,
    tag: { label: "Work", color: "bg-primary" },
    selected: true,
  },
  {
    id: 2,
    sender: "GitHub",
    avatar: "GH",
    avatarColor: "bg-gray-700",
    subject: "[bulwark] New pull request #847",
    preview: "feat: Add calendar drag-and-drop rescheduling with snap to 15-minute intervals...",
    time: "15m ago",
    unread: true,
    starred: false,
    hasAttachment: false,
    tag: { label: "Dev", color: "bg-emerald-500" },
  },
  {
    id: 3,
    sender: "Alex Morgan",
    avatar: "AM",
    avatarColor: "bg-purple-500",
    subject: "Re: Weekly standup notes",
    preview: "Thanks for sharing. I think we should also discuss the migration timeline in the next...",
    time: "1h ago",
    unread: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: 4,
    sender: "Stripe",
    avatar: "ST",
    avatarColor: "bg-indigo-500",
    subject: "Your invoice is ready",
    preview: "Invoice #2024-0891 for $49.00 has been generated. View your invoice and payment...",
    time: "3h ago",
    unread: false,
    starred: true,
    hasAttachment: true,
  },
  {
    id: 5,
    sender: "David Park",
    avatar: "DP",
    avatarColor: "bg-amber-500",
    subject: "Design system updates",
    preview: "Hey, I've pushed the new component library changes. Can you check the button...",
    time: "5h ago",
    unread: false,
    starred: false,
    hasAttachment: false,
    tag: { label: "Design", color: "bg-pink-500" },
  },
];

export function MailHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEmail, setHoveredEmail] = useState<number | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto"
    >
      {/* Glow effect behind */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative">
        {/* Browser chrome */}
        <div className="rounded-t-md bg-card border border-border border-b-0 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-muted text-xs text-muted-foreground font-mono flex items-center gap-2 max-w-xs w-full justify-center">
              <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              demo.bulwarkmail.org
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* Mail app */}
        <div className="rounded-b-md border border-border bg-card overflow-hidden shadow-2xl shadow-black/20">
          <div className="flex h-[420px]">
            {/* Sidebar */}
            <div className="w-52 border-r border-border bg-secondary/30 flex flex-col shrink-0">
              {/* Compose button */}
              <div className="p-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Compose
                </motion.button>
              </div>

              {/* Search */}
              <div className="px-3 pb-2">
                <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-muted/50 border border-border/50 text-muted-foreground">
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-xs">Search mail...</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-2 space-y-0.5 overflow-hidden">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors cursor-default",
                      item.active
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.count && (
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          item.active ? "text-accent-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                ))}
              </nav>

              {/* Tags */}
              <div className="px-2 pb-3 pt-2 border-t border-border/50">
                <p className="px-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Labels
                </p>
                {[
                  { color: "bg-primary", label: "Work" },
                  { color: "bg-emerald-500", label: "Dev" },
                  { color: "bg-pink-500", label: "Design" },
                ].map((tag) => (
                  <div
                    key={tag.label}
                    className="flex items-center gap-2 px-2.5 py-1 text-xs text-muted-foreground cursor-default"
                  >
                    <span className={cn("w-2 h-2 rounded-full", tag.color)} />
                    {tag.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Email list */}
            <div className="w-72 border-r border-border flex flex-col shrink-0">
              <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Inbox</h2>
                <span className="text-xs text-muted-foreground">12 unread</span>
              </div>
              <div className="flex-1 overflow-hidden">
                {emails.map((email) => (
                  <motion.div
                    key={email.id}
                    onHoverStart={() => setHoveredEmail(email.id)}
                    onHoverEnd={() => setHoveredEmail(null)}
                    className={cn(
                      "px-3 py-2.5 border-b border-border/50 cursor-default transition-colors relative",
                      email.selected && "bg-accent/50",
                      hoveredEmail === email.id && !email.selected && "bg-muted/30"
                    )}
                  >
                    {email.unread && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0 mt-0.5",
                          email.avatarColor
                        )}
                      >
                        {email.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              "text-xs truncate",
                              email.unread ? "font-semibold text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {email.sender}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {email.hasAttachment && (
                              <Paperclip className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span className="text-[10px] text-muted-foreground">{email.time}</span>
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-xs truncate mt-0.5",
                            email.unread ? "font-medium text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {email.subject}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[10px] text-muted-foreground truncate flex-1">
                            {email.preview}
                          </p>
                          {email.starred && (
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                        </div>
                        {email.tag && (
                          <div className="mt-1">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-white",
                                email.tag.color
                              )}
                            >
                              <Tag className="w-2 h-2" />
                              {email.tag.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Email viewer */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div className="px-4 py-2 border-b border-border flex items-center gap-2">
                {[Reply, Forward, Archive, Trash2].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
                <div className="flex-1" />
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Email content */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      Q4 Product Roadmap Review
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-medium text-white">
                        SC
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground">
                          Sarah Chen
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">
                          &lt;sarah@company.com&gt;
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    2 minutes ago
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-1.5 mb-3">
                  {["SPF", "DKIM", "DMARC"].map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    >
                      <Check className="w-2.5 h-2.5" />
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Email body */}
                <div className="text-xs text-foreground/80 leading-relaxed space-y-2.5">
                  <p>Hi team,</p>
                  <p>
                    I&apos;ve attached the updated roadmap for Q4. Please review the
                    priorities and let me know if you have any concerns about the
                    timeline.
                  </p>
                  <p>Key highlights:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Calendar integration with drag-and-drop</li>
                    <li>Email templates system launch</li>
                    <li>Server-side Sieve filter builder</li>
                    <li>Performance optimization sprint</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Best regards,
                    <br />
                    Sarah
                  </p>
                </div>

                {/* Attachment */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-default">
                    <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">Q4-Roadmap.pdf</span>
                    <span className="text-[10px] text-muted-foreground">2.4 MB</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating notification */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-6 -right-4 z-10"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-card border border-border shadow-xl shadow-black/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-medium text-white">
              DP
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">New email</p>
              <p className="text-[10px] text-muted-foreground">
                David Park — Design system updates
              </p>
            </div>
          </div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="absolute -top-3 -left-3 z-10"
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-lg shadow-primary/30 animate-pulse-glow">
            <img src="/Bulwark-Icon.svg" alt="" className="w-3 h-3 brightness-0 invert" />
            Bulwark Push
          </div>
        </motion.div>
      </div>
    </div>
  );
}
