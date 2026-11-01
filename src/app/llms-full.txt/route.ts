import { llmsFullTxt, TEXT_HEADERS } from "@/lib/agent-docs";

// Every docs page as markdown in one file, for tools that read a whole manual at once.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: TEXT_HEADERS });
}
