import type { CSSProperties } from "react";

export type LogoAsset = {
  title: string;
  /** Public URLs of the two files. */
  svg: string;
  png?: string;
  /** The ground the file is drawn for. Fixed per file, so it does not follow the theme. */
  ground: "white" | "light" | "ink" | "field";
  /** Rendered height of the preview in px. */
  height: number;
};

const GROUNDS: Record<LogoAsset["ground"], CSSProperties> = {
  white: { background: "#ffffff" },
  light: { background: "#f4f4f5" },
  ink: { background: "#18181b" },
  field: { background: "var(--bw-field)" },
};

/** A logo file on the ground it was drawn for, with its download links. Used by /brand and /press. */
export function LogoTile({ asset }: { asset: LogoAsset }) {
  return (
    <div className="bw-tile bw-logo-tile">
      <span className="bw-logo-stage" style={GROUNDS[asset.ground]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.svg}
          alt=""
          style={{ maxHeight: asset.height, maxWidth: "70%", width: "auto", height: "auto" }}
        />
      </span>
      <span className="bw-tile-title">{asset.title}</span>
      <span className="bw-tile-text">
        <a className="bw-link" href={asset.svg} download>
          SVG
        </a>
        {asset.png ? (
          <a className="bw-link" href={asset.png} download>
            PNG
          </a>
        ) : null}
      </span>
    </div>
  );
}
