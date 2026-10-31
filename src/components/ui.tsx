import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight, type AppIcon } from "@/components/icons";
import { ThemeImage } from "@/components/theme-image";
import Link from "next/link";
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
  /**
   * Show the whole capture inside a flat browser window (title bar with the
   * address below) instead of cropping it into a 16:10 frame.
   */
  window?: boolean;
  /** The address shown in the window bar. */
  url?: string;
};

/** A neutral placeholder host: the page says the client talks to your own server. */
const DEMO_HOST = "mail.example.com";

/**
 * A real product screenshot in a square 1px frame, in the visitor's theme.
 * Plain, the frame sets the aspect ratio and the image is cropped into it.
 * As a window, the frame grows a browser title bar and the capture is shown
 * whole, so the figure reads as the app running rather than a detail of it.
 */
export function Shot({
  name,
  alt,
  pos,
  className,
  priority,
  sizes = "(max-width: 900px) 100vw, 60vw",
  window,
  url = DEMO_HOST,
}: ShotProps) {
  const image = (
    <ThemeImage
      light={`/screenshots/light-${name}.webp`}
      dark={`/screenshots/dark-${name}.webp`}
      alt={alt}
      width={2560}
      height={1440}
      sizes={sizes}
      priority={priority}
    />
  );
  if (window) {
    return (
      <span className={["bw-shot bw-win", className].filter(Boolean).join(" ")}>
        <span className="bw-win-bar" aria-hidden="true">
          <span className="bw-win-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="bw-win-url">{url}</span>
        </span>
        <span className="bw-win-body">{image}</span>
      </span>
    );
  }
  return (
    <span
      className={["bw-shot", className].filter(Boolean).join(" ")}
      style={pos ? ({ "--pos": pos } as CSSProperties) : undefined}
    >
      {image}
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
    <Link href={href} className={className}>
      {body}
    </Link>
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
