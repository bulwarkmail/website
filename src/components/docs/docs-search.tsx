"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEdition } from "@/components/edition-provider";
import { ICON } from "@/lib/icon";

/** Dispatched on window by the phone docs bar to open the dialog. */
export const OPEN_SEARCH_EVENT = "open-docs-search";

interface SearchResult {
  title: string;
  slug: string;
  section: string;
  edition: "full" | "lite" | "both";
  heading?: { text: string; id: string };
  excerpt: string;
  score: number;
}

const EDITION_TAGS: Record<SearchResult["edition"], string | null> = {
  both: null,
  full: "Bulwark only",
  lite: "Lite only",
};

const SECTION_LABELS: Record<string, string> = {
  "getting-started": "Getting started",
  features: "Features",
  deployment: "Deployment",
  guides: "Guides",
  extensions: "Extensions",
  development: "Development",
  legal: "Legal",
};

function highlightTerms(text: string, query: string) {
  if (!query.trim()) return text;
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return text;

  const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "gi"));
  const isTerm = new RegExp(`^(?:${pattern})$`, "i");

  return parts.map((part, i) => (isTerm.test(part) ? <mark key={i}>{part}</mark> : part));
}

type DocsSearchProps = {
  /** Also open on the phone bar's event. Only one mounted instance should listen. */
  listen?: boolean;
};

export function DocsSearch({ listen = false }: DocsSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();
  const { edition } = useEdition();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));
      if (((e.metaKey || e.ctrlKey) && e.key === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        close();
      }
    };
    const handleOpen = () => setOpen(true);
    document.addEventListener("keydown", handleKeyDown);
    if (listen) window.addEventListener(OPEN_SEARCH_EVENT, handleOpen);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (listen) window.removeEventListener(OPEN_SEARCH_EVENT, handleOpen);
    };
  }, [close, listen]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/docs-search?q=${encodeURIComponent(query)}&edition=${edition}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } finally {
        setLoading(false);
      }
    }, 150);
  }, [query, edition]);

  // Results are shown grouped by docs section, sections in the order of their
  // best hit. The arrow keys walk the grouped order.
  const groups = useMemo(() => {
    const order: string[] = [];
    const bySection = new Map<string, SearchResult[]>();
    for (const result of results) {
      if (!bySection.has(result.section)) {
        bySection.set(result.section, []);
        order.push(result.section);
      }
      bySection.get(result.section)!.push(result);
    }
    return order.map((section) => ({ section, items: bySection.get(section)! }));
  }, [results]);
  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Scroll active item into view
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const activeEl = container.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const navigateTo = useCallback(
    (result: SearchResult) => {
      const hash = result.heading ? `#${result.heading.id}` : "";
      router.push(`/docs/${result.slug}${hash}`);
      close();
    },
    [router, close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, ordered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && ordered.length > 0) {
        e.preventDefault();
        navigateTo(ordered[activeIndex]);
      }
    },
    [ordered, activeIndex, navigateTo]
  );

  const trigger = (
    <button type="button" onClick={() => setOpen(true)} className="bw-searchbtn">
      <Search size={16} {...ICON} />
      <span>
        Search the <span className="ed-lite-only">Lite </span>docs
      </span>
      <kbd className="bw-kbd">/</kbd>
    </button>
  );

  if (!open || typeof document === "undefined") {
    return trigger;
  }

  const modal = (
    <>
      <div className="bw-docs-scrim" style={{ zIndex: 100 }} onClick={close} />
      <div className="bw-search" role="dialog" aria-modal="true" aria-label="Search the docs">
        <div className="bw-search-panel">
          <div className="bw-search-input">
            <Search size={20} {...ICON} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search the docs"
              aria-label="Search the docs"
              autoComplete="off"
            />
            <button type="button" onClick={close} aria-label="Close the search">
              <kbd className="bw-kbd">Esc</kbd>
            </button>
          </div>

          <div ref={listRef} className="bw-search-list">
            {!query ? <p className="bw-search-empty">Type to search the documentation.</p> : null}
            {query && loading && ordered.length === 0 ? <p className="bw-search-empty">Searching.</p> : null}
            {query && !loading && ordered.length === 0 ? (
              <p className="bw-search-empty">
                Nothing matches &ldquo;{query}&rdquo;. Try another word, or check the spelling.
              </p>
            ) : null}

            {groups.map((group) => (
              <div key={group.section}>
                <div className="bw-search-group">{SECTION_LABELS[group.section] ?? group.section}</div>
                {group.items.map((result) => {
                  const i = ordered.indexOf(result);
                  return (
                    <button
                      key={`${result.slug}-${result.heading?.id ?? "doc"}`}
                      type="button"
                      data-index={i}
                      data-active={i === activeIndex}
                      onClick={() => navigateTo(result)}
                      onMouseMove={() => setActiveIndex(i)}
                      className="bw-search-row"
                    >
                      <b>
                        {result.heading ? (
                          <>
                            {result.title}: {highlightTerms(result.heading.text, query)}
                          </>
                        ) : (
                          highlightTerms(result.title, query)
                        )}
                      </b>
                      <span>{highlightTerms(result.excerpt, query)}</span>
                      {EDITION_TAGS[result.edition] ? <small>{EDITION_TAGS[result.edition]}</small> : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="bw-search-foot">
            <span>
              <kbd className="bw-kbd">↑</kbd>
              <kbd className="bw-kbd">↓</kbd> to move
            </span>
            <span>
              <kbd className="bw-kbd">Enter</kbd> to open
            </span>
            <span>
              {ordered.length} result{ordered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {trigger}
      {createPortal(modal, document.body)}
    </>
  );
}
