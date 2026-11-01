import { GITHUB_REPO, SITE_URL } from "@/lib/site";

// RFC 9116. Reports go through GitHub's private vulnerability reporting, the
// same as docs/deployment/security-updates.md says. The file must name an
// expiry date at most a year out; it is set a year after each build, and the
// site is deployed far more often than that.
export const dynamic = "force-static";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function GET() {
  const expires = new Date(Date.now() + YEAR_MS).toISOString().replace(/\.\d{3}Z$/, "Z");
  const body = `Contact: ${GITHUB_REPO}/security/advisories/new
Expires: ${expires}
Policy: https://github.com/bulwarkmail/.github/blob/main/SECURITY.md
Preferred-Languages: en, de
Canonical: ${SITE_URL}/.well-known/security.txt
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
