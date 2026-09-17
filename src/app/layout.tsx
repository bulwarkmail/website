import type { Metadata } from "next";
import { Geist, Geist_Mono, Exo_2, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EditionProvider } from "@/components/edition-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    images: [
      {
        url: "/branding/logo-with-lettering/Bulwark Logo with Lettering Dark and Color.png",
        width: 1200,
        height: 630,
        alt: "Bulwark Webmail - JMAP email for Stalwart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulwark - JMAP Webmail Client for Stalwart Mail Server",
    description:
      "Open-source, self-hosted webmail built on JMAP. Email, calendar, contacts, and files for Stalwart Mail Server.",
    images: ["/branding/logo-with-lettering/Bulwark Logo with Lettering Dark and Color.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/branding/favicon/Bulwark%20Favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/branding/favicon/Bulwark%20Favicon.png" type="image/png" />
        {/* Theme and edition are applied before first paint. Theme: the .dark
            class. Edition: data-edition from ?edition= (which also persists
            the choice) or localStorage, plus the matching favicon. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}try{var q=new URLSearchParams(location.search).get('edition');var e=q==='lite'||q==='full'?q:localStorage.getItem('edition');if(q==='lite'||q==='full')localStorage.setItem('edition',q);if(e==='lite'){document.documentElement.setAttribute('data-edition','lite');var l=document.querySelector('link[rel="icon"][type="image/svg+xml"]');if(l)l.href='/branding/favicon/Bulwark%20Favicon%20Lite.svg'}else{document.documentElement.setAttribute('data-edition','full')}}catch(e){}})()`
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${exo2.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <EditionProvider>{children}</EditionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
