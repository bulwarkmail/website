import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getAllDocs, getDocSections, appliesTo, type DocMeta } from "@/lib/docs";
import { CopyableCode } from "@/components/docs/copyable-code";
import { EditionBanner } from "@/components/docs/edition-banner";
import { Pencil } from "lucide-react";
import { ICON } from "@/lib/icon";
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

  // Find prev/next only among sibling pages (same parent or same section
  // top-level). Each edition has its own neighbours, so both pairs are
  // rendered and the data-edition attribute picks one.
  const sections = getDocSections();
  const allItems = sections.flatMap((s) => s.items);
  const allSiblings = doc.parent
    ? allItems.filter((i) => i.parent === doc.parent)
    : allItems.filter((i) => i.section === doc.section && !i.parent);
  const neighbours = (edition: "full" | "lite"): { prev: DocMeta | null; next: DocMeta | null } => {
    const siblings = allSiblings.filter((i) => appliesTo(i, edition));
    const idx = siblings.findIndex((i) => i.slug === slugStr);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
    };
  };
  const pagers: { edition: "full" | "lite"; className: string; prev: DocMeta | null; next: DocMeta | null }[] = [
    { edition: "full", className: "ed-full-only", ...neighbours("full") },
    { edition: "lite", className: "ed-lite-only", ...neighbours("lite") },
  ];

  const sectionLabel =
    sections.find((s) => s.slug === doc.section)?.label ?? doc.section;

  return (
    <article className="bw-docs-article">
      {/* The breadcrumb is the only label on a docs page */}
      <div className="bw-crumb">
        <span>
          <Link href="/docs">Docs</Link> / {sectionLabel}
        </span>
        <a
          href={`${GITHUB_EDIT_URL}/${slugStr}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="bw-crumb-edit"
        >
          <Pencil size={14} {...ICON} />
          Edit on GitHub
        </a>
      </div>

      {/* A page that exists only in the other edition says so instead of vanishing */}
      {doc.edition !== "both" ? <EditionBanner pageEdition={doc.edition} /> : null}

      {/* Rendered markdown */}
      <CopyableCode html={doc.html} />

      {/* Prev/Next navigation, one pair per edition */}
      {pagers.map(({ edition, className, prev, next }) =>
        prev || next ? (
          <div key={edition} className={className}>
            <nav className="bw-pager" aria-label="Previous and next page">
              {prev ? (
                <Link href={`/docs/${prev.slug}`}>
                  <span>Previous</span>
                  {prev.title}
                </Link>
              ) : null}
              {next ? (
                <Link href={`/docs/${next.slug}`} className="bw-pager-next">
                  <span>Next</span>
                  {next.title}
                </Link>
              ) : null}
            </nav>
          </div>
        ) : null
      )}
    </article>
  );
}
