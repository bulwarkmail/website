import manifest from "@/generated/screenshots.json";
import { getAllDocs, getDocSections, getDocSource, getReadingOrder, type DocMeta, type DocSection } from "./docs";
import { BULWARK_VERSION } from "./version";
import { AUDIENCE_PAGES, DEMO_URL, DISCORD_URL, EXTENSIONS_URL, GITHUB_ORG, GITHUB_REPO, SITE_URL } from "./site";

// The docs as plain markdown for AI tools: llms.txt, llms-full.txt and a .md
// copy of every docs page (src/proxy.ts routes /docs/<page>.md to them).
//
// The source files are almost plain markdown already. What a browser needs
// and a language model doesn't is rewritten here:
//   - screenshots come as a light and a dark <img>; the dark one is dropped
//     and the light one becomes a markdown image of the 1280 px WebP
//   - notes are one-line <div class="bw-note"> blocks; they become quotes
//   - site links become absolute, and links to docs pages point at the .md
//     copy, so an agent that follows them keeps getting markdown

type Screenshot = { hash: string; widths: number[] };
const screenshots: Record<string, Screenshot> = manifest.images;

export const MARKDOWN_HEADERS = { "Content-Type": "text/markdown; charset=utf-8" };
export const TEXT_HEADERS = { "Content-Type": "text/plain; charset=utf-8" };

/** The .md copy of a docs page or section, by slug. */
export const markdownUrl = (slug: string) => `${SITE_URL}/docs/${slug}.md`;

function absoluteLink(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const docs = href.match(/^\/docs\/([^#?]+?)\/?([#?].*)?$/);
  if (docs) return `${markdownUrl(docs[1])}${docs[2] ?? ""}`;
  return `${SITE_URL}${href}`;
}

function screenshotUrl(src: string): string {
  const name = src.match(/^\/screenshots\/([\w-]+)\.webp$/)?.[1];
  const shot = name ? screenshots[name] : undefined;
  if (!name || !shot) return absoluteLink(src);
  const width = shot.widths.includes(1280) ? 1280 : shot.widths[shot.widths.length - 1];
  return `${SITE_URL}/_img/${name}.${shot.hash}.${width}.webp`;
}

function decodeEntities(text: string): string {
  return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}

/** The inline HTML the notes use, as markdown. */
function inlineHtmlToMarkdown(html: string): string {
  return decodeEntities(
    html
      .replace(/<(b|strong)>(.*?)<\/\1>/g, "**$2**")
      .replace(/<(i|em)>(.*?)<\/\1>/g, "*$2*")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<br\s*\/?>/g, " "),
  );
}

function attributes(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([\w-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

/** Turns a docs file's body into the markdown served to AI tools. */
export function toAgentMarkdown(content: string): string {
  const out: string[] = [];
  let fence: string | null = null;

  for (const line of content.replace(/\r\n?/g, "\n").split("\n")) {
    const fenceMark = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (fence) {
      out.push(line);
      if (fenceMark && fenceMark[0] === fence[0] && fenceMark.length >= fence.length) fence = null;
      continue;
    }
    if (fenceMark) {
      fence = fenceMark;
      // ```tree is the site's file-tree block; to everyone else it is text.
      out.push(line.replace(/^(\s*(?:`{3,}|~{3,}))tree\s*$/, "$1text"));
      continue;
    }

    const img = line.match(/^\s*(<img\s[^>]*>)\s*$/);
    if (img) {
      const a = attributes(img[1]);
      if ((a.class ?? "").includes("theme-dark-only")) continue;
      out.push(`![${a.alt ?? ""}](${screenshotUrl(a.src ?? "")})`);
      continue;
    }

    const note = line.match(/^\s*<div class="[^"]*">(.*)<\/div>\s*$/);
    out.push(note ? `> ${rewriteLinks(inlineHtmlToMarkdown(note[1]))}` : rewriteLinks(line));
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/** Makes the site links in a line absolute. Code spans are left alone, so an example such as `[x](/path)` stays as written. */
function rewriteLinks(line: string): string {
  return line
    .split(/(`[^`]*`)/)
    .map((part) =>
      part.startsWith("`") ? part : part.replace(/\]\((\/[^)\s]*)\)/g, (_, href) => `](${absoluteLink(href)})`),
    )
    .join("");
}

function editionLabel(doc: Pick<DocMeta, "edition">): string {
  if (doc.edition === "full") return " (Bulwark only, not Lite)";
  if (doc.edition === "lite") return " (Bulwark Lite only)";
  return "";
}

/** One docs page as markdown: its body, with the description and edition note under the title. */
export function docPageMarkdown(slug: string): string | null {
  const source = getDocSource(slug);
  const meta = getAllDocs().find((d) => d.slug === slug);
  if (!source || !meta) return null;

  const intro = [`Source: ${SITE_URL}/docs/${slug}`];
  if (meta.description) intro.push(`> ${meta.description}`);
  if (meta.edition !== "both" && meta.editionNote) {
    intro.push(`**${meta.edition === "full" ? "Not in Lite." : "Bulwark Lite."}** ${meta.editionNote}`);
  }

  const body = toAgentMarkdown(source.content);
  const h1 = body.match(/^# .*$/m);
  if (!h1 || h1.index === undefined) return `# ${meta.title}\n\n${intro.join("\n\n")}\n\n${body}`;
  const end = h1.index + h1[0].length;
  return `${body.slice(0, end)}\n\n${intro.join("\n\n")}${body.slice(end)}`;
}

function pageList(items: DocMeta[]): string {
  return items
    .map((item) => {
      const indent = item.parent ? "  " : "";
      const note = item.description ? `: ${item.description}` : "";
      return `${indent}- [${item.title}](${markdownUrl(item.slug)})${note}${editionLabel(item)}`;
    })
    .join("\n");
}

/** A docs section as markdown: its intro and its pages. */
export function sectionMarkdown(section: DocSection): string {
  return `# ${section.label}\n\nSource: ${SITE_URL}/docs/${section.slug}\n\n${section.intro}\n\n${pageList(section.items)}\n`;
}

const SUMMARY =
  "Bulwark is an open-source webmail client for Stalwart Mail Server, built on the JMAP protocol. It puts mail, calendar, contacts and files behind one login in the browser, runs on your own servers, and is licensed under the AGPL v3.";

function about(): string {
  return [
    `# Bulwark Webmail`,
    `> ${SUMMARY}`,
    `It ships in two editions. Bulwark is a Node.js service, usually run as the Docker image ghcr.io/bulwarkmail/webmail, with a setup wizard, an admin console and plugins. Bulwark Lite is the same client exported as static files for any web host, with no server process. Bulwark needs Stalwart 0.16.6 or newer; Stalwart 1.0 needs Bulwark ${BULWARK_VERSION} or newer. For an existing IMAP account there is the separate, pre-1.0 Legacy Proxy (${GITHUB_ORG}/legacy-proxy).`,
    `Every docs page below is markdown at the URL shown. The same page as HTML is at that URL without .md. A request for a docs page with \`Accept: text/markdown\` also gets the markdown. All docs in one file: ${SITE_URL}/llms-full.txt`,
  ].join("\n\n");
}

/** /llms.txt, in the format from llmstxt.org: a summary, then sections of links. */
export function llmsTxt(): string {
  const audience = Object.values(AUDIENCE_PAGES)
    .map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.description}`)
    .join("\n");

  const start = [
    audience,
    `- [Which way to run it?](${SITE_URL}/choose): a short quiz that recommends Bulwark or Bulwark Lite`,
    `- [Live demo](${DEMO_URL}): the client on sample data with no mail server behind it; nothing is saved or sent`,
    `- [Source code and releases](${GITHUB_REPO}): the webmail repository, release notes and security advisories`,
  ].join("\n");

  const sections = getDocSections()
    .map((s) => `## ${s.label}\n\n${s.intro}\n\n${pageList(s.items)}`)
    .join("\n\n");

  const optional = [
    `- [Extension directory](${EXTENSIONS_URL}): plugins and themes for Bulwark`,
    `- [Press kit](${SITE_URL}/press): logos, screenshots and a boilerplate description`,
    `- [Brand and design system](${SITE_URL}/brand): the logos and the rules for using them`,
    `- [All Bulwark projects on GitHub](${GITHUB_ORG}): the phone app, the relay for push notifications and other tools`,
    `- [Discord](${DISCORD_URL}): the community chat`,
  ].join("\n");

  return `${about()}\n\n## Start here\n\n${start}\n\n${sections}\n\n## Optional\n\n${optional}\n`;
}

/** /llms-full.txt: the summary, then every docs page in reading order. */
export function llmsFullTxt(): string {
  const pages = getReadingOrder()
    .map((doc) => docPageMarkdown(doc.slug))
    .filter((page): page is string => page !== null);
  return `${about()}\n\n---\n\n${pages.join("\n---\n\n")}`;
}
