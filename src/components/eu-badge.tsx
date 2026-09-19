// The flag of Europe, drawn to match Wikimedia Commons' Flag_of_Europe.svg:
// 3:2, twelve upright five-pointed stars on a circle whose radius is a third
// of the flag's height, each star's points a sixteenth of the height from its
// centre. Colours are the --bw-eu-* tokens in globals.css (#039 and #fc0),
// applied from CSS because SVG fill attributes don't take var().

const H = 20;
const W = 30;
const RING = H / 3;
const STAR = H / 16;

function starPath(cx: number, cy: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? STAR : STAR * 0.382;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return `M${points.join("L")}Z`;
}

const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return starPath(W / 2 + RING * Math.sin(a), H / 2 - RING * Math.cos(a));
}).join("");

export function EuFlag({ height = 16, className }: { height?: number; className?: string }) {
  return (
    <svg
      width={(height * W) / H}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className={["bw-eu-flag", className].filter(Boolean).join(" ")}
    >
      <rect width={W} height={H} className="bw-eu-field" />
      <path d={STARS} className="bw-eu-stars" />
    </svg>
  );
}

/** "Made in the EU" with the flag. Used once, in the footer; see /brand#components. */
export function MadeInEuBadge() {
  return (
    <span className="bw-eu-badge">
      <EuFlag height={14} />
      Made in the EU
    </span>
  );
}
