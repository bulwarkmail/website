import type { Metadata } from "next";

/** The Open Graph card, rendered by scripts/og.mjs in bulwarkmail/branding and copied into public/. */
export const OG_IMAGES = {
  full: { url: "/og-full.png", width: 1200, height: 630, alt: "Bulwark - webmail for Stalwart Mail Server" },
} as const;

type OgImage = { url: string; width: number; height: number; alt: string };

/**
 * A page's title, description, canonical URL and link previews. A page that
 * sets openGraph replaces the layout's whole openGraph object rather than
 * merging with it, so a page without its own got the home page's title and
 * URL in previews. Every page sets all of it through this.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGES.full,
  type = "website",
  markdown,
}: {
  title: string;
  description: string;
  path: string;
  image?: OgImage;
  type?: "website" | "article";
  /** The path of the page's markdown copy, for <link rel="alternate" type="text/markdown">. */
  markdown?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, ...(markdown ? { types: { "text/markdown": markdown } } : {}) },
    openGraph: {
      type,
      locale: "en_US",
      siteName: "Bulwark Webmail",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
