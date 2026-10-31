import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ICON } from "@/lib/icon";

/**
 * The strip above the nav on every page, rendered once by the root layout.
 * It sits in the normal flow and scrolls away with the page, so the sticky
 * docs nav, sidebar and phone bar keep their offsets. It can't be dismissed.
 */
export function AnnouncementBar() {
  return (
    <section className="bw-announce" aria-label="Announcement">
      <div className="bw-w bw-announce-in">
        <p>Bulwark 1.19 adds policies, signatures and templates per domain or group.</p>
        <Link href="/organisations" className="bw-announce-link">
          See what organisations get
          <ArrowRight size={16} {...ICON} />
        </Link>
      </div>
    </section>
  );
}
