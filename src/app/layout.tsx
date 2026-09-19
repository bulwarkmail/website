import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EditionProvider } from "@/components/edition-provider";
import { OG_IMAGES } from "@/lib/og";

// One family for everything and a mono for code. Hanken Grotesk is a variable
// font, so one file covers 400, 500 and 600.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/branding/favicon/Bulwark%20Favicon.png" type="image/png" />
        {/* Theme and edition are applied before first paint. Theme: the .dark
            class. Edition: data-edition from ?edition= (which also persists
            the choice) or localStorage. The script also owns the SVG favicon
            link (raspberry or Lite teal): React must not render it, or it
            re-inserts the original after hydration. The PNG above is the
            no-JS fallback. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}try{var q=new URLSearchParams(location.search).get('edition');var e=q==='lite'||q==='full'?q:localStorage.getItem('edition');if(q==='lite'||q==='full')localStorage.setItem('edition',q);var lite=e==='lite';document.documentElement.setAttribute('data-edition',lite?'lite':'full');var l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.setAttribute('data-edition-icon','');l.href=lite?'/branding/favicon/Bulwark%20Favicon%20Lite.svg':'/branding/favicon/Bulwark%20Favicon.svg';document.head.appendChild(l)}catch(e){}})()`
          }}
        />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? 'https://umami.bulwarkmail.org/script.js'}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        ) : null}
      </head>
      {/* The font variables sit on <html> because the tokens in globals.css
          resolve them on :root. */}
      <body className="antialiased">
        <ThemeProvider>
          <EditionProvider>{children}</EditionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
