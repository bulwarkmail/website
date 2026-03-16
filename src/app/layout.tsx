import type { Metadata } from "next";
import { Geist, Geist_Mono, Exo_2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  weight: ["600", "700", "800"],
});

const SITE_URL = "https://bulwarkmail.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bulwark — Modern Webmail Client for Stalwart Mail Server",
    template: "%s — Bulwark",
  },
  description:
    "Bulwark is a modern, open-source webmail client built for Stalwart Mail Server using the JMAP protocol. Self-hosted email, calendar, contacts, and file storage — fast, private, and free.",
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
    title: "Bulwark — Modern Webmail Client for Stalwart Mail Server",
    description:
      "Open-source, self-hosted webmail powered by JMAP. Email, calendar, contacts, and files — all in one modern interface for Stalwart Mail Server.",
    images: [
      {
        url: "/branding/logo-with-lettering/Bulwark Logo with Lettering Dark and Color.png",
        width: 1200,
        height: 630,
        alt: "Bulwark Webmail — Modern Email for Stalwart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulwark — Modern Webmail Client for Stalwart Mail Server",
    description:
      "Open-source, self-hosted webmail powered by JMAP. Email, calendar, contacts, and files for Stalwart Mail Server.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${exo2.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
