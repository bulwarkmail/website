import Link from "next/link";

const EDITIONS = "/docs/getting-started/editions";

/**
 * "Bulwark (full)", linked to the page that compares the two editions. Used
 * wherever a feature needs the edition that runs as a server, so a reader who
 * hasn't met the word "edition" yet can find out what it means.
 */
export function FullEdition() {
  return (
    <Link href={EDITIONS} className="bw-link">
      Bulwark (full)
    </Link>
  );
}

/** One sentence that says what the two editions are, for the text above a table that uses them. */
export const EDITIONS_NOTE =
  "Bulwark (full) runs as a server, usually one container; Bulwark Lite is the same client as static files, without the admin console, plugins or web push.";

export { EDITIONS as EDITIONS_HREF };
