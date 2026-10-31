import type { Element, Root, RootContent } from "hast";
import manifest from "@/generated/screenshots.json";

// Screenshots in the docs are written as plain <img> tags pointing at the
// 5120 px originals in public/screenshots. This swaps each for the sized AVIF
// and WebP files scripts/build-images.mjs builds, loaded lazily: the hidden
// theme's copy (display:none) is then never fetched at all.

type Entry = { hash: string; width: number; height: number; widths: number[] };
const images: Record<string, Entry> = manifest.images;

const SCREENSHOT_SRC = /^\/screenshots\/([\w-]+)\.webp$/;
/** The docs column is at most 820px wide (.bw-docs-article). */
const SIZES = "(max-width: 900px) 100vw, 820px";

function srcSet(name: string, entry: Entry, ext: string) {
  return entry.widths.map((w) => `/_img/${name}.${entry.hash}.${w}.${ext} ${w}w`).join(", ");
}

function picture(img: Element): Element | null {
  const src = img.properties?.src;
  const match = typeof src === "string" ? src.match(SCREENSHOT_SRC) : null;
  const entry = match ? images[match[1]] : undefined;
  if (!match || !entry) return null;
  const name = match[1];
  const fallback = entry.widths.includes(1280) ? 1280 : entry.widths[entry.widths.length - 1];
  return {
    type: "element",
    tagName: "picture",
    properties: { className: ["bw-pic"] },
    children: [
      {
        type: "element",
        tagName: "source",
        properties: { type: "image/avif", srcSet: srcSet(name, entry, "avif"), sizes: SIZES },
        children: [],
      },
      {
        ...img,
        properties: {
          ...img.properties,
          src: `/_img/${name}.${entry.hash}.${fallback}.webp`,
          srcSet: srcSet(name, entry, "webp"),
          sizes: SIZES,
          loading: "lazy",
          decoding: "async",
        },
      },
    ],
  };
}

/** Runs after rehype-raw, so the <img> tags written in the markdown are elements. */
export function rehypeScreenshots() {
  const walk = (parent: Root | Element) => {
    parent.children.forEach((child, index) => {
      if (child.type !== "element") return;
      if (child.tagName === "img") {
        const replaced = picture(child);
        if (replaced) (parent.children as RootContent[])[index] = replaced;
        return;
      }
      if (child.tagName !== "picture") walk(child);
    });
  };
  return (tree: Root) => walk(tree);
}
