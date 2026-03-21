"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Paperclip,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Inbox,
  Send,
  FileText,
  PenSquare,
  Calendar,
  BookUser,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Tag,
  Printer,
  AlertCircle,
  Folder,
  FolderOpen,
  Plus,
  Phone,
  MapPin,
  Building2,
  ArrowLeft,
  Users,
  Pencil,
  Upload,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  MAIL DATA                                                          */
/* ================================================================== */

interface EmailData {
  id: number;
  sender: string;
  senderEmail: string;
  avatar: string;
  avatarColor: string;
  subject: string;
  preview: string;
  time: string;
  date: string;
  size: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  body: ReactNode;
  attachment?: { name: string; size: string };
}

interface MailboxNode {
  id: string;
  icon: typeof Inbox;
  label: string;
  unread?: number;
  total: number;
  children?: MailboxNode[];
}

const NAV_ITEMS = [
  { id: "mail", icon: Mail, label: "Mail" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "contacts", icon: BookUser, label: "Contacts" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const MAILBOX_TREE: MailboxNode[] = [
  {
    id: "inbox", icon: Inbox, label: "Inbox", total: 512, children: [
      { id: "newsletters", icon: Folder, label: "Newsletters", unread: 14, total: 203 },
      { id: "receipts", icon: Folder, label: "Receipts", total: 45 },
    ]
  },
  { id: "drafts", icon: FileText, label: "Drafts", total: 3 },
  { id: "sent", icon: Send, label: "Sent Items", total: 128 },
  { id: "junk", icon: AlertCircle, label: "Junk Mail", unread: 5, total: 37 },
  { id: "deleted", icon: Trash2, label: "Deleted Items", unread: 2, total: 9 },
  { id: "projects", icon: Folder, label: "Projects", total: 18 },
  { id: "clients", icon: Folder, label: "Clients", total: 42 },
  { id: "reports", icon: Folder, label: "Reports", total: 7 },
  { id: "trash", icon: Trash2, label: "Trash", total: 4 },
];

const TAGS = [
  { id: "red", dot: "bg-red-500", label: "Red" },
  { id: "orange", dot: "bg-orange-500", label: "Orange" },
  { id: "yellow", dot: "bg-yellow-500", label: "Yellow" },
  { id: "green", dot: "bg-green-500", label: "Green" },
  { id: "blue", dot: "bg-blue-500", label: "Blue" },
  { id: "purple", dot: "bg-purple-500", label: "Purple" },
  { id: "pink", dot: "bg-pink-500", label: "Pink" },
];

const EMAILS: EmailData[] = [
  {
    id: 1,
    sender: "Sarah Chen",
    senderEmail: "sarah@company.com",
    avatar: "SC",
    avatarColor: "bg-blue-500",
    subject: "Q4 Product Roadmap Review",
    preview: "Hi team, I've attached the updated roadmap for Q4. Please review the priorities and...",
    time: "10:32 AM",
    date: "Wed, Mar 11, 2026, 10:32 AM",
    size: "3.8 KB",
    unread: false,
    starred: true,
    hasAttachment: true,
    attachment: { name: "Q4-Roadmap.pdf", size: "2.4 MB" },
    body: (
      <>
        <p>Hi team,</p>
        <p>I&apos;ve attached the updated roadmap for Q4. Please review the priorities and let me know if you have any concerns about the timeline.</p>
        <p>Key highlights:</p>
        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
          <li>Calendar integration with drag-and-drop</li>
          <li>Email templates system launch</li>
          <li>Server-side Sieve filter builder</li>
          <li>Performance optimization sprint</li>
        </ul>
        <p className="text-muted-foreground">Best regards,<br />Sarah</p>
      </>
    ),
  },
  {
    id: 2,
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    avatar: "GH",
    avatarColor: "bg-gray-700",
    subject: "[webmail] New pull request #142",
    preview: "feat: Add calendar drag-and-drop rescheduling with snap to 15-minute intervals...",
    time: "9:15 AM",
    date: "Wed, Mar 11, 2026, 09:15 AM",
    size: "4.2 KB",
    unread: true,
    starred: false,
    hasAttachment: false,
    body: (
      <>
        <p><span className="font-semibold">@devops-bot</span> opened a new pull request:</p>
        <div className="rounded-md bg-muted/40 p-3 space-y-1.5">
          <p className="font-semibold">feat: Add calendar drag-and-drop rescheduling</p>
          <p>Adds the ability to reschedule calendar events via drag-and-drop with snap to 15-minute intervals. Includes undo support and optimistic UI updates.</p>
        </div>
        <p className="mt-1"><span className="font-semibold">Changes:</span> 12 files changed, +847 −203</p>
        <p><span className="font-semibold">Reviews:</span> 1 approval, 0 changes requested</p>
        <hr className="border-border/50 my-2" />
        <p className="text-[10px] text-muted-foreground">You are receiving this because you are subscribed to this repository.</p>
      </>
    ),
  },
  {
    id: 3,
    sender: "Alex Morgan",
    senderEmail: "alex.m@company.com",
    avatar: "AM",
    avatarColor: "bg-purple-500",
    subject: "Re: Weekly standup notes",
    preview: "Thanks for sharing. I think we should also discuss the migration timeline in the next...",
    time: "Yesterday",
    date: "Tue, Mar 10, 2026, 04:47 PM",
    size: "1.9 KB",
    unread: false,
    starred: false,
    hasAttachment: false,
    body: (
      <>
        <p>Thanks for sharing the notes!</p>
        <p>I think we should also discuss the migration timeline in the next meeting. The current estimate feels a bit tight given the scope of the JMAP integration work.</p>
        <p>A few things I&apos;d like to cover:</p>
        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
          <li>Database schema migration plan</li>
          <li>API versioning strategy</li>
          <li>Rollback procedures</li>
        </ul>
        <p className="text-muted-foreground">- Alex</p>
      </>
    ),
  },
  {
    id: 4,
    sender: "Stripe",
    senderEmail: "billing@stripe.com",
    avatar: "ST",
    avatarColor: "bg-indigo-500",
    subject: "Your invoice is ready",
    preview: "Invoice #2026-0312 for $49.00 has been generated. View your invoice and payment...",
    time: "Mon",
    date: "Mon, Mar 9, 2026, 08:00 AM",
    size: "5.1 KB",
    unread: false,
    starred: false,
    hasAttachment: true,
    attachment: { name: "Invoice-2026-0312.pdf", size: "156 KB" },
    body: (
      <>
        <p>Your invoice <span className="font-semibold">#2026-0312</span> for <span className="font-semibold">$49.00</span> has been generated.</p>
        <div className="rounded-md bg-muted/40 p-3 space-y-1.5 mt-1">
          <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">Pro</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span className="font-medium">Mar 1 – Mar 31, 2026</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">$49.00</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-emerald-500">Paid</span></div>
        </div>
        <hr className="border-border/50 my-2" />
        <p className="text-[10px] text-muted-foreground">This is an automated message from Stripe. Please do not reply.</p>
      </>
    ),
  },
  {
    id: 5,
    sender: "David Park",
    senderEmail: "david.p@company.com",
    avatar: "DP",
    avatarColor: "bg-amber-500",
    subject: "Design system updates",
    preview: "Hey, I've pushed the new component library changes. Can you check the button...",
    time: "Mar 7",
    date: "Fri, Mar 7, 2026, 02:30 PM",
    size: "2.1 KB",
    unread: false,
    starred: false,
    hasAttachment: false,
    body: (
      <>
        <p>Hey,</p>
        <p>I&apos;ve pushed the new component library changes. Can you check the button variants when you get a chance? I updated the hover states and added a new &quot;ghost&quot; variant.</p>
        <p>Also updated:</p>
        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
          <li>Input field focus ring colors</li>
          <li>Dialog overlay backdrop blur</li>
          <li>Toast notification animations</li>
        </ul>
        <p className="text-muted-foreground">Cheers,<br />David</p>
      </>
    ),
  },
];

/* ================================================================== */
/*  CALENDAR DATA                                                      */
/* ================================================================== */

const CALENDARS = [
  { id: "personal", label: "Personal", color: "bg-blue-500" },
  { id: "work", label: "Work", color: "bg-green-500" },
  { id: "team", label: "Team", color: "bg-purple-500" },
  { id: "holidays", label: "Holidays", color: "bg-orange-500" },
  { id: "birthdays", label: "Birthdays", color: "bg-amber-700" },
];

const MINI_CAL_WEEKS = [
  [23, 24, 25, 26, 27, 28, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, 1, 2, 3, 4, 5],
];

const CAL_EVENTS: Record<number, { label: string; dot: string; bar?: string }[]> = {
  8: [{ label: "Team Sync", dot: "bg-orange-500", bar: "bg-orange-600" }],
  9: [{ label: "Team Sync", dot: "bg-orange-500", bar: "bg-green-600" }],
  10: [{ label: "Sprint Retro", dot: "bg-green-500" }],
  12: [
    { label: "Daily Standup", dot: "bg-green-500" },
    { label: "1:1 Meeting", dot: "bg-green-500" },
    { label: "Code Review", dot: "bg-green-500" },
  ],
  13: [
    { label: "Sprint Planning", dot: "bg-green-500" },
    { label: "Language Class", dot: "bg-purple-500" },
  ],
  14: [
    { label: "Architecture Review", dot: "bg-green-500" },
    { label: "Customer Call", dot: "bg-green-500" },
    { label: "Coffee Chat", dot: "bg-purple-500" },
  ],
  15: [
    { label: "Deploy Window", dot: "bg-green-500" },
    { label: "Budget Review", dot: "bg-green-500" },
  ],
  16: [
    { label: "Retro & Demo", dot: "bg-blue-500" },
    { label: "Lunch & Learn", dot: "bg-blue-500" },
  ],
  17: [
    { label: "Brand Review", dot: "bg-green-500" },
    { label: "Team Social", dot: "bg-orange-500", bar: "bg-orange-600" },
  ],
  18: [
    { label: "Farmers Market", dot: "bg-blue-500" },
    { label: "Cycling", dot: "bg-blue-500" },
    { label: "Haircut", dot: "bg-blue-500" },
  ],
  19: [
    { label: "Dentist", dot: "bg-blue-500" },
    { label: "Team Meeting", dot: "bg-purple-500", bar: "bg-purple-600" },
  ],
  20: [{ label: "Team Offsite", dot: "bg-purple-500", bar: "bg-purple-600" }],
  21: [{ label: "Conference Prep", dot: "bg-green-500" }],
  24: [{ label: "Cooking Class", dot: "bg-blue-500" }],
  26: [{ label: "Lake Trip", dot: "bg-blue-500" }],
  27: [{ label: "Lake Trip", dot: "bg-blue-500" }],
  28: [{ label: "Lake Trip", dot: "bg-blue-500" }],
};

const DAYS_WITH_EVENTS = new Set(Object.keys(CAL_EVENTS).map(Number));

// Grid for March 2026 (Mon–Sun, first day = Sunday)
const CAL_GRID: { d: number; cur: boolean }[][] = [
  [{ d: 23, cur: false }, { d: 24, cur: false }, { d: 25, cur: false }, { d: 26, cur: false }, { d: 27, cur: false }, { d: 28, cur: false }, { d: 1, cur: true }],
  [{ d: 2, cur: true }, { d: 3, cur: true }, { d: 4, cur: true }, { d: 5, cur: true }, { d: 6, cur: true }, { d: 7, cur: true }, { d: 8, cur: true }],
  [{ d: 9, cur: true }, { d: 10, cur: true }, { d: 11, cur: true }, { d: 12, cur: true }, { d: 13, cur: true }, { d: 14, cur: true }, { d: 15, cur: true }],
  [{ d: 16, cur: true }, { d: 17, cur: true }, { d: 18, cur: true }, { d: 19, cur: true }, { d: 20, cur: true }, { d: 21, cur: true }, { d: 22, cur: true }],
  [{ d: 23, cur: true }, { d: 24, cur: true }, { d: 25, cur: true }, { d: 26, cur: true }, { d: 27, cur: true }, { d: 28, cur: true }, { d: 29, cur: true }],
  [{ d: 30, cur: true }, { d: 31, cur: true }, { d: 1, cur: false }, { d: 2, cur: false }, { d: 3, cur: false }, { d: 4, cur: false }, { d: 5, cur: false }],
];

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ================================================================== */
/*  CONTACTS DATA                                                      */
/* ================================================================== */

interface ContactData {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  organization?: string;
  address?: string;
  notes?: string;
}

const CONTACTS: ContactData[] = [
  { id: "ab", initials: "AB", color: "bg-blue-500", name: "Anna Baker", email: "anna@baker-consulting.example", company: "Baker Consulting", phone: "+1 555 123 4567", organization: "Baker Consulting", address: "New York, NY 10001", notes: "Frontend lead. Met at ReactConf 2025." },
  { id: "bc", initials: "BC", color: "bg-green-500", name: "Ben Carter", email: "ben@carter.example", company: "Carter Labs", phone: "+1 555 234 5678", organization: "Carter Labs", address: "San Francisco, CA 94102", notes: "Backend dev. Works on the API team." },
  { id: "cd", initials: "CD", color: "bg-pink-500", name: "Clara Davis", email: "clara@davis-design.example", company: "Davis Design Studio", phone: "+1 555 345 6789", organization: "Davis Design Studio" },
  { id: "ef", initials: "EF", color: "bg-blue-600", name: "Emily Foster", email: "emily@foster-systems.example", company: "Foster Systems Inc", phone: "+1 555 456 7890", organization: "Foster Systems Inc", address: "Austin, TX 78701", notes: "Project manager. Handles client integrations." },
  { id: "fg", initials: "FG", color: "bg-amber-500", name: "Frank Garcia", email: "frank@garcia.example", phone: "+1 555 567 8901" },
  { id: "hi", initials: "HI", color: "bg-green-600", name: "Helen Irving", email: "helen@irving-assoc.example", company: "Irving & Associates", phone: "+1 555 678 9012", organization: "Irving & Associates" },
  { id: "ij", initials: "IJ", color: "bg-purple-500", name: "Isabel Jensen", email: "isabel@jensen-univ.example", company: "Jensen University", organization: "Jensen University", notes: "Research professor. Collaborating on ML project." },
  { id: "jk", initials: "JK", color: "bg-red-500", name: "James Kelly", email: "james@kelly.example" },
  { id: "kd", initials: "KD", color: "bg-teal-500", name: "Karen Drake", email: "karen@drake.example", company: "Drake Logistics", organization: "Drake Logistics", phone: "+1 555 789 0123" },
];

/* ================================================================== */
/*  SETTINGS DATA                                                      */
/* ================================================================== */

const SETTINGS_CATEGORIES = [
  "Appearance",
  "Email Behavior",
  "Account",
  "Security",
  "Identities",
  "Vacation Responder",
  "Calendar",
  "Filters",
  "Templates",
  "Folders",
  "Keywords",
  "Advanced",
];

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */

export function MailHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---- shared ---- */
  const [activeNav, setActiveNav] = useState("mail");

  /* ---- mail state ---- */
  const [selectedMailbox, setSelectedMailbox] = useState("inbox");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["inbox"]));
  const [selectedEmailId, setSelectedEmailId] = useState(2);
  const [starredEmails, setStarredEmails] = useState<Set<number>>(new Set([1]));
  const [readEmails, setReadEmails] = useState<Set<number>>(new Set([1, 3, 4, 5]));
  const [hoveredEmail, setHoveredEmail] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  /* ---- calendar state ---- */
  const [calendarView, setCalendarView] = useState("Month");
  const [enabledCalendars, setEnabledCalendars] = useState<Set<string>>(
    new Set(CALENDARS.map((c) => c.id))
  );

  /* ---- contacts state ---- */
  const [selectedContactId, setSelectedContactId] = useState("ef");
  const [contactsTab, setContactsTab] = useState<"all" | "groups">("all");

  /* ---- settings state ---- */
  const [settingsCategory, setSettingsCategory] = useState("Appearance");
  const [settingsTheme, setSettingsTheme] = useState("System");
  const [settingsFontSize, setSettingsFontSize] = useState("Medium");
  const [settingsDensity, setSettingsDensity] = useState("Regular");
  const [settingsToolbar, setSettingsToolbar] = useState("Top");
  const [settingsAnimations, setSettingsAnimations] = useState(true);

  /* ---- derived ---- */
  const selectedEmail = EMAILS.find((e) => e.id === selectedEmailId)!;
  const selectedContact = CONTACTS.find((c) => c.id === selectedContactId);

  /* ---- handlers ---- */
  const handleSelectEmail = useCallback((id: number) => {
    setSelectedEmailId(id);
    setReadEmails((prev) => new Set(prev).add(id));
    setShowDetails(false);
  }, []);

  const toggleStar = useCallback((id: number) => {
    setStarredEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCalendar = useCallback((id: string) => {
    setEnabledCalendars((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* ---- mailbox tree renderer ---- */
  const renderMailboxItem = (node: MailboxNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedMailbox === node.id;
    const Icon = hasChildren && isExpanded ? FolderOpen : node.icon;

    return (
      <div key={node.id}>
        <div
          onClick={() => {
            setSelectedMailbox(node.id);
            if (hasChildren) toggleFolder(node.id);
          }}
          className={cn(
            "flex items-center gap-1.5 py-1 text-xs transition-colors cursor-pointer select-none px-2",
            isSelected
              ? "bg-primary text-primary-foreground font-medium"
              : "text-foreground hover:bg-muted"
          )}
          style={{ paddingLeft: hasChildren ? 8 : 8 + depth * 16 }}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown className="w-3 h-3 shrink-0 text-muted-foreground" />
            </motion.div>
          )}
          <Icon className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="truncate flex-1">{node.label}</span>
              <span className="flex items-center gap-1 shrink-0">
                {node.unread && node.unread > 0 && (
                  <span className="text-[9px] rounded-full px-1.5 py-0.5 font-bold bg-green-500 text-white min-w-[18px] text-center">
                    {node.unread}
                  </span>
                )}
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {node.total}
                </span>
              </span>
            </>
          )}
        </div>
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children!.map((child) => renderMailboxItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ================================================================ */
  /*  SUB-VIEW: MAIL                                                   */
  /* ================================================================ */

  const renderMailView = () => (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 0 : 192 }}
        transition={{ duration: 0.2 }}
        className="border-r border-border bg-secondary/30 flex flex-col shrink-0 overflow-hidden"
      >
        {/* User identity */}
        <div className="px-2.5 pt-2.5 pb-2 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="shrink-0 hover:text-foreground text-muted-foreground transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronsRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronsLeft className="w-3.5 h-3.5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">
                John Doe
              </p>
              <p className="text-[9px] text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Mailbox tree */}
        <nav className="flex-1 py-1 overflow-y-auto overflow-x-hidden">
          {MAILBOX_TREE.map((item) => renderMailboxItem(item))}
        </nav>

        {/* Tags section */}
        <div className="pb-2 pt-1 border-t border-border/50 shrink-0">
          <button
            onClick={() => setTagsOpen(!tagsOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium text-muted-foreground w-full hover:text-foreground transition-colors"
          >
            <motion.div
              animate={{ rotate: tagsOpen ? 0 : -90 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
            Tags
          </button>
          <AnimatePresence>
            {tagsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                {TAGS.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-6 py-0.5 text-xs text-foreground cursor-pointer hover:bg-muted transition-colors"
                  >
                    <span className={cn("w-2.5 h-2.5 rounded-full", tag.dot)} />
                    {tag.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compose button */}
        <div className="px-2.5 pb-2.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <PenSquare className="w-3.5 h-3.5" />
            Compose
          </motion.button>
        </div>
      </motion.div>

      {/* Email list */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        {/* Search bar */}
        <div className="px-2 py-2 border-b border-border flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-3.5 h-3.5 border-2 border-muted-foreground/40 rounded-sm" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 h-7 px-2 rounded-md bg-muted/50 border border-border/50 text-muted-foreground">
            <Search className="w-3 h-3" />
            <span className="text-[10px]">Search mail... (press /)</span>
          </div>
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {EMAILS.map((email) => {
            const isSelected = selectedEmailId === email.id;
            const isUnread = email.unread && !readEmails.has(email.id);
            const isStarred = starredEmails.has(email.id);

            return (
              <motion.div
                key={email.id}
                onClick={() => handleSelectEmail(email.id)}
                onHoverStart={() => setHoveredEmail(email.id)}
                onHoverEnd={() => setHoveredEmail(null)}
                className={cn(
                  "border-b border-border cursor-pointer transition-colors relative",
                  isSelected
                    ? "bg-blue-200 dark:bg-blue-900/50"
                    : isUnread
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-background",
                  hoveredEmail === email.id && !isSelected && "bg-muted"
                )}
              >
                <div className="flex items-start gap-2 px-3 py-2.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0 shadow-sm",
                      email.avatarColor
                    )}
                  >
                    {email.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        <span
                          className={cn(
                            "text-xs truncate",
                            isUnread
                              ? "font-bold text-foreground"
                              : "font-medium text-muted-foreground"
                          )}
                        >
                          {email.sender}
                        </span>
                        {isStarred && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                        {email.hasAttachment && (
                          <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] tabular-nums shrink-0",
                          isUnread
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {email.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate mb-0.5",
                        isUnread
                          ? "font-semibold text-foreground"
                          : "text-foreground/90"
                      )}
                    >
                      {email.subject}
                    </p>
                    <p className="text-[10px] truncate text-muted-foreground">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div className="flex items-center justify-center py-4">
            <span className="text-[10px] text-muted-foreground">
              No more emails to load
            </span>
          </div>
        </div>
      </div>

      {/* Email viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="px-3 py-1.5 border-b border-border flex items-center gap-0.5 shrink-0">
          {[
            { Icon: Reply, label: "Reply" },
            { Icon: ReplyAll, label: "Reply All" },
            { Icon: Forward, label: "Forward" },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{label}</span>
            </button>
          ))}
          <div className="flex-1" />
          {[Archive, Trash2, AlertCircle].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <button
            onClick={() => toggleStar(selectedEmailId)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              starredEmails.has(selectedEmailId)
                ? "text-amber-400 hover:text-amber-500"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            title="Star"
          >
            <Star
              className={cn(
                "w-3.5 h-3.5",
                starredEmails.has(selectedEmailId) && "fill-amber-400"
              )}
            />
          </button>
          {[Tag, Printer].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Email content - animated on switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEmailId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Subject + star */}
              <div className="flex items-start gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-sm flex-1">
                  {selectedEmail.subject}
                </h3>
                <button
                  onClick={() => toggleStar(selectedEmailId)}
                  className="shrink-0 mt-0.5 transition-colors"
                >
                  <Star
                    className={cn(
                      "w-4 h-4",
                      starredEmails.has(selectedEmailId)
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground hover:text-amber-400"
                    )}
                  />
                </button>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-3">
                <Clock className="w-3 h-3" />
                {selectedEmail.date}
              </div>

              {/* Sender block */}
              <div className="flex items-start gap-2.5 mb-3 pb-3 border-b border-border/50">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0",
                    selectedEmail.avatarColor
                  )}
                >
                  {selectedEmail.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-foreground">
                    {selectedEmail.sender}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedEmail.senderEmail}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    To: john@example.com
                  </p>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[10px] text-primary hover:underline mt-0.5 flex items-center gap-0.5"
                  >
                    <motion.div
                      animate={{ rotate: showDetails ? 0 : -90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown className="w-2.5 h-2.5" />
                    </motion.div>
                    {showDetails ? "Hide details" : "Show details"}
                  </button>
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden mt-1 space-y-0.5"
                      >
                        <p className="text-[10px] text-muted-foreground">
                          Reply-To: {selectedEmail.senderEmail}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Date: {selectedEmail.date}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Size: {selectedEmail.size}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground">
                    {selectedEmail.date}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedEmail.size}
                  </p>
                </div>
              </div>

              {/* Email body */}
              <div className="text-xs text-foreground/80 leading-relaxed space-y-2">
                {selectedEmail.body}
              </div>

              {/* Attachment */}
              {selectedEmail.attachment && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">
                      {selectedEmail.attachment.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedEmail.attachment.size}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick reply */}
            <div className="px-4 pb-3 shrink-0">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border bg-muted/30">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[8px] font-medium text-primary-foreground shrink-0">
                  JD
                </div>
                <span className="text-xs text-muted-foreground">
                  Write a quick reply...
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );

  /* ================================================================ */
  /*  SUB-VIEW: CALENDAR                                               */
  /* ================================================================ */

  const renderCalendarView = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Calendar top bar */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveNav("mail")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold text-foreground">March 2026</span>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button className="px-2.5 py-1 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors ml-1">
          Today
        </button>
        <div className="flex-1" />
        {/* View switcher */}
        <div className="flex rounded-md border border-border overflow-hidden">
          {["Month", "Week", "Day", "Agenda"].map((v) => (
            <button
              key={v}
              onClick={() => setCalendarView(v)}
              className={cn(
                "px-2 py-1 text-[10px] font-medium transition-colors",
                calendarView === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-1">
          <Upload className="w-3 h-3" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Create event
        </motion.button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Calendar sidebar */}
        <div className="w-44 border-r border-border bg-secondary/30 flex flex-col shrink-0 overflow-y-auto">
          {/* Mini calendar */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-medium text-foreground">
                March 2026
              </span>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {/* Mini cal header */}
            <div className="grid grid-cols-7 gap-0 mb-0.5">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div
                  key={d}
                  className="text-[8px] text-muted-foreground text-center font-medium py-0.5"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Mini cal weeks */}
            {MINI_CAL_WEEKS.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-0">
                {week.map((day, di) => {
                  const isCurrentMonth =
                    (wi === 0 && day <= 7) ||
                    (wi === 5 && day <= 5)
                      ? (wi === 0 ? day === 1 : false)
                      : true;
                  // Fix: row 0 days 23-28 are Feb, day 1 is Mar.
                  // row 5 days 1-5 are April, days 30-31 are March.
                  const isCur =
                    wi === 0
                      ? day <= 1
                      : wi === 5
                        ? day >= 30
                        : true;
                  const isToday = isCur && day === 12;
                  const hasEvent = isCur && DAYS_WITH_EVENTS.has(day);

                  return (
                    <div
                      key={`${wi}-${di}`}
                      className="flex flex-col items-center py-0.5 cursor-pointer"
                    >
                      <span
                        className={cn(
                          "text-[9px] w-4 h-4 flex items-center justify-center rounded-full",
                          isToday && "bg-primary text-primary-foreground font-bold",
                          !isCur && "text-muted-foreground/40",
                          isCur && !isToday && "text-foreground hover:bg-muted"
                        )}
                      >
                        {day}
                      </span>
                      {hasEvent && !isToday && (
                        <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Calendars list */}
          <div className="px-3 pt-2 pb-3 border-t border-border/50">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Calendars
            </p>
            {CALENDARS.map((cal) => (
              <label
                key={cal.id}
                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors"
              >
                <div
                  onClick={() => toggleCalendar(cal.id)}
                  className={cn(
                    "w-3 h-3 rounded-sm border-2 flex items-center justify-center transition-colors",
                    enabledCalendars.has(cal.id)
                      ? cn(cal.color, "border-transparent")
                      : "border-muted-foreground/40"
                  )}
                >
                  {enabledCalendars.has(cal.id) && (
                    <svg
                      className="w-2 h-2 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-foreground">{cal.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border shrink-0">
            {DAY_HEADERS.map((d, i) => (
              <div
                key={d}
                className={cn(
                  "text-[10px] font-medium text-center py-1.5 border-r border-border last:border-r-0",
                  i === 6 ? "text-red-400" : "text-muted-foreground"
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Week rows */}
          <div className="flex-1 overflow-y-auto">
            {CAL_GRID.map((week, wi) => (
              <div
                key={wi}
                className="grid grid-cols-7 border-b border-border"
                style={{ minHeight: 58 }}
              >
                {week.map((cell, di) => {
                  const isToday = cell.cur && cell.d === 12;
                  const events = cell.cur ? CAL_EVENTS[cell.d] || [] : [];
                  const visibleEvents = events.slice(0, 2);
                  const moreCount = events.length - 2;

                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={cn(
                        "border-r border-border last:border-r-0 px-0.5 pt-0.5 pb-1",
                        !cell.cur && "bg-muted/20"
                      )}
                    >
                      <div className="flex items-center justify-center mb-0.5">
                        <span
                          className={cn(
                            "text-[10px] w-5 h-5 flex items-center justify-center rounded-full",
                            isToday &&
                              "bg-primary text-primary-foreground font-bold",
                            !cell.cur && "text-muted-foreground/50",
                            cell.cur && !isToday && "text-foreground",
                            di === 6 && cell.cur && !isToday && "text-red-400"
                          )}
                        >
                          {cell.d}
                        </span>
                      </div>
                      {visibleEvents.map((ev, ei) =>
                        ev.bar ? (
                          <div
                            key={ei}
                            className={cn(
                              "text-[7px] text-white font-medium px-1 py-0.5 rounded-sm truncate mb-0.5",
                              ev.bar
                            )}
                          >
                            {ev.label}
                          </div>
                        ) : (
                          <div
                            key={ei}
                            className="flex items-center gap-0.5 px-0.5 mb-0.5 truncate"
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                ev.dot
                              )}
                            />
                            <span className="text-[7px] text-foreground truncate">
                              {ev.label}
                            </span>
                          </div>
                        )
                      )}
                      {moreCount > 0 && (
                        <p className="text-[7px] text-muted-foreground px-0.5">
                          +{moreCount} more
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  SUB-VIEW: CONTACTS                                               */
  /* ================================================================ */

  const renderContactsView = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Contacts top bar */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveNav("mail")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to mail
        </button>
        <div className="flex-1" />
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Upload className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Contact list sidebar */}
        <div className="w-56 border-r border-border flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-border shrink-0">
            <button
              onClick={() => setContactsTab("all")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2",
                contactsTab === "all"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <BookUser className="w-3.5 h-3.5" />
              All
            </button>
            <button
              onClick={() => setContactsTab("groups")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2",
                contactsTab === "groups"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Groups
            </button>
          </div>

          {/* Header + New Contact */}
          <div className="px-3 py-2 flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-foreground">
              Contacts
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-3 h-3" />
              New Contact
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-3 pb-2 shrink-0">
            <div className="flex items-center gap-1.5 h-7 px-2 rounded-md bg-muted/50 border border-border/50 text-muted-foreground">
              <Search className="w-3 h-3" />
              <span className="text-[10px]">Search contacts...</span>
            </div>
          </div>

          {/* Select all */}
          <div className="px-3 pb-1 shrink-0">
            <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
              <div className="w-3.5 h-3.5 border-2 border-muted-foreground/40 rounded-sm" />
              Select all
            </label>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {CONTACTS.map((c) => {
              const isSelected = selectedContactId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContactId(c.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="w-3.5 h-3.5 shrink-0" />
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-medium text-white shrink-0",
                      c.color
                    )}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs font-medium truncate",
                        isSelected
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {c.name}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] truncate",
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}
                    >
                      {c.email}
                    </p>
                    {c.company && (
                      <p
                        className={cn(
                          "text-[10px] truncate",
                          isSelected
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {c.company}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedContact && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedContact.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {/* Contact header */}
                <div className="px-6 py-4 flex items-center gap-4 border-b border-border">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white",
                      selectedContact.color
                    )}
                  >
                    {selectedContact.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                      {selectedContact.name}
                    </h3>
                    {selectedContact.company && (
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.company}
                      </p>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors">
                    <Pencil className="w-3 h-3" />
                    Edit Contact
                  </button>
                  <button className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-muted/50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contact fields */}
                <div className="px-6 py-4 grid grid-cols-3 gap-4">
                  {/* Email */}
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                      <Mail className="w-3 h-3" />
                      Email Addresses
                    </div>
                    <p className="text-xs text-foreground">
                      {selectedContact.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                      <Phone className="w-3 h-3" />
                      Phone Numbers
                    </div>
                    <p className="text-xs text-foreground">
                      {selectedContact.phone || "-"}
                    </p>
                  </div>

                  {/* Organization */}
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                      <Building2 className="w-3 h-3" />
                      Organizations
                    </div>
                    <p className="text-xs text-foreground">
                      {selectedContact.organization || "-"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                {selectedContact.address && (
                  <div className="px-6 pb-4">
                    <div className="rounded-md border border-border p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        Addresses
                      </div>
                      <p className="text-xs text-foreground">
                        {selectedContact.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedContact.notes && (
                  <div className="px-6 pb-4">
                    <div className="rounded-md border border-border p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                        <FileText className="w-3 h-3" />
                        Notes
                      </div>
                      <p className="text-xs text-foreground">
                        {selectedContact.notes}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  SUB-VIEW: SETTINGS                                               */
  /* ================================================================ */

  const renderSettingsView = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Settings top bar */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveNav("mail")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Mail
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Settings categories sidebar */}
        <div className="w-44 border-r border-border bg-secondary/30 py-2 overflow-y-auto shrink-0">
          {SETTINGS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSettingsCategory(cat)}
              className={cn(
                "w-full text-left px-4 py-1.5 text-xs transition-colors",
                settingsCategory === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={settingsCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Settings
                </h2>
              </div>

              <div className="max-w-lg rounded-md border border-border p-5 space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-0.5">
                    {settingsCategory}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-4">
                    {settingsCategory === "Appearance"
                      ? "Customize the look and feel of your webmail."
                      : `Configure ${settingsCategory.toLowerCase()} preferences.`}
                  </p>
                </div>

                {settingsCategory === "Appearance" && (
                  <>
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Theme
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Choose your preferred color scheme
                        </p>
                      </div>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        {["Light", "Dark", "System"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setSettingsTheme(t)}
                            className={cn(
                              "px-2.5 py-1 text-[10px] font-medium transition-colors",
                              settingsTheme === t
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Language
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                      <div className="px-2.5 py-1 rounded-md border border-border text-xs text-foreground flex items-center gap-1">
                        English
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Font Size
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Adjust text size for better readability
                        </p>
                      </div>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        {["Small", "Medium", "Large"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSettingsFontSize(s)}
                            className={cn(
                              "px-2.5 py-1 text-[10px] font-medium transition-colors",
                              settingsFontSize === s
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* List Density */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          List Density
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Control spacing in email lists
                        </p>
                      </div>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        {["Compact", "Regular", "Comfortable"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setSettingsDensity(d)}
                            className={cn(
                              "px-2 py-1 text-[10px] font-medium transition-colors",
                              settingsDensity === d
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toolbar Position */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Toolbar Position
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Where to show email action buttons
                        </p>
                      </div>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        {["Top", "Below subject"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setSettingsToolbar(p)}
                            className={cn(
                              "px-2.5 py-1 text-[10px] font-medium transition-colors",
                              settingsToolbar === p
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enable Animations */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Enable Animations
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Show smooth transitions and effects
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSettingsAnimations(!settingsAnimations)
                        }
                        className={cn(
                          "relative w-9 h-5 rounded-full transition-colors",
                          settingsAnimations
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        )}
                      >
                        <motion.div
                          animate={{ x: settingsAnimations ? 18 : 2 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  </>
                )}

                {settingsCategory !== "Appearance" && (
                  <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                    <Settings className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs">
                      {settingsCategory} settings panel
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto">
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
              <svg
                className="w-3 h-3 text-emerald-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              demo.bulwarkmail.org
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* Mail app */}
        <div className="rounded-b-md border border-border bg-card overflow-hidden shadow-2xl shadow-black/20">
          <div className="flex h-[480px]">
            {/* Navigation Rail */}
            <div className="w-11 border-r border-border bg-secondary/20 flex flex-col items-center py-2 shrink-0">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    "relative w-8 h-8 flex items-center justify-center rounded-md mb-1 transition-colors",
                    activeNav === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                  {/* Unread badge on mail icon */}
                  {item.id === "mail" && activeNav !== "mail" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[7px] font-bold text-white flex items-center justify-center">
                      10
                    </span>
                  )}
                </button>
              ))}

              <div className="flex-1" />

              {/* Push status indicator */}
              <div
                className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2"
                title="Push connected"
              />

              {/* Logout */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* View content */}
            <AnimatePresence mode="wait">
              {activeNav === "mail" && (
                <motion.div
                  key="mail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 min-w-0"
                >
                  {renderMailView()}
                </motion.div>
              )}
              {activeNav === "calendar" && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 min-w-0"
                >
                  {renderCalendarView()}
                </motion.div>
              )}
              {activeNav === "contacts" && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 min-w-0"
                >
                  {renderContactsView()}
                </motion.div>
              )}
              {activeNav === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 min-w-0"
                >
                  {renderSettingsView()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating notification */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-6 right-0 md:-right-4 z-10"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-card border border-border shadow-xl shadow-black/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-medium text-white">
              DP
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">New email</p>
              <p className="text-[10px] text-muted-foreground">
                Re: David Park - Design system updates
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
