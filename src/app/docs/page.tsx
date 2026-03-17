import Link from "next/link";
import { getDocSections } from "@/lib/docs";
import { BookOpen, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - Bulwark Webmail for Stalwart",
  description:
    "Comprehensive documentation for Bulwark, the open-source JMAP webmail client for Stalwart Mail Server. Installation guides, configuration, features, and deployment with Docker.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  const sections = getDocSections();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-exo2)" }}>
          Documentation
        </h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to get started with Bulwark.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.slug}
            className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {section.label}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/docs/${item.slug}`}
                    className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {item.title}
                    <span className="hidden sm:inline text-xs text-muted-foreground/50 ml-auto truncate max-w-[150px]">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
