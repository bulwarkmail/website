import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { OG_IMAGES } from "@/lib/og";

// One family for everything and a mono for code. Hanken Grotesk (OFL) is a
// variable font, so one file per subset covers 400, 500 and 600. The files are
// the latin and latin-ext subsets Google Fonts serves.
const hanken = localFont({
  src: "./fonts/hanken-grotesk-latin.woff2",
  variable: "--font-hanken",
  weight: "100 900",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

// The font's ascent (1.0em) is far above its tallest Latin glyph (0.71em).
// In a heading set at 1.06 that extra ascent makes each line's selection box
// reach into the line above and hide its descenders. Headings use this copy,
// which reports a smaller ascent, and globals.css moves them back down by the
// baseline shift that causes. It is the same file, so it loads only once.
const hankenHeading = localFont({
  src: "./fonts/hanken-grotesk-latin.woff2",
  variable: "--font-hanken-heading",
  weight: "100 900",
  display: "swap",
  declarations: [
    { prop: "ascent-override", value: "80%" },
    { prop: "descent-override", value: "30%" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

// Listed before the latin face in the font stack: its unicode-range keeps it
// from loading for Latin text, and the latin face's metric-matched fallback
// still comes last.
const hankenExt = localFont({
  src: "./fonts/hanken-grotesk-latin-ext.woff2",
  variable: "--font-hanken-ext",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://bulwarkmail.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bulwark - JMAP Webmail Client for Stalwart Mail Server",
    template: "%s - Bulwark",
  },
  description:
    "Bulwark is an open-source webmail client for Stalwart Mail Server, built on the JMAP protocol. Self-hosted email, calendar, contacts, and file storage in one interface, free under the AGPL.",
  keywords: [
    "Stalwart",
    "Stalwart Mail Server",
    "webmail",
    "JMAP",
    "JMAP client",
    "self-hosted email",
    "open source webmail",
    "Bulwark",
    "Bulwark webmail",
    "email client",
    "self-hosted webmail",
    "mail server",
    "calendar",
    "contacts",
    "file storage",
    "Next.js webmail",
    "Docker mail",
    "privacy email",
    "AGPL",
  ],
  authors: [{ name: "Bulwark Mail", url: SITE_URL }],
  creator: "Bulwark Mail",
  publisher: "Bulwark Mail",
  applicationName: "Bulwark Webmail",
  alternates: {
    canonical: "/",
  },
  // The PNG is the fallback for browsers without SVG favicons.
  icons: {
    icon: [
      { url: "/branding/favicon/Bulwark%20Favicon.png", type: "image/png" },
      { url: "/branding/favicon/Bulwark%20Favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Bulwark Webmail",
    title: "Bulwark - JMAP Webmail Client for Stalwart Mail Server",
    description:
      "Open-source, self-hosted webmail built on JMAP. Email, calendar, contacts, and files in one interface for Stalwart Mail Server.",
    images: [OG_IMAGES.full],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulwark - JMAP Webmail Client for Stalwart Mail Server",
    description:
      "Open-source, self-hosted webmail built on JMAP. Email, calendar, contacts, and files for Stalwart Mail Server.",
    images: [OG_IMAGES.full.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// The browser chrome takes the colour of the navigation field (--bw-field).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#db2d54" },
    { media: "(prefers-color-scheme: dark)", color: "#c4264b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${hankenHeading.variable} ${hankenExt.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* The theme is applied before first paint: the .dark class. The script
            also drops the "edition" key an older version of the site stored. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}try{localStorage.removeItem('edition')}catch(e){}})()`
          }}
        />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? 'https://umami.bulwarkmail.org/script.js'}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            data-do-not-track="true"
          />
        ) : null}
      </head>
      {/* The font variables sit on <html> because the tokens in globals.css
          resolve them on :root. */}
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
