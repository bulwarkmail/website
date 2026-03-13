"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, FileText, Hash, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  slug: string;
  section: string;
  heading?: { text: string; id: string };
  excerpt: string;
  score: number;
}

function highlightTerms(text: string, query: string) {
  if (!query.trim()) return text;
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return text;

  const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-foreground rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

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
        const res = await fetch(`/api/docs-search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } finally {
        setLoading(false);
      }
    }, 150);
  }, [query]);

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
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        navigateTo(results[activeIndex]);
      }
    },
    [results, activeIndex, navigateTo]
  );

  const sectionLabels: Record<string, string> = useMemo(
    () => ({
      "getting-started": "Getting Started",
      features: "Features",
      deployment: "Deployment",
      guides: "Guides",
      development: "Development",
    }),
    []
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-background border border-border rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={close} />
      <div className="fixed inset-x-0 top-[10%] z-50 mx-auto w-full max-w-lg px-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search documentation..."
              className="flex-1 py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={close} className="p-1 text-muted-foreground hover:text-foreground">
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted border border-border rounded">
                ESC
              </kbd>
            </button>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                <div className="inline-block w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords or check your spelling</p>
              </div>
            )}

            {!loading &&
              results.map((result, i) => (
                <button
                  key={`${result.slug}-${result.heading?.id ?? "doc"}`}
                  data-index={i}
                  onClick={() => navigateTo(result)}
                  className={`flex items-start gap-3 px-4 py-3 w-full text-left transition-colors border-b border-border/50 last:border-0 ${
                    i === activeIndex ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  {result.heading ? (
                    <Hash className="w-4 h-4 mt-0.5 text-primary/60 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {result.heading ? (
                        <>
                          <span className="text-muted-foreground">{result.title}</span>
                          <span className="text-muted-foreground/40 mx-1.5">›</span>
                          <span>{highlightTerms(result.heading.text, query)}</span>
                        </>
                      ) : (
                        highlightTerms(result.title, query)
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {highlightTerms(result.excerpt, query)}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 mt-1">
                      {sectionLabels[result.section] ?? result.section}
                    </div>
                  </div>
                  {i === activeIndex && (
                    <CornerDownLeft className="w-3.5 h-3.5 mt-1 text-muted-foreground/40 shrink-0" />
                  )}
                </button>
              ))}

            {!loading && !query && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">Type to search the documentation</p>
                <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground/50">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">↵</kbd> open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">esc</kbd> close
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer with result count */}
          {!loading && query && results.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground/60">
              <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-border rounded font-mono">↵</kbd> open
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
