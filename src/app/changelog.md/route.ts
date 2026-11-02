import { MARKDOWN_HEADERS } from "@/lib/agent-docs";
import { fetchReleases, RELEASES_URL } from "@/lib/releases";
import { SITE_URL } from "@/lib/site";

// /changelog as markdown for AI tools: the current version first, then every
// release's notes as GitHub has them.
export const revalidate = 3600;

/** One level deeper for every heading outside code blocks, so they sit under the release's own "##". */
function nestHeadings(body: string): string {
  let fence = false;
  return body
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fence = !fence;
      return !fence && /^#{1,5} /.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

export async function GET() {
  const releases = await fetchReleases();
  const current = releases[0];
  const head = [
    "# Bulwark changelog",
    `Source: ${SITE_URL}/changelog`,
    current
      ? `Current version: ${current.version}, released ${current.date.slice(0, 10)}. Bulwark and Bulwark Lite share the version number.`
      : `The release notes are on GitHub: ${RELEASES_URL}`,
  ].join("\n\n");
  const entries = releases.map(
    (r) => `## ${r.version} (${r.date.slice(0, 10)})\n\n${nestHeadings(r.body)}\n\nDownloads: ${r.url}`,
  );
  return new Response([head, ...entries].join("\n\n") + "\n", {
    headers: { ...MARKDOWN_HEADERS, Link: `<${SITE_URL}/changelog>; rel="canonical"` },
  });
}
