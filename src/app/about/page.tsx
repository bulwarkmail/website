import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TableSection, TextSection } from "@/components/sections";
import { pageMetadata } from "@/lib/og";
import { CONTACT_EMAIL, DISCORD_URL, GITHUB_ORG, GITHUB_REPO } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About and contact",
  description:
    "Who builds Bulwark, how the project is paid for, what it runs for you, and where to send questions, bug reports, security reports and press requests.",
  path: "/about",
});

// The project, not the people: the site names no one (decided 2026-11-01).
// Every fact here is also on the home page, the privacy policy or the
// contributing guide; change them together.

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="bw-link">
    {CONTACT_EMAIL}
  </a>
);

const CONTACTS: [React.ReactNode, React.ReactNode][] = [
  [
    "A bug, or a feature you'd like",
    <>
      An issue on{" "}
      <a href={`${GITHUB_REPO}/issues`} className="bw-link">GitHub</a>, with your Bulwark and Stalwart versions.{" "}
      <Link href="/docs/guides/troubleshooting" className="bw-link">Troubleshooting</Link> may have the answer first.
    </>,
  ],
  [
    "A security vulnerability",
    <>
      A{" "}
      <a href={`${GITHUB_REPO}/security/advisories/new`} className="bw-link">private report on GitHub</a>, never a
      public issue. The{" "}
      <a href="https://github.com/bulwarkmail/.github/blob/main/SECURITY.md" className="bw-link">security policy</a>{" "}
      says what to include.
    </>,
  ],
  [
    "Help with setting it up",
    <>
      The <a href={DISCORD_URL} className="bw-link">Discord server</a>, where users and maintainers answer
    </>,
  ],
  ["Paid support, sponsoring or anything else", mail],
  [
    "Writing about Bulwark",
    <>
      The <Link href="/press" className="bw-link">press kit</Link> has logos, screenshots and facts; questions to{" "}
      {mail}
    </>,
  ],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-hero bw-hero-plain">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">About Bulwark</h1>
              <p className="bw-lead">
                Bulwark is an open-source webmail client for Stalwart Mail Server. It is written and maintained in the
                EU and developed in public on GitHub.
              </p>
            </div>
          </div>
        </section>

        <TextSection
          heading="An open-source project."
          text={
            <>
              The code, the issue tracker, the release notes and the security advisories are public, and the licence
              is the AGPL v3. Anyone can send a change: bug reports, translations and pull requests are welcome, and
              the <Link href="/docs/development/contributing" className="bw-link">contributing guide</Link> says what
              fits. Besides the webmail, the project builds the phone app, the push relay and smaller tools, all
              under <a href={GITHUB_ORG} className="bw-link">github.com/bulwarkmail</a>.
            </>
          }
        />

        <TextSection
          band
          heading="Paid for by sponsors."
          text={
            <>
              Bulwark is free, with no paid edition and no features held back. Sponsors on{" "}
              <a href="https://github.com/sponsors/bulwarkmail" className="bw-link">GitHub Sponsors</a> pay for the
              work, and the release notes in the{" "}
              <Link href="/changelog" className="bw-link">changelog</Link> thank them by name. There is no paid support today; if your
              organisation would want it, write to {mail}.
            </>
          }
        />

        <TextSection
          heading="What the project runs for you."
          text={
            <>
              The software runs on your servers, but a few services come from the project: the push relay for
              phone notifications, the update check, the extension directory and the{" "}
              <a href="https://demo.bulwarkmail.org" className="bw-link">demo</a>. Every server the project
              operates is in Germany, and the{" "}
              <Link href="/docs/legal/privacy" className="bw-link">privacy policy</Link> says what each one sees. One
              switch in Bulwark stops it from contacting any of them.
            </>
          }
        />

        <TableSection
          band
          id="contact"
          heading="Contact."
          text="Pick the channel by what you need. Public channels help the next person with the same question."
          columns={["For", "Where"]}
          rows={CONTACTS}
        />
      </main>
      <Footer />
    </div>
  );
}
