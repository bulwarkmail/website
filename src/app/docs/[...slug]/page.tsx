import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getAllDocs, getDocSections } from "@/lib/docs";
import { CopyableCode } from "@/components/docs/copyable-code";
import { ChevronRight, Pencil } from "lucide-react";
import type { Metadata } from "next";

const GITHUB_EDIT_URL = "https://github.com/root-fr/jmap-webmail/edit/main/docs";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug.join("/"));
  if (!doc) return {};
  return {
    title: `${doc.title} — Bulwark Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const doc = await getDocBySlug(slugStr);

  if (!doc) notFound();

  // Find prev/next only among sibling pages (same parent or same section top-level)
  const sections = getDocSections();
  const allItems = sections.flatMap((s) => s.items);
  const siblings = doc.parent
    ? allItems.filter((i) => i.parent === doc.parent)
    : allItems.filter((i) => i.section === doc.section && !i.parent);
  const idx = siblings.findIndex((i) => i.slug === slugStr);
  const prev = siblings.length > 1 && idx > 0 ? siblings[idx - 1] : null;
  const next = siblings.length > 1 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const sectionLabel =
    sections.find((s) => s.slug === doc.section)?.label ?? doc.section;

  return (
    <article>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="capitalize">{sectionLabel}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{doc.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">Found an error?</span>
          <a
            href={`${GITHUB_EDIT_URL}/${slugStr}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </a>
        </div>
      </div>

      {/* Rendered markdown */}
      <CopyableCode html={doc.html} />

      {/* Prev/Next navigation */}
      <nav className="mt-12 pt-6 border-t border-border flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex flex-col px-4 py-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
          >
            <span className="text-xs text-muted-foreground mb-1">Previous</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              ← {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="group flex flex-col items-end px-4 py-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
          >
            <span className="text-xs text-muted-foreground mb-1">Next</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {next.title} →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
