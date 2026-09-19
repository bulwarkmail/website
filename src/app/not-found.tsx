import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionLink } from "@/components/edition-link";
import { Tile } from "@/components/ui";
import { ICON } from "@/lib/icon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-hero bw-hero-plain">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">This page does not exist.</h1>
              <p className="bw-lead">
                Error 404. The address may be mistyped, or the page may have moved when the docs were reorganised.
              </p>
              <div className="bw-btns">
                <EditionLink href="/" className="bw-btn">
                  Go to the home page <ArrowRight size={16} {...ICON} />
                </EditionLink>
                <EditionLink href="/docs" className="bw-btn bw-btn-ghost">
                  Open the docs <ArrowRight size={16} {...ICON} />
                </EditionLink>
              </div>
            </div>
          </div>
        </section>

        <section className="bw-sec">
          <div className="bw-w">
            <div className="bw-head">
              <h2 className="bw-h2">Pages people look for most.</h2>
            </div>
            <div className="bw-tiles">
              <Tile href="/" title="Home" text="What Bulwark is and how to install it." />
              <Tile href="/docs" title="Documentation" text="Configuration, features and deployment." />
              <Tile href="/docs/deployment/static" title="Static hosting" text="The Bulwark Lite guide." />
              <Tile
                href="https://github.com/bulwarkmail/webmail/issues"
                title="Issues on GitHub"
                text="Report a broken link or a bug."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
