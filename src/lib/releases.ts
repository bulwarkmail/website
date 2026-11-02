import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Element, Root, RootContent } from "hast";
import { GITHUB_REPO } from "./site";

// The webmail's releases from GitHub, for /changelog and its markdown copy.
// Fetched at most once an hour, like the version on the home page.

const API = "https://api.github.com/repos/bulwarkmail/webmail/releases?per_page=50";

export type Release = {
  version: string;
  /** ISO date it was published. */
  date: string;
  url: string;
  /** The release notes as markdown, without the heading GitHub repeats at the top. */
  body: string;
};

type GitHubRelease = {
  tag_name: string;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
};

/** Published, non-beta releases, newest first. Empty when GitHub can't be reached. */
export async function fetchReleases(): Promise<Release[]> {
  try {
    const res = await fetch(API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as GitHubRelease[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((r) => !r.draft && !r.prerelease && r.published_at)
      .map((r) => {
        const version = r.tag_name.replace(/^v/, "");
        return {
          version,
          date: r.published_at as string,
          url: r.html_url,
          // The notes open with "## 1.19.1 (2026-10-31)", which the page already shows.
          body: (r.body ?? "").replace(/\r\n/g, "\n").replace(new RegExp(`^#{1,3} v?${escape(version)}\\b.*\\n+`), "").trim(),
        };
      });
  } catch {
    return [];
  }
}

function escape(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const RELEASES_URL = `${GITHUB_REPO}/releases`;

/** "31 October 2026", in UTC. */
export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Headings in the notes sit under the release's own h2, so h1 and h2 become h3. */
function rehypeNestHeadings() {
  const walk = (nodes: (Root | RootContent)[]) => {
    for (const node of nodes) {
      if (node.type !== "element") continue;
      const el = node as Element;
      const level = el.tagName.match(/^h([1-6])$/)?.[1];
      if (level) el.tagName = `h${Math.min(6, Math.max(3, Number(level) + 1))}`;
      walk(el.children);
    }
  };
  return (tree: Root) => walk(tree.children);
}

/**
 * The notes as HTML. Raw HTML in them is dropped, not passed through: the
 * notes come from GitHub, and markdown covers everything they use.
 */
export async function releaseHtml(body: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeNestHeadings)
    .use(rehypeStringify)
    .process(body);
  return file.toString();
}
