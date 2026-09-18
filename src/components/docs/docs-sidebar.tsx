"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { editionClass, groupEditionClass, type DocEdition } from "@/lib/editions";
import { DocsSearch } from "./docs-search";

interface SidebarHeading {
  text: string;
  id: string;
}

interface SidebarChild {
  title: string;
  slug: string;
  edition: DocEdition;
  headings?: SidebarHeading[];
}

interface SidebarItem {
  title: string;
  slug: string;
  edition: DocEdition;
  headings?: SidebarHeading[];
  children?: SidebarChild[];
}

interface SidebarSection {
  slug: string;
  label: string;
  items: SidebarItem[];
}

interface DocsSidebarProps {
  sections: SidebarSection[];
}

function SidebarLink({
  item,
  pathname,
  onNavigate,
}: {
  item: SidebarItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const href = `/docs/${item.slug}`;
  const isActive = pathname === href;
  const hasChildren = item.children && item.children.length > 0;
  const hasHeadings = item.headings && item.headings.length > 0;
  const [expanded, setExpanded] = useState(true);
  const [headingsExpanded, setHeadingsExpanded] = useState(isActive);
  // A parent is hidden only when it and every child belong to the other edition.
  const liClass = hasChildren
    ? groupEditionClass([item.edition, ...item.children!.map((c) => c.edition)])
    : editionClass(item.edition);

  return (
    <li className={liClass || undefined}>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors text-left",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <ChevronRight
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                expanded && "rotate-90",
                isActive && "text-primary"
              )}
            />
            <Link href={href} onClick={onNavigate} className="flex-1">
              {item.title}
            </Link>
          </button>
        ) : hasHeadings ? (
          <div
            className={cn(
              "flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors text-left",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <button
              onClick={() => setHeadingsExpanded(!headingsExpanded)}
              className="shrink-0"
              aria-label={headingsExpanded ? "Collapse sections" : "Expand sections"}
            >
              <ChevronRight
                className={cn(
                  "w-3 h-3 transition-transform duration-200",
                  headingsExpanded && "rotate-90"
                )}
              />
            </button>
            <Link href={href} onClick={onNavigate} className="flex-1">
              {item.title}
            </Link>
          </div>
        ) : (
          <Link
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors pl-8",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {item.title}
          </Link>
        )}
      </div>
      {hasHeadings && !hasChildren && headingsExpanded && (
        <ul className="mt-0.5 space-y-0.5">
          {item.headings!.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`${href}#${heading.id}`}
                onClick={onNavigate}
                className="block px-3 py-1 text-xs rounded-md transition-colors pl-12 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <ChildLink
              key={`${child.slug}:${pathname}`}
              child={child}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ChildLink({
  child,
  pathname,
  onNavigate,
}: {
  child: SidebarChild;
  pathname: string;
  onNavigate: () => void;
}) {
  const childHref = `/docs/${child.slug}`;
  const childActive = pathname === childHref;
  const hasHeadings = child.headings && child.headings.length > 0;
  const [headingsExpanded, setHeadingsExpanded] = useState(childActive);

  return (
    <li className={editionClass(child.edition) || undefined}>
      {hasHeadings ? (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors pl-8",
            childActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <button
            onClick={() => setHeadingsExpanded(!headingsExpanded)}
            className="shrink-0"
            aria-label={headingsExpanded ? "Collapse sections" : "Expand sections"}
          >
            <ChevronRight
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                headingsExpanded && "rotate-90"
              )}
            />
          </button>
          <Link href={childHref} onClick={onNavigate} className="flex-1">
            {child.title}
          </Link>
        </div>
      ) : (
        <Link
          href={childHref}
          onClick={onNavigate}
          className={cn(
            "block px-3 py-1.5 text-sm rounded-md transition-colors pl-10",
            childActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {child.title}
        </Link>
      )}
      {hasHeadings && headingsExpanded && (
        <ul className="mt-0.5 space-y-0.5">
          {child.headings!.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`${childHref}#${heading.id}`}
                onClick={onNavigate}
                className="block px-3 py-1 text-xs rounded-md transition-colors pl-14 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname();
  // The mobile drawer is "open for this pathname": a route change closes it
  // without an effect, because the new pathname no longer matches.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const mobileOpen = openFor === pathname;
  const close = useCallback(() => setOpenFor(null), []);

  const toggleSidebar = useCallback(() => {
    setOpenFor((prev) => (prev === pathname ? null : pathname));
  }, [pathname]);

  // Listen for navbar toggle event
  useEffect(() => {
    window.addEventListener("toggle-docs-sidebar", toggleSidebar);
    return () => window.removeEventListener("toggle-docs-sidebar", toggleSidebar);
  }, [toggleSidebar]);

  const sidebar = (
    <nav className="space-y-7">
      <div className="px-1">
        <DocsSearch />
      </div>
      {sections.map((section) => {
        const sectionClass = groupEditionClass(
          section.items.flatMap((i) => [i.edition, ...(i.children ?? []).map((c) => c.edition)])
        );
        return (
          <div key={section.slug} className={sectionClass || undefined}>
            <h4 className="ed-eyebrow px-3 mb-2.5">{section.label}</h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={`${item.slug}:${pathname}`}
                  item={item}
                  pathname={pathname}
                  onNavigate={close}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] bg-background border-r border-[color:var(--rule)] overflow-y-auto pt-[66px] pb-8 flex flex-col"
            >
              {/* Close header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-exo2)" }}>
                  Navigation
                </span>
                <button
                  onClick={close}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-4">{sidebar}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 py-10 sm:py-14 pr-4 border-r border-[color:var(--rule)]">
        {sidebar}
      </aside>
    </>
  );
}
