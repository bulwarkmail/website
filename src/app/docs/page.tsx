import Link from "next/link";
import { getDocSections } from "@/lib/docs";
import type { Metadata } from "next";
import { InstallQuickstart } from "@/components/docs/install-quickstart";
import { Tile } from "@/components/ui";
import { BULWARK_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: "Documentation - Bulwark Webmail for Stalwart",
  description:
    "Documentation for Bulwark, the open-source JMAP webmail client for Stalwart Mail Server: installation, configuration, features, and Docker deployment.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  const sections = getDocSections();

  return (
    <div className="bw-docs-wide prose-docs">
      <h1>Documentation</h1>
      <p>
        Three steps take you from a Stalwart server to a working inbox in about five minutes. The rest of the manual is
        reference: configuration, features, deployment and the extension API.
      </p>

      {/* The numbers are a real sequence. */}
      <h2 id="start-here">Start here</h2>
      <ol className="bw-steps" style={{ maxWidth: 760 }}>
        <li>
          <span className="bw-steps-n">1</span>
          <div>
            <strong>Have Stalwart running.</strong> Stalwart is the mail server: 0.16.6 or newer, or 1.0 from Bulwark{" "}
            {BULWARK_VERSION} on. The{" "}
            <Link href="/docs/getting-started/stalwart-setup">Stalwart setup</Link> page covers
            installing it first.
          </div>
        </li>
        <li>
          <span className="bw-steps-n">2</span>
          <div>
            <strong>Run the container.</strong> Docker is the only requirement. There is nothing to clone and no{" "}
            <code>.env</code> file to write first.
            <InstallQuickstart />
          </div>
        </li>
        <li>
          <span className="bw-steps-n">3</span>
          <div>
            <strong>Open the setup link.</strong> <code>docker logs bulwark</code> prints a link with a one-time
            setup token, valid for an hour. The setup wizard checks your JMAP server, chooses OAuth or password
            sign-in, generates a session secret and sets the admin password. The{" "}
            <Link href="/docs/getting-started/configuration">configuration</Link> and{" "}
            <Link href="/docs/getting-started/configuration/authentication">authentication</Link> pages cover each
            screen.
          </div>
        </li>
      </ol>
      <p>
        Bulwark Lite has no container and no wizard: download the zip from a{" "}
        <a href="https://github.com/bulwarkmail/webmail/releases/latest">release</a>, set <code>jmapServerUrl</code> in{" "}
        <code>config.json</code>, upload the folder to any web host and allow CORS in Stalwart. The{" "}
        <Link href="/docs/getting-started/lite">Lite guide</Link> has the details.
      </p>

      <h2 id="install-paths">Choose how to install</h2>
      <div className="bw-tiles bw-tiles-3" style={{ marginTop: 16 }}>
        <Tile
          href="/docs/deployment/docker"
          title="Docker"
          text="One container and a setup wizard. The route for most installs."
        />
        <Tile
          href="/docs/getting-started/lite"
          title="Bulwark Lite"
          text="The same client as static files, uploaded to any web host."
        />
        <Tile
          href="/docs/deployment/manual"
          title="Manual install"
          text="A standalone tarball or your own build, run under systemd or PM2."
        />
      </div>

      <h2 id="manual">Browse the manual</h2>
      <div className="bw-manual" style={{ marginTop: 16 }}>
        {sections.map((section) => (
          <div key={section.slug}>
            <h3 style={{ margin: 0 }}>{section.label}</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: "none" }}>
              {section.items.map((item) => (
                <li key={item.slug} style={{ padding: 0 }}>
                  <Link href={`/docs/${item.slug}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
