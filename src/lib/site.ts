// Facts about the site that several pages, the structured data and the files
// for AI tools (llms.txt, robots.txt) all state. Keep them in one place.

export const SITE_URL = "https://bulwarkmail.org";
export const GITHUB_ORG = "https://github.com/bulwarkmail";
export const GITHUB_REPO = "https://github.com/bulwarkmail/webmail";
export const DEMO_URL = "https://demo.bulwarkmail.org";
export const EXTENSIONS_URL = "https://extensions.bulwarkmail.org/";
export const DISCORD_URL = "https://discord.com/invite/tYCujymGrT";
export const CONTACT_EMAIL = "dev@bulwarkmail.org";
/** The public iPhone beta. The same link is in docs/features/mobile.md. */
export const TESTFLIGHT_URL = "https://testflight.apple.com/join/rumcjNSp";
export const ANDROID_RELEASES = "https://github.com/bulwarkmail/native/releases";

/** The pages written for one kind of reader. Their metadata and llms.txt both read this. */
export const AUDIENCE_PAGES = {
  organisations: {
    path: "/organisations",
    title: "Bulwark for organisations",
    description:
      "Webmail for IT departments, schools, the public sector and hosters that run Stalwart: single sign-on, policies per domain and group, organisation signatures, and a switch that stops third-party traffic.",
  },
  smallBusiness: {
    path: "/small-business",
    title: "Bulwark for small businesses",
    description:
      "Shared mailboxes, shared calendars, signatures and out-of-office replies for a small team on Stalwart, installed as one container. Free under AGPL-3.0.",
  },
  homelab: {
    path: "/homelab",
    title: "Bulwark at home",
    description:
      "Webmail for the Stalwart server in your home lab: one container for amd64 or arm64, Compose next to Stalwart, or Bulwark Lite as static files with no Node process.",
  },
} as const;
