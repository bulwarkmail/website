import dates from "@/generated/doc-dates.json";

// When each docs page last changed, from scripts/doc-dates.mjs. Empty in a
// shallow clone, and then the pages show no date rather than a wrong one.
const DOC_DATES: Record<string, string> = dates;

/** The ISO date of the last commit that changed a docs page, if known. */
export function docUpdated(slug: string): string | undefined {
  return DOC_DATES[slug];
}

/** "1 November 2026". UTC, so the build machine's time zone can't move the day. */
export function formatDocDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
