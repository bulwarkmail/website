/** Open Graph cards, one per edition, rendered by scripts/og.mjs into public/. */
export const OG_IMAGES = {
  full: { url: "/og-full.png", width: 1200, height: 630, alt: "Bulwark - webmail built for the 21st century" },
  lite: { url: "/og-lite.png", width: 1200, height: 630, alt: "Bulwark Lite - the same webmail, no server to run" },
} as const;
