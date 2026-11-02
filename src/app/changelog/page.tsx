import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ICON } from "@/lib/icon";
import { pageMetadata } from "@/lib/og";
import { fetchReleases, formatReleaseDate, releaseHtml, RELEASES_URL, type Release } from "@/lib/releases";
import { GITHUB_REPO, SITE_URL } from "@/lib/site";
import { SOFTWARE_ID } from "@/lib/structured-data";

// Every release of the webmail, from GitHub, so the current version and its
// notes are on the project's own site. Rebuilt at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Every release of Bulwark Webmail and Bulwark Lite, newest first: the current version, what changed in each release, and where security fixes are announced.",
  path: "/changelog",
  markdown: "/changelog.md",
});

export default async function ChangelogPage() {
  const releases = await fetchReleases();
  const current = releases[0];
  const rendered = await Promise.all(releases.map(async (r) => ({ ...r, html: await releaseHtml(r.body) })));

  return (
    <div className="min-h-screen">
      {current ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": SOFTWARE_ID,
            name: "Bulwark Webmail",
            softwareVersion: current.version,
            datePublished: current.date,
            releaseNotes: `${SITE_URL}/changelog`,
          }}
        />
      ) : null}
      <Navbar />
      <main>
        <section className="bw-field bw-hero bw-hero-plain">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">Changelog</h1>
              <p className="bw-lead">
                {current ? (
                  <>
                    The current version is <strong>{current.version}</strong>, released on{" "}
                    {formatReleaseDate(current.date)}. Bulwark and Bulwark Lite share the version number and the
                    notes below.
                  </>
                ) : (
                  <>The release notes for every version of Bulwark and Bulwark Lite are on GitHub.</>
                )}
              </p>
              <div className="bw-btns">
                <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="bw-btn">
                  Releases on GitHub <ArrowUpRight size={16} {...ICON} />
                </a>
                <Link href="/docs/deployment/updating" className="bw-btn bw-btn-ghost">
                  How to update
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bw-sec">
          <div className="bw-w">
            <div className="prose-docs" style={{ maxWidth: 820 }}>
              <p>
                Security fixes are in the release notes and in the{" "}
                <a href={`${GITHUB_REPO}/security/advisories`}>security advisories</a>; the{" "}
                <Link href="/docs/deployment/security-updates">security updates</Link> page says how to hear about
                them. Beta releases are left out here.
              </p>
            </div>
            <div className="bw-faq bw-changelog" style={{ maxWidth: 820, marginTop: 24 }}>
              {rendered.map((release, i) => (
                <ReleaseEntry key={release.version} release={release} open={i === 0} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ReleaseEntry({ release, open }: { release: Release & { html: string }; open: boolean }) {
  return (
    <details open={open} id={`v${release.version}`}>
      <summary>
        <h2 className="bw-changelog-h">
          {release.version} <time dateTime={release.date}>{formatReleaseDate(release.date)}</time>
        </h2>
        <Plus size={18} {...ICON} />
      </summary>
      <div className="prose-docs bw-changelog-body" dangerouslySetInnerHTML={{ __html: release.html }} />
      <p>
        <a href={release.url} target="_blank" rel="noopener noreferrer" className="bw-link">
          {release.version} on GitHub, with the downloads
        </a>
      </p>
    </details>
  );
}
