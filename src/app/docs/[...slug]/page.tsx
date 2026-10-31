import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getAllDocs, getDocSections, getReadingOrder, type DocSection } from "@/lib/docs";
import { CopyableCode } from "@/components/docs/copyable-code";
import { Tile } from "@/components/ui";
import { Pencil } from "@/components/icons";
import { ICON } from "@/lib/icon";
import type { Metadata } from "next";

const GITHUB_EDIT_URL = "https://github.com/bulwarkmail/website/edit/main/docs";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  const sections = getDocSections();
  return [
    ...sections.map((s) => ({ slug: [s.slug] })),
    ...docs.map((doc) => ({ slug: doc.slug.split("/") })),
  ];
}

/** /docs/<section>: the section's pages in sidebar order. */
function findSection(slug: string[]) {
  return slug.length === 1 ? getDocSections().find((s) => s.slug === slug[0]) : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const section = findSection(slug);
  if (section) {
    return {
      title: `${section.label} - Bulwark Webmail Docs`,
      description: section.intro,
      alternates: { canonical: `/docs/${section.slug}` },
    };
  }
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
  const section = findSection(slug);
  if (section) return <SectionPage section={section} />;

  const doc = await getDocBySlug(slugStr);

  if (!doc) notFound();

  // Previous and next follow the sidebar from top to bottom, across sections,
  // so the last page of a section leads into the next one.
  const sections = getDocSections();
  const readingOrder = getReadingOrder();
  const idx = readingOrder.findIndex((i) => i.slug === slugStr);
  const prev = idx > 0 ? readingOrder[idx - 1] : null;
  const next = idx !== -1 && idx < readingOrder.length - 1 ? readingOrder[idx + 1] : null;

  const labelOf = (section: string) => sections.find((s) => s.slug === section)?.label ?? section;
  const sectionLabel = labelOf(doc.section);
  // A neighbour in another section names that section, so the reader sees the jump.
  const pagerLabel = (word: string, item: { section: string }) =>
    item.section === doc.section ? word : `${word} in ${labelOf(item.section)}`;

  return (
    <article className="bw-docs-article">
      {/* The breadcrumb is the only label on a docs page */}
      <div className="bw-crumb">
        <span>
          <Link href="/docs">Docs</Link> / <Link href={`/docs/${doc.section}`}>{sectionLabel}</Link>
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

      {/* Pages that apply to Bulwark or to Bulwark Lite only say so first */}
      {doc.edition !== "both" && doc.editionNote ? (
        <div className="bw-note bw-note-brand" role="note">
          <b>{doc.edition === "full" ? "Not in Lite." : "Bulwark Lite."}</b> {doc.editionNote}
        </div>
      ) : null}

      {/* Rendered markdown */}
      <CopyableCode html={doc.html} />

      {prev || next ? (
        <nav className="bw-pager" aria-label="Previous and next page">
          {prev ? (
            <Link href={`/docs/${prev.slug}`}>
              <span>{pagerLabel("Previous", prev)}</span>
              {prev.title}
            </Link>
          ) : null}
          {next ? (
            <Link href={`/docs/${next.slug}`} className="bw-pager-next">
              <span>{pagerLabel("Next", next)}</span>
              {next.title}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}

function SectionPage({ section }: { section: DocSection }) {
  return (
    <article className="bw-docs-article">
      <div className="bw-crumb">
        <span>
          <Link href="/docs">Docs</Link>
        </span>
      </div>
      <div className="prose-docs">
        <h1>{section.label}</h1>
        <p>{section.intro}</p>
      </div>
      <div className="bw-tiles bw-tiles-1" style={{ marginTop: 32 }}>
        {section.items.map((item) => (
          <Tile
            key={item.slug}
            compact
            nested={Boolean(item.parent)}
            href={`/docs/${item.slug}`}
            title={item.title}
            text={item.description}
          />
        ))}
      </div>
    </article>
  );
}
