"use client";

import { useEdition } from "@/components/edition-provider";

const COPY = {
  full: {
    text: "This page applies to Bulwark, not Bulwark Lite.",
    action: "Switch to Bulwark",
  },
  lite: {
    text: "This page applies to Bulwark Lite, not the full edition.",
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
      <div className="ed-edition-banner" role="note">
        <span>{copy.text}</span>
        <button type="button" onClick={() => setEdition(pageEdition)}>
          {copy.action}
        </button>
      </div>
    </div>
  );
}
