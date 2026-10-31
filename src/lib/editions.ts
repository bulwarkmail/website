// Which edition a docs page applies to, for the note at the top of the page
// and the tag in search results. Kept free of node imports on purpose: docs.ts
// reads the filesystem and must never reach a client bundle.

/** Which edition a page applies to. Front-matter `edition:`; defaults to both. */
export type DocEdition = "full" | "lite" | "both";

export function parseEdition(value: unknown): DocEdition {
  return value === "full" || value === "lite" ? value : "both";
}

