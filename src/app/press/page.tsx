import { ArrowRight, ArrowUpRight } from "@/components/icons";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionLink } from "@/components/edition-link";
import { CopyButton } from "@/components/copy-button";
import { Shot } from "@/components/ui";
import { LogoTile, type LogoAsset } from "@/components/logo-tile";
import { ICON } from "@/lib/icon";

export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Logos, screenshots and facts for writing about Bulwark Webmail and Bulwark Lite, the open-source JMAP webmail client for Stalwart Mail Server.",
  alternates: { canonical: "/press" },
};

const PRESS_FOLDER = "https://github.com/bulwarkmail/website/tree/main/public/press";

// Kept in step with public/press/README.md.
const BOILERPLATE =
  "Bulwark is an open-source webmail client for Stalwart Mail Server, built in TypeScript on Next.js and the JMAP protocol. It puts mail, calendar, contacts and file storage behind one login, threads and searches on the server, and installs as a progressive web app. It ships in two editions: Bulwark, a Node.js service with a setup wizard, admin console and plugins, and Bulwark Lite, the same client exported as static files for any web host. It is licensed under the AGPL v3 and built in the EU.";

const logo = (name: string) => `/press/logos/${encodeURIComponent(name)}`;

const LOGOS: LogoAsset[] = [
  { title: "Mark, colour", svg: logo("Bulwark Logo Color.svg"), png: logo("Bulwark Logo Color.png"), ground: "white", height: 72 },
  { title: "Mark, white on the field", svg: logo("Bulwark Logo White.svg"), png: logo("Bulwark Logo White.png"), ground: "field", height: 72 },
  {
    title: "Lockup, dark lettering",
    svg: logo("Bulwark Logo with Lettering Dark Color.svg"),
    png: logo("Bulwark Logo with Lettering Dark and Color.png"),
    ground: "light",
    height: 56,
  },
  {
    title: "Lockup, white lettering",
    svg: logo("Bulwark Logo with Lettering White and Color.svg"),
    png: logo("Bulwark Logo with Lettering White and Color.png"),
    ground: "ink",
    height: 56,
  },
];

const SHOTS = [
  { name: "inbox", title: "Inbox with the reading pane" },
  { name: "composer", title: "Composer" },
  { name: "calendar", title: "Calendar, month view" },
  { name: "files", title: "Files" },
];

const FACTS: [string, React.ReactNode][] = [
  ["Name", "Bulwark Webmail (editions: Bulwark, Bulwark Lite)"],
  ["Website", "bulwarkmail.org"],
  ["Source", "github.com/bulwarkmail/webmail"],
  ["Licence", "GNU AGPL v3"],
  ["Mail server", "Stalwart Mail Server, over JMAP"],
  ["Social cards", <><a className="bw-link" href="/og-full.png">Bulwark</a>, <a className="bw-link" href="/og-lite.png">Bulwark Lite</a> (1200 × 630 PNG)</>],
  ["Contact", <a key="mail" className="bw-link" href="mailto:dev@bulwarkmail.org">dev@bulwarkmail.org</a>],
];

export default function PressPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-hero bw-hero-plain">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">Press kit</h1>
              <p className="bw-lead">
                Logos, screenshots and facts for writing about Bulwark Webmail and Bulwark Lite. Everything here may be
                used as it is.
              </p>
              <div className="bw-btns">
                <a href={PRESS_FOLDER} target="_blank" rel="noopener noreferrer" className="bw-btn">
                  Open the press folder <ArrowUpRight size={16} {...ICON} />
                </a>
                <EditionLink href="/brand" className="bw-btn bw-btn-ghost">
                  Brand and design system <ArrowRight size={16} {...ICON} />
                </EditionLink>
              </div>
            </div>
          </div>
        </section>

        <section className="bw-sec">
          <div className="bw-w">
            <div className="bw-split bw-split-4-8">
              <div className="bw-head">
                <h2 className="bw-h2">About Bulwark</h2>
                <p>Copy this paragraph as it is, or shorten it.</p>
              </div>
              <div className="bw-stack" style={{ gap: 24 }}>
                <p style={{ fontSize: "1.125em", lineHeight: 1.6, maxWidth: "44em" }}>{BOILERPLATE}</p>
                <CopyButton text={BOILERPLATE} label="Copy the paragraph" />
              </div>
            </div>
          </div>
        </section>

        <section className="bw-sec" style={{ paddingTop: 0 }}>
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Logos</h2>
              <p>Please use the files as they are: no recolouring, stretching or effects.</p>
            </div>
            <div className="bw-tiles">
              {LOGOS.map((asset) => (
                <LogoTile key={asset.title} asset={asset} />
              ))}
            </div>
          </div>
        </section>

        <section className="bw-sec bw-band">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Screenshots</h2>
              <p>Captured from the demo fixtures in light and dark, so no real mail is shown.</p>
            </div>
            <div className="bw-shots">
              {SHOTS.map((s) => (
                <figure key={s.name}>
                  <Shot name={s.name} alt={s.title} sizes="(max-width: 640px) 100vw, 50vw" />
                  <figcaption>
                    <span>{s.title}</span>
                    <a className="bw-link" href={`/screenshots/light-${s.name}.webp`} download>
                      Light
                    </a>
                    <a className="bw-link" href={`/screenshots/dark-${s.name}.webp`} download>
                      Dark
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bw-sec">
          <div className="bw-w">
            <div className="bw-split bw-split-4-8">
              <h2 className="bw-h2">Facts</h2>
              <dl className="bw-deflist">
                {FACTS.map(([term, value]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
