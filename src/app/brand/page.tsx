import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Contact,
  Copy,
  Folder,
  Mail,
  Search,
  Settings,
  TriangleAlert,
} from "@/components/icons";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionLink } from "@/components/edition-link";
import { EditionSwitch } from "@/components/edition-switch";
import { CodeBlock } from "@/components/code-block";
import { LogoTile, type LogoAsset } from "@/components/logo-tile";
import { Tile } from "@/components/ui";
import { ICON } from "@/lib/icon";

export const metadata: Metadata = {
  title: "Brand and design system",
  description:
    "The Bulwark logos and the rules for using them, and the design system of the Bulwark website: principles, colour, type, layout, components and writing.",
  alternates: { canonical: "/brand" },
};

const BRANDING_REPO = "https://github.com/bulwarkmail/branding";
const asset = (dir: string, name: string) => `/branding/${dir}/${encodeURIComponent(name)}`;

const MARKS: LogoAsset[] = [
  { title: "Mark, colour", svg: asset("logo", "Bulwark Logo Color.svg"), png: asset("logo", "Bulwark Logo Color.png"), ground: "white", height: 72 },
  { title: "Mark, colour, on a dark ground", svg: asset("logo", "Bulwark Logo Color.svg"), png: asset("logo", "Bulwark Logo Color.png"), ground: "ink", height: 72 },
  { title: "Mark, dark", svg: asset("logo", "Bulwark Logo Dark.svg"), png: asset("logo", "Bulwark Logo Dark.png"), ground: "light", height: 72 },
  { title: "Mark, white", svg: asset("logo", "Bulwark Logo White.svg"), png: asset("logo", "Bulwark Logo White.png"), ground: "field", height: 72 },
];
const LOCKUPS: LogoAsset[] = [
  {
    title: "Lockup, dark lettering",
    svg: asset("logo-with-lettering", "Bulwark Logo with Lettering Dark Color.svg"),
    png: asset("logo-with-lettering", "Bulwark Logo with Lettering Dark and Color.png"),
    ground: "light",
    height: 56,
  },
  {
    title: "Lockup, white lettering",
    svg: asset("logo-with-lettering", "Bulwark Logo with Lettering White and Color.svg"),
    png: asset("logo-with-lettering", "Bulwark Logo with Lettering White and Color.png"),
    ground: "ink",
    height: 56,
  },
  { title: "Favicon, Bulwark", svg: asset("favicon", "Bulwark Favicon.svg"), png: asset("favicon", "Bulwark Favicon.png"), ground: "white", height: 56 },
  { title: "Favicon, Bulwark Lite", svg: asset("favicon", "Bulwark Favicon Lite.svg"), ground: "white", height: 56 },
];

const SECTIONS = [
  ["logo", "Logo"],
  ["principles", "Principles"],
  ["colour", "Colour"],
  ["type", "Type"],
  ["layout", "Layout"],
  ["shape", "Shape and motion"],
  ["components", "Components"],
  ["lite", "Bulwark Lite"],
  ["writing", "Writing"],
] as const;

// Kept in step with the token block at the top of globals.css. The chip shows
// the live token, the hex columns show every theme and edition.
const COLOURS: { role: string; token: string; light: string; dark: string; liteLight: string; liteDark: string; use: string }[] = [
  { role: "Page", token: "--bw-page", light: "#ffffff", dark: "#131315", liteLight: "#ffffff", liteDark: "#131315", use: "Page ground" },
  { role: "Surface", token: "--bw-surface", light: "#f4f4f5", dark: "#1f1f22", liteLight: "#f4f4f5", liteDark: "#1f1f22", use: "Quiet bands, footer, code blocks, notes, tile hover" },
  { role: "Text", token: "--bw-text", light: "#18181b", dark: "#f2f2f3", liteLight: "#18181b", liteDark: "#f2f2f3", use: "Headings and body" },
  { role: "Muted text", token: "--bw-text-muted", light: "#56565d", dark: "#ababb2", liteLight: "#56565d", liteDark: "#ababb2", use: "Supporting paragraphs, captions" },
  { role: "Rule", token: "--bw-rule", light: "#dddde1", dark: "#36363b", liteLight: "#dddde1", liteDark: "#36363b", use: "Tile edges, table rows, image frames" },
  { role: "Control border", token: "--bw-control", light: "#7f7f87", dark: "#85858d", liteLight: "#7f7f87", liteDark: "#85858d", use: "Inputs, outlined buttons, the edition switch" },
  { role: "Brand", token: "--bw-brand", light: "#db2d54", dark: "#db2d54", liteLight: "#0f8578", liteDark: "#0f8578", use: "Primary buttons, icons, the mark, note and active edges" },
  { role: "Field", token: "--bw-field", light: "#db2d54", dark: "#c4264b", liteLight: "#0f8578", liteDark: "#0c7267", use: "Nav, hero, install section" },
  { role: "On field", token: "--bw-on-field", light: "#ffffff", dark: "#ffffff", liteLight: "#ffffff", liteDark: "#ffffff", use: "Text and buttons on the field" },
  { role: "Link", token: "--bw-link", light: "#c01f46", dark: "#ff91a8", liteLight: "#0a6b60", liteDark: "#6fd3c5", use: "Text links and the focus ring" },
  { role: "Ink", token: "--bw-ink", light: "#18181b", dark: "#18181b", liteLight: "#18181b", liteDark: "#18181b", use: "Code and button hover on the field" },
  { role: "Error", token: "--bw-error", light: "#b42318", dark: "#ff9b8f", liteLight: "#b42318", liteDark: "#ff9b8f", use: "Validation, with an icon and words" },
  { role: "Warning", token: "--bw-warning", light: "#8a5d00", dark: "#e2b341", liteLight: "#8a5d00", liteDark: "#e2b341", use: "The warning note edge" },
  { role: "Success", token: "--bw-success", light: "#17784a", dark: "#4cc38a", liteLight: "#17784a", liteDark: "#4cc38a", use: "The copied state" },
];

// WCAG 2.1 ratios for the token pairs the pages rely on.
const CONTRAST: [string, string, string, string, string, string][] = [
  ["Text on page", "4.5", "17.7", "16.6", "17.7", "16.6"],
  ["Text on surface", "4.5", "16.1", "14.7", "16.1", "14.7"],
  ["Muted on page", "4.5", "7.3", "8.1", "7.3", "8.1"],
  ["Muted on surface", "4.5", "6.6", "7.2", "6.6", "7.2"],
  ["Link on page", "4.5", "6.0", "8.7", "6.4", "10.4"],
  ["Link on surface", "4.5", "5.4", "7.7", "5.8", "9.2"],
  ["Button text on brand", "4.5", "4.65", "4.65", "4.52", "4.52"],
  ["Text on the field", "4.5", "4.65", "5.6", "4.52", "5.8"],
  ["Ink text on the white field button", "4.5", "17.7", "17.7", "17.7", "17.7"],
  ["Code on ink", "4.5", "15.8", "15.8", "15.8", "15.8"],
  ["Control border on page", "3", "4.0", "5.1", "4.0", "5.1"],
  ["Focus ring on page", "3", "6.0", "8.7", "6.4", "10.4"],
  ["Error text on page", "4.5", "6.6", "9.1", "6.6", "9.1"],
];

const TYPE: { name: string; spec: string; sample: string; style: React.CSSProperties }[] = [
  { name: "Display", spec: "60 / 36 px · 400 · 1.06 · -0.015em", sample: "Webmail for Stalwart", style: { fontSize: "var(--bw-h1)", lineHeight: 1.06, letterSpacing: "-0.015em" } },
  { name: "Heading 2", spec: "40 / 28 px · 400 · 1.12 · -0.015em", sample: "Two editions from the same code.", style: { fontSize: "var(--bw-h2)", lineHeight: 1.12, letterSpacing: "-0.015em" } },
  { name: "Heading 3, tile title", spec: "21 / 19 px · 400 · 1.2 · -0.015em", sample: "Bulwark Legacy Proxy", style: { fontSize: "var(--bw-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" } },
  { name: "Lead", spec: "19 / 17 px · 400 · 1.45", sample: "Bulwark puts mail, calendar, contacts and files in one browser client.", style: { fontSize: "var(--bw-lead)", lineHeight: 1.45, color: "var(--bw-text-muted)" } },
  { name: "Body", spec: "17 / 16 px · 400 · 1.55", sample: "The setup wizard finds your Stalwart server and sets the admin password.", style: { fontSize: "var(--bw-body)" } },
  { name: "Small, tile text", spec: "15 px · 400 · 1.5", sample: "Several address books, groups, and vCard import and export.", style: { fontSize: "var(--bw-small)", color: "var(--bw-text-muted)" } },
  { name: "Button, label, table header", spec: "15 px · 500 · 1.2", sample: "Read the docs", style: { fontSize: "var(--bw-small)", fontWeight: 500 } },
  { name: "Caption, footer, breadcrumb", spec: "13.5 px · 400 · 1.5", sample: "Docs / Deployment", style: { fontSize: "var(--bw-caption)", color: "var(--bw-text-muted)" } },
  { name: "Code", spec: "13.5 px · 400 · 1.65 · JetBrains Mono", sample: "docker run -d -p 3000:3000", style: { fontFamily: "var(--bw-mono)", fontSize: "var(--bw-code)" } },
];

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 80, 120];

/** One guide entry: name and rule on the left, live examples on the right. `wide` stacks them, for tables that need the full width. */
function Guide({ title, text, wide, children }: { title: string; text: React.ReactNode; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className="bw-guide" style={wide ? { gridTemplateColumns: "minmax(0, 1fr)" } : undefined}>
      <div>
        <h3 className="bw-h3">{title}</h3>
        <p>{text}</p>
      </div>
      <div className="bw-guide-body">{children}</div>
    </div>
  );
}

function Hex({ value }: { value: string }) {
  return (
    <td>
      <span className="bw-chip" style={{ background: value }} />
      <code className="bw-icode">{value}</code>
    </td>
  );
}

export default function BrandPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-hero bw-hero-plain">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">Brand and design system</h1>
              <p className="bw-lead">
                The Bulwark logos and the rules for using them, followed by the system this website is built with:
                principles, colour, type, layout, components and writing.
              </p>
              <div className="bw-btns">
                <a href={BRANDING_REPO} target="_blank" rel="noopener noreferrer" className="bw-btn">
                  Branding repository <ArrowUpRight size={16} {...ICON} />
                </a>
                <EditionLink href="/press" className="bw-btn bw-btn-ghost">
                  Press kit <ArrowRight size={16} {...ICON} />
                </EditionLink>
              </div>
            </div>
          </div>
        </section>

        <div className="bw-w">
          <nav className="bw-subnav" aria-label="Sections of this page">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* ------------------------------------------------------------ Logo */}
        <section id="logo" className="bw-sec">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">The mark comes in three colours, each for its own ground.</h2>
              <p>
                Source files and further formats are in the{" "}
                <a className="bw-link" href={BRANDING_REPO} target="_blank" rel="noopener noreferrer">
                  branding repository
                </a>
                . The geometry of the mark and the name are fixed.
              </p>
            </div>
            <div className="bw-tiles">
              {MARKS.map((a) => (
                <LogoTile key={a.title} asset={a} />
              ))}
              {LOCKUPS.map((a) => (
                <LogoTile key={a.title} asset={a} />
              ))}
            </div>

            <div className="bw-split bw-split-4-8" style={{ marginTop: "var(--bw-section)" }}>
              <h2 className="bw-h2">Rules for using the logo</h2>
              <ol className="bw-rules">
                <li>
                  <b>Keep clear space.</b> Leave room around the logo and keep other elements out of it.
                </li>
                <li>
                  <b>Keep it legible.</b> The mark is never smaller than 24 × 24 pixels.
                </li>
                <li>
                  <b>Leave it as it is.</b> The logo is never stretched, rotated or recoloured, and it takes no
                  shadow, glow or outline.
                </li>
                <li>
                  <b>Match the ground.</b> The colour mark works on light and dark neutral grounds, the dark mark on
                  light grounds, and the white mark on dark grounds and on the field.
                </li>
                <li>
                  <b>Pick the right format.</b> SVG on the web, PNG where vector files are not supported.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Principles */}
        <section id="principles" className="bw-sec bw-band">
          <div className="bw-w">
            <div className="bw-split bw-split-4-8">
              <div className="bw-head">
                <h2 className="bw-h2">Six things make a page recognisably Bulwark.</h2>
                <p>The test for any new page: take the logo away and ask whether it could still only be Bulwark.</p>
              </div>
              <ol className="bw-rules">
                <li>
                  <b>One flat field.</b> The nav and the hero share a single raspberry field, the screenshot leaves it
                  at the right edge of the page, and the field returns once for install.
                </li>
                <li>
                  <b>One family at regular weight.</b> Hanken Grotesk 400 for headings and body. Hierarchy comes from
                  size and position. 500 is for buttons and table headers, 600 for the wordmark.
                </li>
                <li>
                  <b>Square, with shared edges.</b> Tiles meet on 1px rules with the title top-left and the arrow
                  bottom-right. Radius is 0, and 2px on the things you press or type into.
                </li>
                <li>
                  <b>The product is the picture.</b> Real screenshots in a 1px frame, cropped where that helps, in the
                  theme the visitor is using.
                </li>
                <li>
                  <b>Colour is an area.</b> Raspberry is the field and a few small marks: primary buttons, icons,
                  links, the edge of a note.
                </li>
                <li>
                  <b>Plain sentences.</b> A heading says what the thing is or does, with at most one paragraph under
                  it and no label above it.
                </li>
              </ol>
            </div>

            <div className="bw-split bw-split-4-8" style={{ marginTop: "var(--bw-section)" }}>
              <h2 className="bw-h2">Three habits bring the generic look back.</h2>
              <ol className="bw-rules">
                <li>
                  <b>A heavier headline.</b> Weight above 500, tracking tighter than -0.02em, a size above 72, or an
                  accent on one word.
                </li>
                <li>
                  <b>A label.</b> An eyebrow above a heading, a caption above a screenshot, a step numeral used as
                  decoration, or anything in uppercase monospace.
                </li>
                <li>
                  <b>Softening.</b> A radius above 4px, a shadow under a screenshot, a gradient inside the field, or a
                  dark section between two light ones.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- Colour */}
        <section id="colour" className="bw-sec">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Colour is assigned by role.</h2>
              <p>
                Components read tokens, never hex values. The grounds are neutral grey, so the only colour on a page
                is the brand itself.
              </p>
            </div>

            <Guide
              wide
              title="Tokens"
              text="Fourteen roles as CSS custom properties. Dark changes the grounds, and Bulwark Lite changes brand, field and link."
            >
              <div className="bw-table-wrap">
                <table className="bw-table bw-table-tokens">
                  <thead>
                    <tr>
                      <th scope="col">Role</th>
                      <th scope="col">Token</th>
                      <th scope="col">Light</th>
                      <th scope="col">Dark</th>
                      <th scope="col">Lite, light</th>
                      <th scope="col">Lite, dark</th>
                      <th scope="col">Used for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COLOURS.map((c) => (
                      <tr key={c.token}>
                        <td>{c.role}</td>
                        <td>
                          <code className="bw-icode">{c.token}</code>
                        </td>
                        <Hex value={c.light} />
                        <Hex value={c.dark} />
                        <Hex value={c.liteLight} />
                        <Hex value={c.liteDark} />
                        <td>{c.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Guide>

            <Guide
              title="Contrast"
              text="WCAG 2.1 ratios for every pair the pages rely on. Text needs 4.5:1, borders and focus rings 3:1."
            >
              <div className="bw-table-wrap">
                <table className="bw-table bw-table-num">
                  <thead>
                    <tr>
                      <th scope="col">Pair</th>
                      <th scope="col">Minimum</th>
                      <th scope="col">Light</th>
                      <th scope="col">Dark</th>
                      <th scope="col">Lite, light</th>
                      <th scope="col">Lite, dark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTRAST.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) => (
                          <td key={i}>{i === 0 ? cell : `${cell}:1`}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="bw-muted" style={{ fontSize: "var(--bw-small)", maxWidth: "46em" }}>
                White on raspberry and white on teal are the tight pairs. Text on the field is therefore never smaller
                than 17px, never lighter than 400 and never muted, and raspberry itself is never used for text on a
                grey ground. Raspberry is close to an error red, so errors and warnings have their own colours and
                always carry an icon and words.
              </p>
            </Guide>
          </div>
        </section>

        {/* ------------------------------------------------------------ Type */}
        <section id="type" className="bw-sec bw-band">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Hanken Grotesk sets everything except code.</h2>
              <p>
                Both families are open source and self-hosted through next/font, so the site makes no third-party
                requests. Sizes are desktop / phone.
              </p>
            </div>
            <div className="bw-typescale">
              {TYPE.map((t) => (
                <div key={t.name}>
                  <div>
                    <span style={{ fontWeight: 500, fontSize: "var(--bw-small)" }}>{t.name}</span>
                    <small>{t.spec}</small>
                  </div>
                  <div style={t.style}>{t.sample}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- Layout */}
        <section id="layout" className="bw-sec">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Pages sit on a 12-column grid with an 8px unit.</h2>
            </div>
            <Guide
              title="Spacing"
              text="An 8px unit with a 4px half step. Section padding is 120 on desktop, 96 on a tablet and 64 on a phone."
            >
              <div className="bw-spacebars">
                {SPACE.map((n) => (
                  <div key={n}>
                    <i style={{ width: n }} />
                    {n}
                  </div>
                ))}
              </div>
            </Guide>
            <Guide
              title="Grid"
              text="12 columns inside 1120px with 32px gaps. The page gutter is 80px, 40px on a tablet and 20px on a phone. Splits are 5 + 7, 4 + 8, 7 + 5 and 6 + 6, and they stack below 900px."
            >
              <div className="bw-griddemo" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i}>{i + 1}</i>
                ))}
              </div>
            </Guide>
            <Guide
              title="Screenshots"
              text="From public/screenshots, in a 1px frame, cropped with object-position. They bleed off the field or sit flush in a row. Nothing is drawn, generated or staged, and nothing sits above them as a caption."
            >
              <p className="bw-muted" style={{ fontSize: "var(--bw-small)" }}>
                The landing page hero and its three feature rows show the pattern.{" "}
                <EditionLink href="/" className="bw-link">
                  Open the landing page
                </EditionLink>
                .
              </p>
            </Guide>
          </div>
        </section>

        {/* ----------------------------------------------------------- Shape */}
        <section id="shape" className="bw-sec bw-band">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Everything is square, flat and still.</h2>
            </div>
            <Guide
              title="Border and radius"
              text="1px rules in the rule colour, 1px control borders, a 3px edge on notes. Radius is 0, and 2px on buttons, inputs, inline code and the edition switch. There are no shadows, gradients or blurs."
            >
              <div className="bw-ex">
                <span className="bw-box" style={{ background: "var(--bw-page)" }}>1px rule</span>
                <span className="bw-box" style={{ background: "var(--bw-page)", borderColor: "var(--bw-control)" }}>1px control</span>
                <span className="bw-box" style={{ background: "var(--bw-page)", border: 0, borderLeft: "3px solid var(--bw-brand)" }}>3px note edge</span>
                <span className="bw-box" style={{ background: "var(--bw-page)", borderColor: "var(--bw-control)", borderRadius: 2 }}>radius 2px</span>
              </div>
            </Guide>
            <Guide title="Focus ring" text="2px solid in the link colour, offset 2px. On the field the ring is white.">
              <div className="bw-ex">
                <span className="bw-btn bw-focus-demo">Focused button</span>
                <span className="bw-link bw-focus-demo">Focused link</span>
              </div>
              <div className="bw-ex bw-ex-field bw-field">
                <span className="bw-btn bw-focus-demo">Focused on the field</span>
              </div>
            </Guide>
            <Guide
              title="Motion"
              text="Colour and border changes take 120ms with ease-out. Nothing moves, fades in or scrolls into place, and with reduced motion the changes are instant."
            >
              <div className="bw-ex">
                <span className="bw-btn" tabIndex={0}>
                  Hover me <ArrowRight size={16} {...ICON} />
                </span>
                <span className="bw-btn bw-btn-ghost" tabIndex={0}>
                  Hover me <ArrowRight size={16} {...ICON} />
                </span>
              </div>
            </Guide>
            <Guide
              title="Icons"
              text="Lucide on a 24px grid with a 1.5px stroke, square caps and mitred joins. Sizes are 16, 20 and 24px, in the text colour or the brand colour, never inside a filled circle."
            >
              <div className="bw-ex" style={{ gap: 20 }}>
                {[Mail, Calendar, Contact, Folder, Search, Settings, Copy, ArrowRight].map((Icon, i) => (
                  <Icon key={i} size={24} {...ICON} />
                ))}
                <span style={{ width: 1, height: 24, background: "var(--bw-rule)" }} />
                <Mail size={16} {...ICON} />
                <Mail size={20} {...ICON} />
                <Mail size={24} {...ICON} style={{ color: "var(--bw-brand)" }} />
              </div>
            </Guide>
          </div>
        </section>

        {/* ------------------------------------------------------ Components */}
        <section id="components" className="bw-sec">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">The pages are built from a small set of components.</h2>
              <p>They are live here: the theme toggle and the edition switch in the nav change them too.</p>
            </div>

            <Guide
              title="Buttons"
              text="Primary is a brand fill, secondary an outline. On the field both turn white. One arrow, on the right, when the button goes somewhere. Every control in the nav is 36px high."
            >
              <div className="bw-ex">
                <span className="bw-btn" tabIndex={0}>
                  Read the docs <ArrowRight size={16} {...ICON} />
                </span>
                <span className="bw-btn bw-btn-ghost" tabIndex={0}>
                  View source <ArrowUpRight size={16} {...ICON} />
                </span>
                <span className="bw-btn bw-btn-sm" tabIndex={0}>
                  Get started <ArrowRight size={16} {...ICON} />
                </span>
              </div>
              <div className="bw-ex bw-ex-field bw-field">
                <span className="bw-btn" tabIndex={0}>
                  Read the docs <ArrowRight size={16} {...ICON} />
                </span>
                <span className="bw-btn bw-btn-ghost" tabIndex={0}>
                  View source <ArrowUpRight size={16} {...ICON} />
                </span>
              </div>
            </Guide>

            <Guide
              title="Links"
              text="Inline links are underlined in the link colour. A standalone link carries an arrow. Visited links keep their colour."
            >
              <p>
                Every <span className="bw-link">release</span> attaches the Lite zip, and the{" "}
                <span className="bw-link">editions table</span> lists the differences.
              </p>
              <span className="bw-tlink" style={{ justifySelf: "start" }}>
                Calendar features <ArrowRight size={16} {...ICON} />
              </span>
            </Guide>

            <Guide
              title="Edition switch"
              text="A two-part segmented control. The active side is filled with the text colour, and on the field it is filled white. The install section uses the wide form with full labels."
            >
              <div className="bw-ex">
                <EditionSwitch />
                <EditionSwitch wide />
              </div>
              <div className="bw-ex bw-ex-field bw-field">
                <EditionSwitch />
              </div>
            </Guide>

            <Guide
              title="Tiles"
              text="Tiles share their edges. Title top-left, one line of text, arrow bottom-right, an optional brand-coloured icon above the title. Hover fills the tile with the surface colour. The list form has no minimum height."
            >
              <div className="bw-tiles">
                <Tile href="/docs/features/email" icon={Mail} title="Mail" text="Threaded conversations and a unified inbox." />
                <Tile href="/docs/features/calendar" icon={Calendar} title="Calendar" text="Month, week, day and agenda views." />
                <Tile href="https://github.com/bulwarkmail/relay" title="Bulwark Relay" text="Turns JMAP push into phone notifications." />
                <Tile href="https://extensions.bulwarkmail.org/" title="Bulwark Extensions" text="Reviewed plugins and themes." />
              </div>
              <div className="bw-tiles bw-tiles-1" style={{ maxWidth: 440 }}>
                <Tile compact href="https://rbm.systems" title="RBM Systems" text="rbm.systems" />
                <Tile compact href="https://github.com/sponsors/bulwarkmail" title="Your organisation" text="Sponsor Bulwark on GitHub" />
              </div>
            </Guide>

            <Guide
              title="Fact row and steps"
              text="Facts are four unboxed columns: a brand icon, a title, one line. Numbered steps are used only for a real sequence, such as an install."
            >
              <div className="bw-facts">
                {[
                  { icon: Mail, title: "Open source", text: "AGPL-3.0, developed in public." },
                  { icon: Calendar, title: "Built on JMAP", text: "The client fetches only the difference." },
                  { icon: Contact, title: "27 languages", text: "Translated by the people who use it." },
                  { icon: Folder, title: "Built in the EU", text: "Runs on your hardware." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title}>
                    <Icon size={24} {...ICON} />
                    <h4 className="bw-h3">{title}</h4>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <ol className="bw-steps" style={{ maxWidth: 640 }}>
                <li>
                  <span className="bw-steps-n">1</span>
                  <div>Run the container.</div>
                </li>
                <li>
                  <span className="bw-steps-n">2</span>
                  <div>
                    Open <code className="bw-icode">http://localhost:3000</code> and follow the setup wizard.
                  </div>
                </li>
              </ol>
            </Guide>

            <Guide
              title="Tables"
              text="A strong rule under the header, light rules between rows, no vertical rules and no zebra. Wide tables scroll inside their own container."
            >
              <div className="bw-table-wrap">
                <table className="bw-table">
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Default</th>
                      <th scope="col">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code className="bw-icode">appName</code>
                      </td>
                      <td>Bulwark Webmail</td>
                      <td>Name in the tab, on the login page and in the manifest</td>
                    </tr>
                    <tr>
                      <td>
                        <code className="bw-icode">jmapServerUrl</code>
                      </td>
                      <td>empty</td>
                      <td>Your mail server</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Guide>

            <Guide
              title="Code"
              text="Blocks sit on the surface colour with a copy button. On the field they are ink. Strings take the link colour and comments the muted colour. Monospace appears nowhere except code."
            >
              <CodeBlock prompt code="docker run -d -p 3000:3000 ghcr.io/bulwarkmail/webmail:latest" label="Copy the command" />
              <div className="bw-ex-field bw-field">
                <CodeBlock prompt code="docker run -d -p 3000:3000 ghcr.io/bulwarkmail/webmail:latest" label="Copy the command" />
              </div>
              <p>
                Inline: set <code className="bw-icode">jmapServerUrl</code> in <code className="bw-icode">config.json</code>.
              </p>
            </Guide>

            <Guide
              title="Notes"
              text="One shape, three kinds, told apart by their first words and the colour of the edge."
            >
              <div>
                <div className="bw-note bw-note-edition">
                  <b>Not in Lite.</b> OAuth, settings sync and plugins need the Node.js server, so Lite keeps them
                  switched off.
                </div>
                <div className="bw-note">
                  <b>Note.</b> The base path is written into every asset URL, so choose it before the build.
                </div>
                <div className="bw-note bw-note-warning" style={{ marginBottom: 0 }}>
                  <b>Warning.</b> The build deletes the server-only folders in place. Run it in a disposable checkout.
                </div>
              </div>
            </Guide>

            <Guide
              title="Search dialog"
              text="Opens over the docs with the slash key. Results are grouped by section, the active row carries the surface colour and a brand edge, and the match is marked."
            >
              <div className="bw-ex-stage">
                <div className="bw-search-panel bw-search" style={{ position: "static", padding: 0 }}>
                  <div className="bw-search-input">
                    <Search size={20} {...ICON} />
                    <input type="text" defaultValue="cors" aria-label="Example search field" id="brand-search-example" />
                    <kbd className="bw-kbd">Esc</kbd>
                  </div>
                  <div className="bw-search-group">Deployment</div>
                  <div className="bw-search-row" data-active="true">
                    <b>Static hosting</b>
                    <span>
                      Allow the browser to reach the mail server: permissive-<mark>cors</mark> = true
                    </span>
                  </div>
                  <div className="bw-search-row">
                    <b>Reverse proxy</b>
                    <span>
                      An equivalent rule that allows your Lite origin with <mark>CORS</mark> headers
                    </span>
                  </div>
                  <div className="bw-search-foot">
                    <span>
                      <kbd className="bw-kbd">↑</kbd>
                      <kbd className="bw-kbd">↓</kbd> to move
                    </span>
                    <span>
                      <kbd className="bw-kbd">Enter</kbd> to open
                    </span>
                    <span>2 results</span>
                  </div>
                </div>
              </div>
            </Guide>

            <Guide
              title="Form fields"
              text="Label above, help below, a 1px control border and the focus ring. An error thickens the border, adds an icon and says how to fix it."
            >
              <div className="bw-form">
                <div className="bw-form-field">
                  <label className="bw-label" htmlFor="brand-f-server">
                    Mail server address
                  </label>
                  <input className="bw-input" id="brand-f-server" type="url" defaultValue="https://mail.example.com" />
                  <p className="bw-help">The JMAP endpoint of your Stalwart server.</p>
                </div>
                <div className="bw-form-field">
                  <label className="bw-label" htmlFor="brand-f-mail">
                    Work email
                  </label>
                  <input
                    className="bw-input"
                    id="brand-f-mail"
                    type="email"
                    defaultValue="sam@example"
                    aria-invalid="true"
                    aria-describedby="brand-f-mail-error"
                  />
                  <p className="bw-help bw-help-error" id="brand-f-mail-error">
                    <TriangleAlert size={16} {...ICON} />
                    Enter a full address, for example sam@example.com.
                  </p>
                </div>
                <div className="bw-form-field">
                  <label className="bw-label" htmlFor="brand-f-edition">
                    Edition
                  </label>
                  <select className="bw-input" id="brand-f-edition" defaultValue="Bulwark">
                    <option>Bulwark</option>
                    <option>Bulwark Lite</option>
                  </select>
                </div>
                <div className="bw-form-field" style={{ alignContent: "end" }}>
                  <label className="bw-check" htmlFor="brand-f-notes">
                    <input type="checkbox" id="brand-f-notes" defaultChecked /> Send me release notes
                  </label>
                </div>
              </div>
            </Guide>
          </div>
        </section>

        {/* ------------------------------------------------------------ Lite */}
        <section id="lite" className="bw-sec bw-band">
          <div className="bw-w">
            <div className="bw-split bw-split-4-8">
              <div className="bw-head">
                <h2 className="bw-h2">Bulwark Lite is the same page in teal.</h2>
                <p>Use the switch to see this page as Lite.</p>
                <EditionSwitch wide />
              </div>
              <ol className="bw-rules">
                <li>
                  <b>Four tokens change.</b> Brand, field, link and focus turn teal. Every neutral, the layout, the
                  type and the radius stay as they are.
                </li>
                <li>
                  <b>The mark keeps its geometry.</b> It takes the brand token on a page ground and white on the field,
                  so one asset serves Bulwark, Lite and the field. Lite has its own favicon.
                </li>
                <li>
                  <b>Copy is written per edition.</b> Where the facts differ, both versions are rendered and the
                  edition shows one. Pages that exist in one edition say so in a note.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- Writing */}
        <section id="writing" className="bw-sec">
          <div className="bw-w">
            <div className="bw-split bw-split-4-8">
              <div className="bw-head">
                <h2 className="bw-h2">Headings say what the thing is or does.</h2>
                <p>Sentence case throughout, and the facts come first.</p>
              </div>
              <ul className="bw-rules">
                <li>
                  <b>One positive sentence.</b> &ldquo;Webmail for Stalwart Mail Server.&rdquo; &ldquo;Run Bulwark as
                  one container.&rdquo; &ldquo;Files sit on the mail server, next to your mail.&rdquo;
                </li>
                <li>
                  <b>One paragraph at most.</b> A section is a heading, up to one paragraph, and up to one link or
                  button.
                </li>
                <li>
                  <b>Two labels a page at most.</b> A label is small text above a heading. Most pages have none, and
                  the docs have the breadcrumb.
                </li>
                <li>
                  <b>Questions belong to the FAQ.</b> Headings elsewhere are statements, and they say something about
                  Bulwark rather than about another product.
                </li>
                <li>
                  <b>Controls say what happens.</b> &ldquo;Copy the command&rdquo;, then &ldquo;Copied&rdquo;. An error
                  says what went wrong and how to fix it.
                </li>
              </ul>
            </div>

            <div className="bw-split bw-split-4-8" style={{ marginTop: "var(--bw-section)" }}>
              <h2 className="bw-h2">Checks before a page ships</h2>
              <ul className="bw-rules">
                <li>Count the labels above headings. Two at most, and none is better.</li>
                <li>Read every heading aloud and rewrite any that sets something up in order to knock it down.</li>
                <li>Measure every radius: 0, or 2px on a control.</li>
                <li>Check light and dark, Bulwark and Lite, then a 390px phone.</li>
                <li>Recheck the contrast table when a colour changes.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
