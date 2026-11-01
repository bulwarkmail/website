import { docPageMarkdown, MARKDOWN_HEADERS, sectionMarkdown } from "@/lib/agent-docs";
import { getAllDocs, getDocSections } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

// The markdown copy of a docs page or section. Nobody links here: src/proxy.ts
// rewrites /docs/<slug>.md, and /docs/<slug> asked for as text/markdown, to it.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getDocSections().map((s) => ({ slug: [s.slug] })),
    ...getAllDocs().map((doc) => ({ slug: doc.slug.split("/") })),
  ];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join("/");
  const section = getDocSections().find((s) => s.slug === slug);
  const body = section ? sectionMarkdown(section) : docPageMarkdown(slug);
  if (body === null) return new Response("Not found\n", { status: 404 });

  return new Response(body, {
    headers: {
      ...MARKDOWN_HEADERS,
      // The HTML page is the one to index; this is a copy of it.
      Link: `<${SITE_URL}/docs/${slug}>; rel="canonical"`,
      // /docs/<slug> answers with HTML or markdown depending on Accept.
      Vary: "Accept",
    },
  });
}
