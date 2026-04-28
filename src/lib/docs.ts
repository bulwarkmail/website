import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import GithubSlugger from "github-slugger";

const docsDirectory = path.join(process.cwd(), "docs");

export interface DocHeading {
  text: string;
  id: string;
}

export interface DocMeta {
  title: string;
  description: string;
  order: number;
  slug: string;
  section: string;
  parent?: string;
  headings: DocHeading[];
}

export interface Doc extends DocMeta {
  content: string;
  html: string;
}

export interface DocSection {
  slug: string;
  label: string;
  order: number;
  items: DocMeta[];
}

function extractHeadings(content: string): DocHeading[] {
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];
  const lines = content.split("\n");
  let inCodeBlock = false;
  for (const line of lines) {
    const trimmedLine = line.replace(/\r$/, "");
    if (trimmedLine.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = trimmedLine.match(/^##\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      headings.push({ text, id: slugger.slug(text) });
    }
  }
  return headings;
}

const SECTION_LABELS: Record<string, { label: string; order: number }> = {
  "getting-started": { label: "Getting Started", order: 1 },
  features: { label: "Features", order: 2 },
  deployment: { label: "Deployment", order: 3 },
  guides: { label: "Guides", order: 4 },
  extensions: { label: "Extensions", order: 5 },
  development: { label: "Development", order: 6 },
  branding: { label: "Branding", order: 7 },
  legal: { label: "Legal", order: 8 },
};

function getSectionMeta(sectionSlug: string) {
  return (
    SECTION_LABELS[sectionSlug] ?? {
      label: sectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      order: 99,
    }
  );
}

export function getAllDocs(): DocMeta[] {
  const sections = fs.readdirSync(docsDirectory, { withFileTypes: true });
  const docs: DocMeta[] = [];

  for (const section of sections) {
    if (!section.isDirectory()) continue;
    const sectionPath = path.join(docsDirectory, section.name);
    const entries = fs.readdirSync(sectionPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const filePath = path.join(sectionPath, entry.name);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        docs.push({
          title: data.title ?? entry.name.replace(".md", ""),
          description: data.description ?? "",
          order: data.order ?? 99,
          slug: `${section.name}/${entry.name.replace(".md", "")}`,
          section: section.name,
          headings: extractHeadings(content),
        });
      } else if (entry.isDirectory()) {
        // Subpages: docs/<section>/<parent>/<child>.md
        const parentSlug = `${section.name}/${entry.name}`;
        const subPath = path.join(sectionPath, entry.name);
        const subFiles = fs.readdirSync(subPath);

        for (const subFile of subFiles) {
          if (!subFile.endsWith(".md")) continue;
          const filePath = path.join(subPath, subFile);
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const { data, content: subContent } = matter(fileContent);

          docs.push({
            title: data.title ?? subFile.replace(".md", ""),
            description: data.description ?? "",
            order: data.order ?? 99,
            slug: `${section.name}/${entry.name}/${subFile.replace(".md", "")}`,
            section: section.name,
            parent: parentSlug,
            headings: extractHeadings(subContent),
          });
        }
      }
    }
  }

  return docs.sort((a, b) => a.order - b.order);
}

export function getDocSections(): DocSection[] {
  const docs = getAllDocs();
  const sectionMap = new Map<string, DocMeta[]>();

  for (const doc of docs) {
    const items = sectionMap.get(doc.section) ?? [];
    items.push(doc);
    sectionMap.set(doc.section, items);
  }

  const sections: DocSection[] = [];
  for (const [slug, items] of sectionMap) {
    const meta = getSectionMeta(slug);
    sections.push({
      slug,
      label: meta.label,
      order: meta.order,
      items: items.sort((a, b) => a.order - b.order),
    });
  }

  return sections.sort((a, b) => a.order - b.order);
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const filePath = path.join(docsDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);

  const section = slug.split("/")[0];

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    order: data.order ?? 99,
    slug,
    section,
    content,
    html: result.toString(),
    headings: extractHeadings(content),
  };
}

export interface SearchResult {
  title: string;
  slug: string;
  section: string;
  heading?: { text: string; id: string };
  excerpt: string;
  score: number;
}

/** Tokenize text into lowercase alphanumeric words */
function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

/** Strip markdown syntax for cleaner excerpt display */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/---+/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Split markdown content by ## headings into sections */
function splitBySections(content: string): { heading: DocHeading | null; body: string }[] {
  const slugger = new GithubSlugger();
  const sections: { heading: DocHeading | null; body: string }[] = [];
  const lines = content.split("\n");
  let currentHeading: DocHeading | null = null;
  let currentBody: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.replace(/\r$/, "");
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      currentBody.push(line);
      continue;
    }
    if (inCodeBlock) {
      currentBody.push(line);
      continue;
    }
    const match = trimmed.match(/^##\s+(.+)$/);
    if (match) {
      // Save previous section
      sections.push({ heading: currentHeading, body: currentBody.join("\n") });
      const text = match[1].trim();
      currentHeading = { text, id: slugger.slug(text) };
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  sections.push({ heading: currentHeading, body: currentBody.join("\n") });
  return sections;
}

/** Build a context-rich excerpt around matching terms */
function buildExcerpt(text: string, terms: string[], maxLen = 140): string {
  const clean = stripMarkdown(text).replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();

  // Find the position of the first matching term
  let bestPos = -1;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (bestPos === -1 || idx < bestPos)) {
      bestPos = idx;
    }
  }

  if (bestPos === -1) return clean.slice(0, maxLen) + (clean.length > maxLen ? "..." : "");

  const halfWindow = Math.floor(maxLen / 2);
  let start = Math.max(0, bestPos - halfWindow);
  let end = Math.min(clean.length, start + maxLen);
  if (end === clean.length) start = Math.max(0, end - maxLen);

  // Snap to word boundaries
  if (start > 0) {
    const spaceIdx = clean.indexOf(" ", start);
    if (spaceIdx !== -1 && spaceIdx < start + 15) start = spaceIdx + 1;
  }
  if (end < clean.length) {
    const spaceIdx = clean.lastIndexOf(" ", end);
    if (spaceIdx > end - 15) end = spaceIdx;
  }

  const excerpt = clean.slice(start, end);
  return (start > 0 ? "..." : "") + excerpt + (end < clean.length ? "..." : "");
}

/** Count how many times terms appear in text (sum of per-term occurrences) */
function countTermHits(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const term of terms) {
    let idx = 0;
    while (true) {
      idx = lower.indexOf(term, idx);
      if (idx === -1) break;
      count++;
      idx += term.length;
    }
  }
  return count;
}

/** Check if all terms appear in the given text */
function allTermsMatch(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.every((t) => lower.includes(t));
}

/** Check if any term appears in the given text */
function anyTermMatch(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

export function searchDocs(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const terms = tokenize(trimmed).filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  const docs = getAllDocs();
  const results: SearchResult[] = [];

  for (const doc of docs) {
    const filePath = path.join(docsDirectory, `${doc.slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(fileContent);

    const titleText = doc.title;
    const descText = doc.description;
    const fullText = `${titleText} ${descText} ${content}`;

    // Check if all terms appear somewhere in the full document
    if (!allTermsMatch(fullText, terms)) continue;

    // Score the document overall
    let docScore = 0;

    // Title scoring (highest weight)
    if (allTermsMatch(titleText, terms)) {
      docScore += 100;
    } else if (anyTermMatch(titleText, terms)) {
      docScore += 40 * terms.filter((t) => titleText.toLowerCase().includes(t)).length;
    }

    // Exact phrase match bonus
    if (titleText.toLowerCase().includes(trimmed.toLowerCase())) {
      docScore += 50;
    }
    if (content.toLowerCase().includes(trimmed.toLowerCase())) {
      docScore += 10;
    }

    // Description scoring
    if (allTermsMatch(descText, terms)) {
      docScore += 30;
    } else if (anyTermMatch(descText, terms)) {
      docScore += 10;
    }

    // Content frequency scoring
    docScore += Math.min(countTermHits(content, terms), 20);

    // Add a result for the document itself
    const docExcerpt = allTermsMatch(descText, terms) || !anyTermMatch(content, terms)
      ? descText || stripMarkdown(content).slice(0, 140)
      : buildExcerpt(content, terms);
    results.push({
      title: doc.title,
      slug: doc.slug,
      section: doc.section,
      excerpt: docExcerpt,
      score: docScore,
    });

    // Also check individual heading sections for deep-link results
    const sections = splitBySections(content);
    for (const sec of sections) {
      if (!sec.heading) continue;
      const sectionText = `${sec.heading.text} ${sec.body}`;
      if (!anyTermMatch(sectionText, terms)) continue;

      let headingScore = 0;
      if (allTermsMatch(sec.heading.text, terms)) {
        headingScore += 60;
      } else if (anyTermMatch(sec.heading.text, terms)) {
        headingScore += 25;
      }
      if (allTermsMatch(sec.body, terms)) {
        headingScore += 15;
      }
      headingScore += Math.min(countTermHits(sectionText, terms), 10);

      // Only add heading result if it's specifically relevant (not just general doc match)
      if (headingScore > 10) {
        results.push({
          title: doc.title,
          slug: doc.slug,
          section: doc.section,
          heading: sec.heading,
          excerpt: buildExcerpt(sec.body, terms),
          score: headingScore,
        });
      }
    }
  }

  // Deduplicate: if a heading result and its parent doc result overlap closely, keep the better one
  const deduped = new Map<string, SearchResult>();
  for (const r of results) {
    const key = r.heading ? `${r.slug}#${r.heading.id}` : r.slug;
    const existing = deduped.get(key);
    if (!existing || r.score > existing.score) {
      deduped.set(key, r);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
