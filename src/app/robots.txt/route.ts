import { SITE_URL } from "@/lib/site";

// A route instead of robots.ts, because Next's robots format has no field for
// Content-Signal (contentsignals.org). The signals say what the content may be
// used for once fetched: search results, answers from AI tools, and training.
// The project wants all three, so people can find out how to run Bulwark
// wherever they ask.
export const dynamic = "force-static";

const ROBOTS = `# A summary of this site for language models: ${SITE_URL}/llms.txt
# Every docs page is also markdown: add .md to its URL.

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
