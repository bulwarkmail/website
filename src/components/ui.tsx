import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight, type AppIcon } from "@/components/icons";
import { ThemeImage } from "@/components/theme-image";
import { EditionLink } from "@/components/edition-link";
import { ICON } from "@/lib/icon";

type ShotProps = {
  /** File stem under public/screenshots, e.g. "inbox" for light-inbox.webp and dark-inbox.webp. */
  name: string;
  alt: string;
  /** object-position for the crop, e.g. "0 0" or "100% 100%". */
  pos?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * A real product screenshot in a square 1px frame, in the visitor's theme.
 * The frame sets the aspect ratio and the image is cropped into it.
 */
export function Shot({ name, alt, pos, className, priority, sizes = "(max-width: 900px) 100vw, 60vw" }: ShotProps) {
  return (
    <span
      className={["bw-shot", className].filter(Boolean).join(" ")}
      style={pos ? ({ "--pos": pos } as CSSProperties) : undefined}
    >
      <ThemeImage
        light={`/screenshots/light-${name}.webp`}
        dark={`/screenshots/dark-${name}.webp`}
        alt={alt}
        width={2560}
        height={1440}
        sizes={sizes}
        priority={priority}
      />
    </span>
  );
}

type TileProps = {
  href: string;
  title: string;
  text: ReactNode;
  icon?: AppIcon;
  /** The list form: no minimum height, arrow centred. */
  compact?: boolean;
};

/** A shared-edge tile: title top-left, one line of text, arrow bottom-right. */
export function Tile({ href, title, text, icon: Icon, compact }: TileProps) {
  const external = /^https?:\/\//.test(href);
  const className = compact ? "bw-tile bw-tile-compact" : "bw-tile";
  const body = (
    <>
      {Icon ? <Icon size={24} className="bw-tile-icon" {...ICON} /> : null}
      <span className="bw-tile-title">{title}</span>
      <span className="bw-tile-text">{text}</span>
      <span className="bw-tile-arrow">
        {external ? <ArrowUpRight size={20} {...ICON} /> : <ArrowRight size={20} {...ICON} />}
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <EditionLink href={href} className={className}>
      {body}
    </EditionLink>
  );
}

/** Copy that differs between Bulwark and Bulwark Lite. Both are rendered; data-edition on <html> shows one. */
export function Ed({ full, lite }: { full: ReactNode; lite: ReactNode }) {
  return (
    <>
      <span className="ed-full-only">{full}</span>
      <span className="ed-lite-only">{lite}</span>
    </>
  );
}
