import { NextResponse, type NextRequest } from "next/server";

// Markdown for AI tools. A docs page is served as markdown when its URL ends
// in .md, or when the request prefers text/markdown to text/html, which is
// what agents such as Claude Code send. Browsers never ask for markdown, so
// they keep getting the HTML page. /docs itself answers with llms.txt.
//
// The .md URLs are plain rewrites in next.config.ts. For the Accept header
// this only marks the request with MARKDOWN_HEADER, and a rewrite in
// next.config.ts that requires the mark sends it to the markdown route.
// The proxy doesn't rewrite itself: behind nginx with HOSTNAME=127.0.0.1 the
// standalone server saw the rewrite target as another origin (the proxy's
// URL says localhost) and tried to fetch it over HTTPS, which answered 500.

export const MARKDOWN_HEADER = "x-bulwark-markdown";

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
  const headers = new Headers(request.headers);
  // Only the proxy decides; a client can't set the mark itself.
  headers.delete(MARKDOWN_HEADER);
  if (prefersMarkdown(request.headers.get("accept"))) headers.set(MARKDOWN_HEADER, "1");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/docs", "/docs/:path+"],
};
