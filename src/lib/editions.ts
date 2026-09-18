// Edition helpers shared by the server-side docs loader and the client
// components (sidebar, search). Kept free of node imports on purpose: docs.ts
// reads the filesystem and must never reach a client bundle.

/** Which edition a page applies to. Front-matter `edition:`; defaults to both. */
export type DocEdition = "full" | "lite" | "both";

export function parseEdition(value: unknown): DocEdition {
  return value === "full" || value === "lite" ? value : "both";
}

/** CSS class that hides a page's entry in the other edition (see globals.css). */
export function editionClass(edition: DocEdition): string {
  if (edition === "full") return "ed-full-only";
  if (edition === "lite") return "ed-lite-only";
  return "";
}

/** The class for a group of pages: hidden only when every member is. */
export function groupEditionClass(editions: DocEdition[]): string {
  if (editions.length === 0) return "";
  if (editions.every((e) => e === "full")) return "ed-full-only";
  if (editions.every((e) => e === "lite")) return "ed-lite-only";
  return "";
}

export function appliesTo(doc: { edition: DocEdition }, edition: "full" | "lite"): boolean {
  return doc.edition === "both" || doc.edition === edition;
}
