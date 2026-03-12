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

const docsDirectory = path.join(process.cwd(), "docs");

export interface DocMeta {
  title: string;
  description: string;
  order: number;
  slug: string;
  section: string;
  parent?: string;
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

const SECTION_LABELS: Record<string, { label: string; order: number }> = {
  "getting-started": { label: "Getting Started", order: 1 },
  features: { label: "Features", order: 2 },
  deployment: { label: "Deployment", order: 3 },
  guides: { label: "Guides", order: 4 },
  development: { label: "Development", order: 5 },
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
        const { data } = matter(fileContent);

        docs.push({
          title: data.title ?? entry.name.replace(".md", ""),
          description: data.description ?? "",
          order: data.order ?? 99,
          slug: `${section.name}/${entry.name.replace(".md", "")}`,
          section: section.name,
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
          const { data } = matter(fileContent);

          docs.push({
            title: data.title ?? subFile.replace(".md", ""),
            description: data.description ?? "",
            order: data.order ?? 99,
            slug: `${section.name}/${entry.name}/${subFile.replace(".md", "")}`,
            section: section.name,
            parent: parentSlug,
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
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
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
  };
}

export interface SearchResult {
  title: string;
  description: string;
  slug: string;
  section: string;
  excerpt: string;
}

export function searchDocs(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const docs = getAllDocs();
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const doc of docs) {
    const filePath = path.join(docsDirectory, `${doc.slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(fileContent);
    const lowerContent = content.toLowerCase();

    const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
    const descMatch = doc.description.toLowerCase().includes(lowerQuery);
    const contentMatch = lowerContent.includes(lowerQuery);

    if (titleMatch || descMatch || contentMatch) {
      let excerpt = doc.description;
      if (contentMatch && !titleMatch) {
        const idx = lowerContent.indexOf(lowerQuery);
        const start = Math.max(0, idx - 60);
        const end = Math.min(content.length, idx + query.length + 60);
        excerpt = (start > 0 ? "..." : "") + content.slice(start, end).replace(/\n/g, " ") + (end < content.length ? "..." : "");
      }

      results.push({
        title: doc.title,
        description: doc.description,
        slug: doc.slug,
        section: doc.section,
        excerpt,
      });
    }
  }

  return results;
}
