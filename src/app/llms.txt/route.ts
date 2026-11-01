import { llmsTxt, TEXT_HEADERS } from "@/lib/agent-docs";

// An index of the site for language models (llmstxt.org), built from the docs.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: TEXT_HEADERS });
}
