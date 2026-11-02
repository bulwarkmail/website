import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionQuiz } from "@/components/edition-quiz";
import { TableSection } from "@/components/sections";
import { FullEdition } from "@/components/edition-link";
import { pageMetadata } from "@/lib/og";

export const metadata: Metadata = pageMetadata({
  title: "Which Bulwark fits you?",
  description:
    "A few quick questions about your mail, where you'd put it and how people log in, and a recommendation between Bulwark and Bulwark Lite.",
  path: "/choose",
});

// The quiz runs in the browser. The table under it gives the same answers as
// plain HTML, for readers without JavaScript and for search engines and AI
// tools. It follows the rules in lib/edition-quiz.ts; change both together.
const SHORT_ANSWER: [React.ReactNode, React.ReactNode][] = [
  [
    "You only have a simple website host, or want no program to keep running",
    <>
      <Link href="/docs/getting-started/lite" className="bw-link">Bulwark Lite</Link>: upload a folder of files
    </>,
  ],
  [
    "You want Stalwart to serve the webmail itself",
    <>
      Bulwark Lite,{" "}
      <Link href="/docs/deployment/stalwart-app" className="bw-link">installed on Stalwart</Link>
    </>,
  ],
  [
    "You need add-ons, an admin page, the same settings on every device, office editing or new-mail notifications",
    <><FullEdition />: they only come with it</>,
  ],
  [
    "People sign in through single sign-on",
    <><FullEdition />, or Bulwark Lite when Stalwart serves it</>,
  ],
  [
    "Someone else runs your Stalwart server",
    <><FullEdition />. Lite would need them to change a setting on their server</>,
  ],
  [
    "You don't have a mail server yet",
    <>
      <Link href="/docs/getting-started/stalwart-setup" className="bw-link">Set up Stalwart</Link> first, then
      either edition
    </>,
  ],
  [
    "Your mail server isn't Stalwart",
    <>
      Bulwark through the{" "}
      <a href="https://github.com/bulwarkmail/legacy-proxy" className="bw-link">Legacy Proxy</a>, which is
      pre-1.0, or a classic webmail such as{" "}
      <a href="https://roundcube.net" className="bw-link">Roundcube</a>
    </>,
  ],
];

export default function ChoosePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-quiz-hero">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">Which Bulwark fits you?</h1>
              <p className="bw-lead">
                A few quick questions about your mail, where you&apos;d put it and how people log in. It takes
                about a minute.
              </p>
            </div>
          </div>
        </section>

        <section className="bw-quiz-sec">
          <div className="bw-w">
            <noscript>
              <p>The quiz needs JavaScript. The table below gives the same answers.</p>
            </noscript>
            <EditionQuiz />
          </div>
        </section>

        <TableSection
          band
          id="short-answer"
          heading="The short answer."
          text={
            <>
              Find the first row that fits you. Both editions are the same client, and the mail stays in Stalwart
              either way, so you can switch later.{" "}
              <Link href="/docs/getting-started/editions" className="bw-link">Editions</Link> compares them
              feature by feature.
            </>
          }
          columns={["If", "Choose"]}
          rows={SHORT_ANSWER}
        />
      </main>
      <Footer />
    </div>
  );
}
