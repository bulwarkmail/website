"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, Search, X } from "@/components/icons";
import { ICON } from "@/lib/icon";
import { DocsSearch, OPEN_SEARCH_EVENT } from "./docs-search";

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

/** One page in the sidebar, with an optional list of its headings underneath. */
function PageLink({
  page,
  pathname,
  child,
  onNavigate,
}: {
  page: SidebarChild;
  pathname: string;
  child?: boolean;
  onNavigate: () => void;
}) {
  const href = `/docs/${page.slug}`;
  const active = pathname === href;
  const hasHeadings = !!page.headings && page.headings.length > 0;
  const [headingsOpen, setHeadingsOpen] = useState(active);

  return (
    <>
      <div className={child ? "bw-side-item bw-side-child" : "bw-side-item"} data-active={active}>
        <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}>
          {page.title}
        </Link>
        {hasHeadings ? (
          <button
            type="button"
            onClick={() => setHeadingsOpen(!headingsOpen)}
            aria-label={headingsOpen ? `Hide the sections of ${page.title}` : `Show the sections of ${page.title}`}
            aria-expanded={headingsOpen}
          >
            {headingsOpen ? <ChevronDown size={16} {...ICON} /> : <ChevronRight size={16} {...ICON} />}
          </button>
        ) : null}
      </div>
      {hasHeadings && headingsOpen ? (
        <ul>
          {page.headings!.map((heading) => (
            <li key={heading.id}>
              <Link href={`${href}#${heading.id}`} onClick={onNavigate} className="bw-side-heading">
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function SidebarEntry({ item, pathname, onNavigate }: { item: SidebarItem; pathname: string; onNavigate: () => void }) {
  const hasChildren = !!item.children && item.children.length > 0;
  return (
    <li>
      <PageLink page={hasChildren ? { ...item, headings: undefined } : item} pathname={pathname} onNavigate={onNavigate} />
      {hasChildren ? (
        <ul>
          {item.children!.map((child) => (
            <li key={`${child.slug}:${pathname}`}>
              <PageLink page={child} pathname={pathname} child onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname();
  // The phone drawer is "open for this pathname": a route change closes it
  // without an effect, because the new pathname no longer matches.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const drawerOpen = openFor === pathname;
  const close = useCallback(() => setOpenFor(null), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, close]);

  // "Deployment: Static hosting" for the phone bar.
  let current = "Documentation";
  for (const section of sections) {
    for (const item of section.items) {
      const hit = [item, ...(item.children ?? [])].find((p) => pathname === `/docs/${p.slug}`);
      if (hit) current = `${section.label}: ${hit.title}`;
    }
  }

  const nav = (withSearch: boolean) => (
    <nav aria-label="Documentation pages">
      {withSearch ? <DocsSearch listen /> : null}
      {sections.map((section) => {
        return (
          <div key={section.slug} className="bw-side-group">
            <h4>
              <Link href={`/docs/${section.slug}`} onClick={close}>
                {section.label}
              </Link>
            </h4>
            <ul>
              {section.items.map((item) => (
                <SidebarEntry key={`${item.slug}:${pathname}`} item={item} pathname={pathname} onNavigate={close} />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Phone: one line under the nav with the current page and the search */}
      <div className="bw-docs-bar">
        <button type="button" onClick={() => setOpenFor(pathname)} aria-expanded={drawerOpen}>
          <Menu size={18} {...ICON} />
          <span>{current}</span>
        </button>
        <button
          type="button"
          aria-label="Search the docs"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))}
        >
          <Search size={18} {...ICON} />
        </button>
      </div>

      {drawerOpen ? (
        <>
          <div className="bw-docs-scrim" onClick={close} />
          <aside className="bw-docs-drawer" aria-label="Documentation pages">
            <div className="bw-docs-drawer-head">
              <span>Documentation</span>
              <button type="button" className="bw-iconbtn" onClick={close} aria-label="Close the page list">
                <X size={18} {...ICON} />
              </button>
            </div>
            {nav(false)}
          </aside>
        </>
      ) : null}

      <aside className="bw-docs-side">{nav(true)}</aside>
    </>
  );
}
