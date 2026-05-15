import { getDocSections } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsNavbar } from "@/components/docs/docs-navbar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocSections();

  return (
    <div className="min-h-screen bg-background">
      <DocsNavbar />
      <div className="px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex gap-4 lg:gap-12 xl:gap-16">
            <DocsSidebar
              sections={sections.map((s) => {
                const topLevel = s.items.filter((i) => !i.parent);
                return {
                  slug: s.slug,
                  label: s.label,
                  items: topLevel.map((i) => ({
                    title: i.title,
                    slug: i.slug,
                    headings: i.headings.map((h) => ({ text: h.text, id: h.id })),
                    children: s.items
                      .filter((c) => c.parent === i.slug)
                      .map((c) => ({
                        title: c.title,
                        slug: c.slug,
                        headings: c.headings.map((h) => ({ text: h.text, id: h.id })),
                      })),
                  })),
                };
              })}
            />
            <main className="flex-1 min-w-0 py-10 sm:py-14">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
