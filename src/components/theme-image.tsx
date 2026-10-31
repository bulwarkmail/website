import manifest from "@/generated/screenshots.json";

type Entry = { hash: string; width: number; height: number; widths: number[] };
const images: Record<string, Entry> = manifest.images;

type PictureProps = {
  /** File stem in public/screenshots, e.g. "light-inbox". */
  name: string;
  alt: string;
  className?: string;
  sizes: string;
  /** Above the fold: load at once and first. Otherwise the browser loads it as it scrolls into view. */
  priority?: boolean;
  /** Override the intrinsic size (it only sets the aspect ratio before the image loads). */
  width?: number;
  height?: number;
};

function srcSet(name: string, entry: Entry, ext: "avif" | "webp") {
  return entry.widths.map((w) => `/_img/${name}.${entry.hash}.${w}.${ext} ${w}w`).join(", ");
}

/**
 * A screenshot from the files scripts/build-images.mjs builds: AVIF where the
 * browser takes it, WebP otherwise, each in several widths. They are plain
 * static files, so nothing is encoded while the visitor waits.
 */
export function ScreenshotPicture({ name, alt, className, sizes, priority, width, height }: PictureProps) {
  const entry = images[name];
  const w = width ?? entry?.width;
  const h = height ?? entry?.height;
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : undefined;
  if (!entry) {
    // A screenshot added since the last `npm run images`.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/screenshots/${name}.webp`} alt={alt} className={className} width={w} height={h} loading={loading} decoding="async" />
    );
  }
  const fallback = entry.widths.includes(1280) ? 1280 : entry.widths[entry.widths.length - 1];
  return (
    <picture className="bw-pic">
      <source type="image/avif" srcSet={srcSet(name, entry, "avif")} sizes={sizes} />
      <img
        src={`/_img/${name}.${entry.hash}.${fallback}.webp`}
        srcSet={srcSet(name, entry, "webp")}
        sizes={sizes}
        alt={alt}
        className={className}
        width={w}
        height={h}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}

type ThemeImageProps = Omit<PictureProps, "name"> & {
  /** File stems, e.g. "light-inbox" and "dark-inbox". */
  light: string;
  dark: string;
};

/**
 * Both theme variants, server-rendered; the class on <html> shows one. The
 * hidden one is display:none, so a lazy image there is never fetched.
 */
export function ThemeImage({ light, dark, className, ...rest }: ThemeImageProps) {
  const lightClass = ["theme-light-only", className].filter(Boolean).join(" ");
  const darkClass = ["theme-dark-only", className].filter(Boolean).join(" ");
  return (
    <>
      <ScreenshotPicture name={light} className={lightClass} {...rest} />
      <ScreenshotPicture name={dark} className={darkClass} {...rest} />
    </>
  );
}
