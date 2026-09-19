import { getDocSections } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsNavbar } from "@/components/docs/docs-navbar";
import { Footer } from "@/components/footer";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocSections();

  return (
    <div className="min-h-screen">
      <DocsNavbar />
      {/* DocsSidebar renders the phone bar (a full grid row), the phone drawer
          and the desktop sidebar; the page sits in the second column. */}
      <div className="bw-docs">
        <DocsSidebar
          sections={sections.map((s) => {
            const topLevel = s.items.filter((i) => !i.parent);
            return {
              slug: s.slug,
              label: s.label,
              items: topLevel.map((i) => ({
                title: i.title,
                slug: i.slug,
                edition: i.edition,
                headings: i.headings.map((h) => ({ text: h.text, id: h.id })),
                children: s.items
                  .filter((c) => c.parent === i.slug)
                  .map((c) => ({
                    title: c.title,
                    slug: c.slug,
                    edition: c.edition,
                    headings: c.headings.map((h) => ({ text: h.text, id: h.id })),
                  })),
              })),
            };
          })}
        />
        <main className="bw-docs-main">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
