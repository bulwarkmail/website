"use client";

import { useEdition } from "@/components/edition-provider";

const COPY = {
  full: {
    lead: "Bulwark only.",
    text: "This page applies to Bulwark and has no counterpart in Bulwark Lite.",
    action: "Switch to Bulwark",
  },
  lite: {
    lead: "Lite only.",
    text: "This page applies to Bulwark Lite and has no counterpart in the full edition.",
    action: "Switch to Lite",
  },
} as const;

/**
 * Shown on a page that exists in one edition only, while the reader has the
 * other edition selected. Server-rendered inside an edition-only wrapper so
 * it is visible without a client round-trip; the button flips the edition.
 */
export function EditionBanner({ pageEdition }: { pageEdition: "full" | "lite" }) {
  const { setEdition } = useEdition();
  const copy = COPY[pageEdition];
  return (
    <div className={pageEdition === "full" ? "ed-lite-only" : "ed-full-only"}>
      <div className="bw-note bw-note-edition" role="note">
        <b>{copy.lead}</b> {copy.text}
        <button type="button" onClick={() => setEdition(pageEdition)}>
          {copy.action}
        </button>
      </div>
    </div>
  );
}
