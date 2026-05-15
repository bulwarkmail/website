import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getAllDocs, getDocSections } from "@/lib/docs";
import { CopyableCode } from "@/components/docs/copyable-code";
import { ArrowLeft, ArrowRight, ChevronRight, Pencil } from "lucide-react";
import type { Metadata } from "next";

const GITHUB_EDIT_URL = "https://github.com/bulwarkmail/website/edit/main/docs";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const doc = await getDocBySlug(slugStr);
  if (!doc) return {};
  return {
    title: `${doc.title} - Bulwark Webmail Docs`,
    description:
      doc.description ||
      `${doc.title} - Bulwark webmail documentation for Stalwart Mail Server. Learn about setup, configuration, and usage with the JMAP protocol.`,
    alternates: {
      canonical: `/docs/${slugStr}`,
    },
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
    <article className="max-w-[760px]">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-8">
        <div className="ed-eyebrow flex items-center gap-2 flex-wrap">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <span>{sectionLabel}</span>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <span className="text-foreground">{doc.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`${GITHUB_EDIT_URL}/${slugStr}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-[color:var(--rule)] hover:border-foreground/40 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace", letterSpacing: "0.04em" }}
          >
            <Pencil className="w-3 h-3" />
            Edit on GitHub
          </a>
        </div>
      </div>

      {/* Rendered markdown */}
      <CopyableCode html={doc.html} />

      {/* Prev/Next navigation */}
      {(prev || next) && (
        <nav className="mt-16 pt-8 border-t border-[color:var(--rule)] flex">
          <div className="flex-1">
            {prev && (
              <Link
                href={`/docs/${prev.slug}`}
                className="group flex flex-col px-5 py-4 hover:bg-[color:var(--alt-section)] transition-colors"
              >
                <span className="ed-eyebrow mb-2">Previous</span>
                <span className="text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2" style={{ fontFamily: "var(--font-exo2)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden /> {prev.title}
                </span>
              </Link>
            )}
          </div>
          {prev && next && <div className="w-px bg-[color:var(--rule)]" />}
          <div className="flex-1 flex justify-end">
            {next && (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex flex-col items-end px-5 py-4 hover:bg-[color:var(--alt-section)] transition-colors text-right"
              >
                <span className="ed-eyebrow mb-2">Next</span>
                <span className="text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2" style={{ fontFamily: "var(--font-exo2)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {next.title} <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
