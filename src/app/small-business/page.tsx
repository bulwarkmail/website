import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { DockerSteps } from "@/components/install-steps";
import { FeatureRow, PageHero, TableSection, TextSection, TileSection } from "@/components/sections";

// =============================================================================
// For two to fifty people with one person doing the IT. Two rows show
// plugins that are not released yet; they say "coming" in the heading and
// never present the plugin as available.
// =============================================================================

const TITLE = "Bulwark for small businesses";
const DESCRIPTION =
  "Shared mailboxes, shared calendars, signatures and out-of-office replies for a small team on Stalwart, installed as one container. Free under AGPL-3.0.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/small-business" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bulwarkmail.org/small-business",
    images: [{ url: "/og-small-business.png", width: 1200, height: 630, alt: "Bulwark for small businesses" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-small-business.png"] },
};

export default function SmallBusinessPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          title="Shared mail and calendars for a small business."
          lead="Bulwark runs as one container next to your Stalwart server. The team gets shared mailboxes, shared calendars and files, and whoever looks after the IT gets a setup wizard and an admin console instead of config files."
          primary={{ label: "Install with Docker", href: "/docs/getting-started/installation" }}
          secondary={{ label: "Try the demo", href: "https://demo.bulwarkmail.org" }}
          shot={{ name: "shared-mailbox", alt: "A shared Support mailbox under Shared, next to the user's own folders" }}
        />

        <TextSection
          heading="Stalwart holds the mail. Bulwark is where the team works with it."
          text="Stalwart receives and sends mail, filters spam and holds every mailbox, including the shared ones you create as groups. Bulwark is the browser client on top: mail, calendar, contacts and files, and the settings the team shares."
        />

        <FeatureRow
          heading="One mailbox for info@, answered by everyone."
          text="Create a group in Stalwart and its mailbox appears under Shared for every member. Replies go out from the group's address, and Drafts and Sent stay with the group."
          link={{ label: "Shared mailboxes", href: "/docs/features/email#shared-mailboxes" }}
          shot={{ name: "shared-mailbox-reply", alt: "A reply being written from the shared Support mailbox, with the support address as the sender" }}
        />
        <FeatureRow
          flip
          heading="Calendars the team can see, and free times when you invite."
          text="Share a calendar and it shows in your colleagues' sidebar in its own colour. When you add people to an event, their busy times show, so you can pick a slot."
          link={{ label: "Calendar", href: "/docs/features/calendar" }}
          shot={{ name: "calendar-availability", alt: "A new event with three attendees, each marked busy or available at the chosen time" }}
        />
        <FeatureRow
          heading="Signatures, templates and out-of-office replies, set once."
          text="Give everyone the same signature with their own name and phone, keep templates for the replies you write every week, and schedule an automatic reply for the holidays. Stalwart sends it even when nobody has the browser open."
          link={{ label: "Out of office", href: "/docs/features/email#vacation-responder" }}
          shot={{ name: "vacation", alt: "The out-of-office settings turned on, with dates and a short reply" }}
        />
        <FeatureRow
          flip
          heading="Edit office documents next to your mail."
          text="Files keeps documents on the Stalwart server. Office editing needs a second server you run, Collabora Online or ONLYOFFICE; with it, Word, Excel and PowerPoint files open for editing in the browser. The public demo can't show this part."
          link={{ label: "Files", href: "/docs/features/files" }}
          shot={{ name: "files-office", alt: "A spreadsheet from Files open for editing in the office editor inside Bulwark" }}
        />
        <TextSection
          band
          heading="Thunderbird and phone mail apps keep working."
          text="Bulwark doesn't replace your mail server, so nothing moves and every app that reads your Stalwart accounts today keeps reading them. The company signature from Bulwark goes only on mail sent from Bulwark; Thunderbird keeps its own."
          links={[{ label: "Moving from another webmail", href: "/docs/guides/migration" }]}
        />
        <FeatureRow
          heading="Coming soon: assign a conversation to a colleague."
          text="The team inbox plugin lets members assign a conversation, mark it done and filter for Assigned to me. It is coming to the extension directory; today an admin downloads team-inbox.zip from the plugins repository and uploads it in the admin console. It needs the full edition."
          link={{ label: "Team inbox", href: "/docs/guides/organisation/team-inbox" }}
          shot={{ name: "team-inbox", alt: "The shared Support mailbox with conversations assigned to colleagues and one marked done" }}
        />
        <FeatureRow
          flip
          heading="Coming with Bulwark 1.20: e-invoices you can read."
          text="The e-invoice plugin shows XRechnung and ZUGFeRD invoices as a readable invoice, checks the sums, and forwards them to accounting. It needs Bulwark 1.20, which is not released yet."
          shot={{ name: "e-invoice", alt: "An invoice mail with the e-invoice plugin showing the supplier, line items and checked totals" }}
        />

        <TextSection
          heading="Bulwark costs nothing."
          text={
            <>
              Bulwark is open source under AGPL-3.0, with no paid edition and no licence per user. You pay for the server
              it runs on. Some Stalwart features, such as recovering deleted mail, need a Stalwart Enterprise licence.
              There is no paid support for Bulwark today; if you would want it, write to{" "}
              <a href="mailto:dev@bulwarkmail.org" className="bw-link">
                dev@bulwarkmail.org
              </a>
              .
            </>
          }
        />

        <section className="bw-sec bw-field">
          <div className="bw-w">
            <div className="bw-split bw-split-5-7">
              <div className="bw-stack">
                <h2 className="bw-h2">Install it with one container.</h2>
                <p>
                  You need Docker and a Stalwart server. Step 3 puts a web server such as Caddy in front of Bulwark. It gets
                  the HTTPS certificate that phones and sign-ins from home need.{" "}
                  <Link href="/docs/deployment/docker/compose" className="bw-link">
                    Compose with Stalwart
                  </Link>{" "}
                  runs both together.
                </p>
              </div>
              <DockerSteps />
            </div>
          </div>
        </section>

        <TableSection
          heading="What each part needs."
          columns={["Feature", "Needs"]}
          rows={[
            ["Shared mailbox", "A group with a mailbox in Stalwart"],
            ["Shared templates and tag names", "Stalwart 1.0"],
            ["Free/busy and people pickers", "On Stalwart 1.0, an admin turns on directory queries, the Stalwart setting that lets people look each other up"],
            ["Office editing", "Collabora Online, ONLYOFFICE or EuroOffice, and the full edition"],
            ["Team inbox (coming)", "The team inbox plugin, uploaded in the admin console, and the full edition"],
            ["E-invoices (coming)", "The e-invoice plugin and Bulwark 1.20"],
            ["Phone app", "The beta app, from GitHub or TestFlight; not yet for your main mail. Until then, the webmail in the phone's browser, installed to the home screen over HTTPS"],
          ]}
        />

        <TileSection
          heading="Start here."
          columns={3}
          tiles={[
            { title: "Installation", text: "One container, the setup link from its log, and the wizard.", href: "/docs/getting-started/installation" },
            { title: "Setting up Stalwart", text: "What Stalwart needs before Bulwark connects.", href: "/docs/getting-started/stalwart-setup" },
            { title: "Shared mailboxes", text: "How a Stalwart group shows up for its members.", href: "/docs/features/email#shared-mailboxes" },
            { title: "Signatures", text: "One signature for everyone, with each person's details.", href: "/docs/guides/organisation/signatures" },
            { title: "Files", text: "Folders, sharing, previews and office editing.", href: "/docs/features/files" },
            { title: "Bulwark Mobile", text: "Mail, calendar, contacts and files on Android and iOS, as a beta.", href: "/docs/features/mobile" },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
