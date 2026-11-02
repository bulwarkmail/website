import Link from "next/link";
import { BULWARK_VERSION } from "@/lib/version";

/**
 * Which Bulwark works with which Stalwart, as a two-column table. The full
 * list, with the features later 0.16 releases add, is in the docs under
 * Stalwart setup > Supported versions.
 */
export const STALWART_VERSIONS: [string, string][] = [
  ["0.16.5 or older", "Not supported"],
  ["0.16.6 or a newer 0.16", "Any current release"],
  ["1.0", `${BULWARK_VERSION} or newer`],
];

export function VersionTable({ link = true }: { link?: boolean }) {
  return (
    <>
      <div className="bw-table-wrap" style={{ maxWidth: 520 }}>
        <table className="bw-table">
          <thead>
            <tr>
              <th scope="col">Stalwart</th>
              <th scope="col">Bulwark and Bulwark Lite</th>
            </tr>
          </thead>
          <tbody>
            {STALWART_VERSIONS.map(([stalwart, bulwark]) => (
              <tr key={stalwart}>
                <td>{stalwart}</td>
                <td>{bulwark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {link ? (
        <p>
          What later 0.16 releases add is under{" "}
          <Link href="/docs/getting-started/stalwart-setup#supported-versions">supported versions</Link>.
        </p>
      ) : null}
    </>
  );
}
