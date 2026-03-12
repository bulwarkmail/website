import { getDocSections } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsNavbar } from "@/components/docs/docs-navbar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocSections();

  return (
    <div className="min-h-screen bg-background">
      <DocsNavbar />
      <div className="max-w-6xl mx-auto px-6 pt-20">
        <div className="flex gap-8">
          <DocsSidebar
            sections={sections.map((s) => {
              const topLevel = s.items.filter((i) => !i.parent);
              return {
                slug: s.slug,
                label: s.label,
                items: topLevel.map((i) => ({
                  title: i.title,
                  slug: i.slug,
                  children: s.items
                    .filter((c) => c.parent === i.slug)
                    .map((c) => ({ title: c.title, slug: c.slug })),
                })),
              };
            })}
          />
          <main className="flex-1 min-w-0 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
