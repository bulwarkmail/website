import { NextResponse, type NextRequest } from "next/server";

// Markdown for AI tools. A docs page is served as markdown when its URL ends
// in .md, or when the request prefers text/markdown to text/html, which is
// what agents such as Claude Code send. Browsers never ask for markdown, so
// they keep getting the HTML page. /docs itself answers with llms.txt.

/** The highest q the Accept header gives any of the ranges, 0 if it names none. */
function quality(accept: string, ranges: string[]): number {
  let best = 0;
  for (const part of accept.split(",")) {
    const [range, ...params] = part.toLowerCase().split(";").map((p) => p.trim());
    if (!ranges.includes(range)) continue;
    const q = params.find((p) => p.startsWith("q="));
    best = Math.max(best, q ? Number(q.slice(2)) || 0 : 1);
  }
  return best;
}

/**
 * True when the Accept header names text/markdown itself, at least as high as
 * HTML. Wildcards count for HTML only, so `*\/*` alone keeps the HTML page.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const markdown = quality(accept, ["text/markdown"]);
  return markdown > 0 && markdown >= quality(accept, ["text/html", "text/*", "*/*"]);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const asMarkdown = pathname.endsWith(".md");
  if (!asMarkdown && !prefersMarkdown(request.headers.get("accept"))) return NextResponse.next();

  const path = asMarkdown ? pathname.slice(0, -3) : pathname.replace(/\/$/, "");
  const url = request.nextUrl.clone();
  url.pathname = path === "/docs" ? "/llms.txt" : `/docs-md/${path.slice("/docs/".length)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/docs", "/docs.md", "/docs/:path+"],
};
