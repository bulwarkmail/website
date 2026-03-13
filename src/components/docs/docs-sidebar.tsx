"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./docs-search";

interface SidebarHeading {
  text: string;
  id: string;
}

interface SidebarChild {
  title: string;
  slug: string;
  headings?: SidebarHeading[];
}

interface SidebarItem {
  title: string;
  slug: string;
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
  const isChildActive = hasChildren && item.children!.some((c) => pathname === `/docs/${c.slug}`);
  const hasHeadings = item.headings && item.headings.length > 0;
  const [expanded, setExpanded] = useState(true);
  const [headingsExpanded, setHeadingsExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive) setHeadingsExpanded(true);
  }, [isActive]);

  return (
    <li>
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
              key={child.slug}
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

  useEffect(() => {
    if (childActive) setHeadingsExpanded(true);
  }, [childActive]);

  return (
    <li>
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <nav className="space-y-6">
      <div className="px-1">
        <DocsSearch />
      </div>
      {sections.map((section) => (
        <div key={section.slug}>
          <h4 className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            {section.label}
          </h4>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <SidebarLink
                key={item.slug}
                item={item}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        aria-label="Toggle docs menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-background border-r border-border overflow-y-auto pt-20 pb-8 px-4">
            {sidebar}
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-8 pr-2">
        {sidebar}
      </aside>
    </>
  );
}
