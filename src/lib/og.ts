/** Open Graph cards, one per edition, rendered by scripts/og.mjs into public/. */
export const OG_IMAGES = {
  full: { url: "/og-full.png", width: 1200, height: 630, alt: "Bulwark - webmail for Stalwart Mail Server" },
  lite: { url: "/og-lite.png", width: 1200, height: 630, alt: "Bulwark Lite - webmail for Stalwart, served as static files" },
} as const;
