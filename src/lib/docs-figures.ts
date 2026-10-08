import fs from "fs";
import path from "path";
import type { Element, ElementContent, Root, RootContent } from "hast";

// Diagrams and file trees in the docs. Both are written as plain markdown and
// turned into markup here, as raw nodes that rehype-raw parses afterwards:
//
//   ![alt](/diagrams/name.svg)   the SVG from public/diagrams, inlined so its
//                                colour tokens follow the theme and edition
//   ```tree                      a file tree in the usual box-drawing form,
//                                rendered as a nested list with drawn lines

const DIAGRAM_SRC = /^\/diagrams\/([\w-]+\.svg)$/;
const diagramsDirectory = path.join(process.cwd(), "public", "diagrams");

// Same square icon style as the rest of the site (see lib/icon.ts).
const ICON_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">`;
const FOLDER_ICON = `${ICON_OPEN}<path d="M3 5h6l2 3h10v11H3z"/></svg>`;
const FILE_ICON = `${ICON_OPEN}<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>`;

/** Width of one level of indent in the tree, in px. Matches .bw-tree in globals.css. */
const TREE_INDENT = 27;
/** The same indent in characters of the 13.5px mono font the names are set in. */
const TREE_INDENT_CH = 3.4;

interface TreeEntry {
  name: string;
  note: string;
  depth: number;
  children: TreeEntry[];
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Escapes a comment and turns `code` spans in it into <code>. */
function noteHtml(note: string) {
  return escapeHtml(note).replace(/`([^`]+)`/g, "<code>$1</code>");
}

/**
 * Parses a tree drawn with │ ├── └──. A level is four characters wide, a
 * comment starts at " # ", and a line that holds only a comment continues the
 * comment of the line above.
 */
function parseTree(source: string): TreeEntry[] {
  const roots: TreeEntry[] = [];
  const stack: TreeEntry[] = [];
  let last: TreeEntry | null = null;

  for (const line of source.replace(/\r/g, "").split("\n")) {
    if (!line.trim()) continue;
    const match = line.match(/^((?:[│ ] {3})*)([├└]── )?(.*)$/);
    if (!match) continue;
    const rest = match[3].trim();

    if (rest.startsWith("#")) {
      if (last) last.note = `${last.note} ${rest.replace(/^#\s*/, "")}`.trim();
      continue;
    }

    const [name, ...note] = rest.split(/\s+#\s+/);
    const entry: TreeEntry = {
      name: name.trim(),
      note: note.join(" # ").trim(),
      depth: match[1].length / 4 + (match[2] ? 1 : 0),
      children: [],
    };
    stack.length = Math.min(stack.length, entry.depth);
    const parent = stack[stack.length - 1];
    (parent ? parent.children : roots).push(entry);
    stack.push(entry);
    last = entry;
  }
  return roots;
}

function treeHtml(source: string) {
  const roots = parseTree(source);

  // The comments line up in one column: the widest name that has a comment
  // sets it, and every name is padded out to it.
  let column = 0;
  const measure = (entries: TreeEntry[]) => {
    for (const entry of entries) {
      if (entry.note) column = Math.max(column, entry.name.length + entry.depth * TREE_INDENT_CH);
      measure(entry.children);
    }
  };
  measure(roots);
  column = Math.ceil(column);

  const list = (entries: TreeEntry[]): string =>
    `<ul>${entries
      .map((entry) => {
        const icon = entry.name === "..." ? "" : entry.name.endsWith("/") ? FOLDER_ICON : FILE_ICON;
        const width = entry.note
          ? ` style="min-width:calc(${column}ch + 22px - ${entry.depth * TREE_INDENT}px)"`
          : "";
        const note = entry.note ? `<span class="bw-tree-note">${noteHtml(entry.note)}</span>` : "";
        const children = entry.children.length ? list(entry.children) : "";
        return `<li><div class="bw-tree-row"><span class="bw-tree-name"${width}>${icon}${escapeHtml(entry.name)}</span>${note}</div>${children}</li>`;
      })
      .join("")}</ul>`;

  return `<div class="bw-tree">${list(roots)}</div>`;
}

function diagramHtml(file: string) {
  const svg = fs
    .readFileSync(path.join(diagramsDirectory, file), "utf-8")
    .replace(/^\s*<\?xml[^>]*\?>\s*/, "");
  return `<figure class="bw-diagram">${svg}</figure>`;
}

function isElement(node: RootContent | ElementContent, tagName: string): node is Element {
  return node.type === "element" && node.tagName === tagName;
}

/** Returns the raw HTML that replaces this node, or null to leave it alone. */
function replacement(node: Element): string | null {
  if (node.tagName === "pre") {
    const code = node.children.find((child) => isElement(child, "code"));
    if (!code || !isElement(code, "code")) return null;
    const classes = code.properties.className;
    if (!Array.isArray(classes) || !classes.includes("language-tree")) return null;
    const text = code.children.map((child) => (child.type === "text" ? child.value : "")).join("");
    return treeHtml(text);
  }

  if (node.tagName === "p") {
    const content = node.children.filter((child) => child.type !== "text" || child.value.trim());
    if (content.length !== 1 || !isElement(content[0], "img")) return null;
    const match = String(content[0].properties.src ?? "").match(DIAGRAM_SRC);
    return match ? diagramHtml(match[1]) : null;
  }

  return null;
}

/** Rehype plugin. Has to run before rehype-raw, which parses what it emits. */
export function rehypeFigures() {
  const walk = (parent: Root | Element) => {
    parent.children.forEach((child, index) => {
      if (child.type !== "element") return;
      const html = replacement(child);
      if (html === null) {
        walk(child);
      } else {
        (parent.children as RootContent[])[index] = { type: "raw", value: html };
      }
    });
  };
  return (tree: Root) => walk(tree);
}
