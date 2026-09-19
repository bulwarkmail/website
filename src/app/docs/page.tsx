import Link from "next/link";
import { editionClass, getDocSections, groupEditionClass } from "@/lib/docs";
import type { Metadata } from "next";
import { InstallQuickstart } from "@/components/docs/install-quickstart";
import { Ed, Tile } from "@/components/ui";

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
        <Ed
          full="Three steps take you from nothing to a working inbox in about five minutes. The rest of the manual is reference: configuration, features, deployment and the extension API."
          lite="This is the Bulwark Lite manual. Three steps put the client on a web host, and pages that only apply to the full edition are hidden."
        />
      </p>

      {/* The numbers are a real sequence, one list per edition. */}
      <h2 id="start-here">Start here</h2>
      <div className="ed-full-only">
        <ol className="bw-steps" style={{ maxWidth: 760 }}>
          <li>
            <span className="bw-steps-n">1</span>
            <div>
              <strong>Run the container.</strong> Docker is the only requirement. There is nothing to clone and no{" "}
              <code>.env</code> file to write first.
              <InstallQuickstart />
            </div>
          </li>
          <li>
            <span className="bw-steps-n">2</span>
            <div>
              <strong>
                Open <code>localhost:3000</code>.
              </strong>{" "}
              The setup wizard finds your JMAP server, chooses OAuth or password sign-in, generates a session secret
              and sets the admin password. The{" "}
              <Link href="/docs/getting-started/configuration">configuration</Link> and{" "}
              <Link href="/docs/getting-started/configuration/authentication">authentication</Link> pages cover each
              screen.
            </div>
          </li>
          <li>
            <span className="bw-steps-n">3</span>
            <div>
              <strong>Point it at Stalwart.</strong> Stalwart is the mail server. The{" "}
              <Link href="/docs/getting-started/configuration/stalwart-setup">Stalwart setup</Link> page covers
              installing it first.
            </div>
          </li>
        </ol>
      </div>
      <div className="ed-lite-only">
        <ol className="bw-steps" style={{ maxWidth: 760 }}>
          <li>
            <span className="bw-steps-n">1</span>
            <div>
              <strong>Download the zip.</strong> Every{" "}
              <a href="https://github.com/bulwarkmail/webmail/releases/latest">release</a> attaches{" "}
              <code>bulwark-lite-&lt;version&gt;.zip</code>: a folder of HTML, JavaScript and one JSON file.
            </div>
          </li>
          <li>
            <span className="bw-steps-n">2</span>
            <div>
              <strong>
                Edit <code>config.json</code>.
              </strong>{" "}
              Set <code>jmapServerUrl</code> to your Stalwart server, and <code>appName</code> if you like. The file is
              read at runtime, so later edits need no rebuild.
            </div>
          </li>
          <li>
            <span className="bw-steps-n">3</span>
            <div>
              <strong>Upload it and allow CORS.</strong> Put the folder on any static host and set{" "}
              <code>http.permissive-cors = true</code> in Stalwart. Host snippets for nginx, Caddy, Netlify,
              Cloudflare Pages and GitHub Pages are on the{" "}
              <Link href="/docs/deployment/static">static hosting</Link> page.
            </div>
          </li>
        </ol>
      </div>

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
        {sections.map((section) => {
          const sectionClass = groupEditionClass(section.items.map((i) => i.edition));
          return (
            <div key={section.slug} className={sectionClass || undefined}>
              <h3 style={{ margin: 0 }}>{section.label}</h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: "none" }}>
                {section.items.map((item) => (
                  <li key={item.slug} className={editionClass(item.edition) || undefined} style={{ padding: 0 }}>
                    <Link href={`/docs/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
