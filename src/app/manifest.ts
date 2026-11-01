import type { MetadataRoute } from "next";

// The site's web app manifest: the name and icon a browser or OS uses when
// someone saves bulwarkmail.org to their home screen. The colour is the
// brand field the navigation sits on.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bulwark Webmail",
    short_name: "Bulwark",
    description: "Open-source webmail for Stalwart Mail Server, built on JMAP.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#db2d54",
    icons: [
      { src: "/branding/favicon/Bulwark%20Favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/branding/favicon/Bulwark%20Favicon.png", sizes: "1000x1000", type: "image/png" },
    ],
  };
}
