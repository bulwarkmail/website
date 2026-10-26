import { ArrowRight } from "@/components/icons";
import { EditionLink } from "@/components/edition-link";
import { ICON } from "@/lib/icon";
import { BULWARK_VERSION } from "@/lib/version";

/**
 * The strip above the nav on every page, rendered once by the root layout.
 * It sits in the normal flow and scrolls away with the page, so the sticky
 * docs nav, sidebar and phone bar keep their offsets. It can't be dismissed.
 */
export function AnnouncementBar() {
  return (
    <section className="bw-announce" aria-label="Announcement">
      <div className="bw-w bw-announce-in">
        <p>Bulwark {BULWARK_VERSION} works with Stalwart 1.0.</p>
        <EditionLink href="/docs/deployment/updating/stalwart-1-0" className="bw-announce-link">
          Read the upgrade notes
          <ArrowRight size={16} {...ICON} />
        </EditionLink>
      </div>
    </section>
  );
}
