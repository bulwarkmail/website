import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, type AppIcon } from "@/components/icons";
import { CodeBlock } from "@/components/code-block";
import { Shot, Tile } from "@/components/ui";
import { ICON } from "@/lib/icon";

// =============================================================================
// Sections shared by the homepage and the audience pages. Each one is a
// heading plus at most one paragraph; nothing sits above a heading.
// =============================================================================

export type LinkSpec = { label: string; href: string };
export type ShotSpec = { name: string; alt: string; url?: string };

/** A link that opens external addresses in a new tab and the site's own with next/link. */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function arrowFor(href: string) {
  return /^https?:\/\//.test(href) ? <ArrowUpRight size={16} {...ICON} /> : <ArrowRight size={16} {...ICON} />;
}

// -----------------------------------------------------------------------------
// Hero on the field: the screenshot leaves it at the right page edge.
// -----------------------------------------------------------------------------
export function PageHero({
  title,
  lead,
  primary,
  secondary,
  shot,
}: {
  title: string;
  lead: ReactNode;
  primary: LinkSpec;
  secondary?: LinkSpec;
  shot: ShotSpec;
}) {
  return (
    <section className="bw-field bw-hero">
      <div className="bw-w">
        <div className="bw-hero-in">
          <div className="bw-hero-text">
            <h1 className="bw-h1">{title}</h1>
            <p className="bw-lead">{lead}</p>
            <div className="bw-btns">
              <SmartLink href={primary.href} className="bw-btn">
                {primary.label} {arrowFor(primary.href)}
              </SmartLink>
              {secondary ? (
                <SmartLink href={secondary.href} className="bw-btn bw-btn-ghost">
                  {secondary.label} {arrowFor(secondary.href)}
                </SmartLink>
              ) : null}
            </div>
          </div>
          <Shot
            name={shot.name}
            alt={shot.alt}
            url={shot.url}
            className="bw-hero-shot"
            sizes="(max-width: 900px) 120vw, 60vw"
            window
            priority
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Text-and-figure row. The figure is a whole screenshot in a browser window,
// or a code block where the subject is config. `flip` puts the figure on the
// left; `band` puts the row on the quiet surface. They are separate on
// purpose: a page has one band, and rows alternate sides.
// -----------------------------------------------------------------------------
export function FeatureRow({
  heading,
  text,
  link,
  shot,
  code,
  flip,
  band,
  id,
}: {
  heading: string;
  text: ReactNode;
  link?: LinkSpec;
  shot?: ShotSpec;
  code?: { code: string; label?: string };
  flip?: boolean;
  band?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={band ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className={`bw-split bw-split-center ${flip ? "bw-split-8-4" : "bw-split-4-8"}`}>
          <div className={flip ? "bw-stack bw-order-last" : "bw-stack"}>
            <h2 className="bw-h2">{heading}</h2>
            <p className="bw-muted">{text}</p>
            {link ? (
              <SmartLink href={link.href} className="bw-tlink">
                {link.label} {arrowFor(link.href)}
              </SmartLink>
            ) : null}
          </div>
          {shot ? (
            <Shot name={shot.name} alt={shot.alt} url={shot.url} window />
          ) : code ? (
            <CodeBlock code={code.code} label={code.label ?? "Copy"} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// A heading and one paragraph, optionally on the band, optionally with links.
// -----------------------------------------------------------------------------
export function TextSection({
  heading,
  text,
  links,
  band,
  id,
}: {
  heading: string;
  text: ReactNode;
  links?: LinkSpec[];
  band?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={band ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className="bw-stack" style={{ maxWidth: 720 }}>
          <h2 className="bw-h2">{heading}</h2>
          <p className="bw-muted">{text}</p>
          {links?.map((l) => (
            <SmartLink key={l.href} href={l.href} className="bw-tlink">
              {l.label} {arrowFor(l.href)}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Shared-edge tiles under a heading.
// -----------------------------------------------------------------------------
export type TileSpec = { title: string; text: ReactNode; href: string; icon?: AppIcon };

export function TileSection({
  heading,
  text,
  tiles,
  columns = 4,
  compact,
  band,
  id,
}: {
  heading: string;
  text?: ReactNode;
  tiles: TileSpec[];
  columns?: 3 | 4;
  compact?: boolean;
  band?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={band ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className="bw-head">
          <h2 className="bw-h2">{heading}</h2>
          {text ? <p>{text}</p> : null}
        </div>
        <div className={columns === 3 ? "bw-tiles bw-tiles-3" : "bw-tiles"}>
          {tiles.map((t) => (
            <Tile key={t.href + t.title} href={t.href} title={t.title} text={t.text} icon={t.icon} compact={compact} />
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Two-column table beside its heading: what each part needs, or what Stalwart
// does next to what Bulwark adds.
// -----------------------------------------------------------------------------
export function TableSection({
  heading,
  text,
  columns,
  rows,
  link,
  band,
  id,
}: {
  heading: string;
  text?: ReactNode;
  columns: [string, string];
  rows: [ReactNode, ReactNode][];
  link?: LinkSpec;
  band?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={band ? "bw-sec bw-band" : "bw-sec"}>
      <div className="bw-w">
        <div className="bw-split bw-split-4-8">
          <div className="bw-head">
            <h2 className="bw-h2">{heading}</h2>
            {text ? <p>{text}</p> : null}
            {link ? (
              <SmartLink href={link.href} className="bw-tlink">
                {link.label} {arrowFor(link.href)}
              </SmartLink>
            ) : null}
          </div>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th scope="col">{columns[0]}</th>
                  <th scope="col">{columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([a, b], i) => (
                  <tr key={i}>
                    <td>{a}</td>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
