import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeatureRow, PageHero, TableSection, TextSection, TileSection } from "@/components/sections";

// =============================================================================
// For IT departments, schools, the public sector and hosters. Every row is
// one thing they evaluate, shown in a real screenshot; requirements such as
// Stalwart 1.0, an Enterprise licence or the full edition are stated where
// they apply and again in the table at the end.
// =============================================================================

const TITLE = "Bulwark for organisations";
const DESCRIPTION =
  "Webmail for IT departments, schools, the public sector and hosters that run Stalwart: single sign-on, policies per domain and group, organisation signatures, and a switch that stops third-party traffic.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/organisations" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bulwarkmail.org/organisations",
    images: [{ url: "/og-organisations.png", width: 1200, height: 630, alt: "Bulwark for organisations" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-organisations.png"] },
};

export default function OrganisationsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          title="Webmail for an organisation that runs its own Stalwart."
          lead="Bulwark gives an IT department, a school, a public body or a hoster one browser client for everyone, signed in through their identity provider and set up the way the organisation decides."
          primary={{ label: "Plan a rollout", href: "/docs/guides/organisation/rollout" }}
          secondary={{ label: "Try the demo", href: "https://demo.bulwarkmail.org" }}
          shot={{ name: "admin-policy", alt: "The User policy page of the admin console with several settings locked" }}
        />

        <TextSection
          band
          heading="Stalwart runs the mail. Bulwark runs the client."
          text="Stalwart holds the accounts, groups and mailboxes, delivers mail, filters spam, and can be your OpenID Connect provider. Bulwark is what people open in the browser, plus the controls around it: sign-in, policies, signatures, branding and an admin console. It keeps no copy of the mail."
        />

        <FeatureRow
          heading="Sign in through your identity provider."
          text="Bulwark signs people in with OpenID Connect, against Stalwart's own provider or one such as Keycloak or Authentik. You can hide the password form, or skip the login page and send people straight to the provider."
          link={{ label: "Authentication", href: "/docs/getting-started/configuration/authentication" }}
          shot={{ name: "login-sso", alt: "The Bulwark login page with a button to sign in through the organisation's identity provider" }}
        />
        <FeatureRow
          flip
          heading="Lock a setting, and users see who decided."
          text="The user policy switches features off, locks 26 settings at a value and presets many more. Each domain or group can have its own policy, and the Effective policy view shows what one address gets and why."
          link={{ label: "Domains and groups", href: "/docs/guides/organisation/domains-and-groups" }}
          shot={{ name: "settings-locked", alt: "A setting in Bulwark locked by the administrator, labelled Set by your organisation" }}
        />
        <FeatureRow
          heading="One signature for the whole domain."
          text="Write the signature once with placeholders for name, job title and phone, add a disclaimer that goes below every message at sending, and give each group read-only templates."
          link={{ label: "Signatures", href: "/docs/guides/organisation/signatures" }}
          shot={{ name: "composer-org-signature", alt: "The composer with the organisation signature filled in with the sender's name, title and phone" }}
        />
        <FeatureRow
          flip
          heading="Mail from outside is marked before anyone replies."
          text="An External label sits on mail from other domains, and Bulwark asks before a message or an invitation leaves the organisation."
          link={{ label: "External mail", href: "/docs/guides/organisation/external-mail" }}
          shot={{ name: "external-mail", alt: "A message from another company with the External label next to the sender" }}
        />
        <FeatureRow
          heading="Users restore mail they deleted for good."
          text="With a Stalwart Enterprise licence and archiving turned on, people bring back mail they deleted for good, from Settings or from a link in Trash."
          link={{ label: "Recover deleted items", href: "/docs/guides/organisation/recover-deleted-items" }}
          shot={{ name: "recover-deleted", alt: "The Recover deleted items page listing messages that can be restored" }}
        />
        <FeatureRow
          flip
          heading="Bulwark contacts no outside service unless you allow it."
          text="Turn on No third-party traffic and Bulwark's own server stops contacting outside services, and the page may only load from the hosts you configured, such as your Stalwart and office server. Telemetry is off until an admin turns it on."
          link={{ label: "Third-party traffic", href: "/docs/guides/organisation/third-party-traffic" }}
          shot={{ name: "admin-third-party", alt: "The admin console's Security page with No third-party traffic turned on and the list of allowed hosts" }}
        />
        <FeatureRow
          heading="One Bulwark for many customers."
          text="For hosters and service providers: branding follows the web address Bulwark is opened on, the login page picks the customer's Stalwart server from the address people type, and your panel can open a mailbox for support through a signed link."
          link={{ label: "Running Bulwark for customers", href: "/docs/deployment/hosting-providers" }}
          shot={{ name: "login-branded", alt: "The login page with a customer's own name, logo and colours", url: "mail.meridianlabs.example" }}
        />

        <TileSection
          heading="Also for organisations."
          compact
          tiles={[
            { title: "Delegates", text: "Give a colleague access to mail, calendars and contacts in one step.", href: "/docs/guides/organisation/delegates" },
            { title: "Session limits", text: "Sign people out after idle time or a maximum session length.", href: "/docs/guides/organisation/sessions" },
            { title: "Audit log", text: "Bulwark's own admin actions, with time, IP address and old and new values.", href: "/docs/guides/admin" },
            { title: "S/MIME", text: "Sign and encrypt with the S/MIME plugin; keys stay in the browser.", href: "/docs/guides/smime" },
            { title: "Accessibility", text: "Presets for every user, links to your statement, and a statement template in the docs.", href: "/docs/features/accessibility" },
            { title: "Embedded in your portal", text: "Bulwark inside another web app's frame, signed in through the same provider.", href: "/docs/guides/embedded-sso" },
            { title: "Kubernetes", text: "Runs from the same image; a community Helm chart exists.", href: "/docs/deployment/kubernetes" },
            { title: "Security and updates", text: "Published advisories, and attestations on every download.", href: "/docs/deployment/security-updates" },
          ]}
        />

        <TableSection
          heading="What each part needs."
          text="Bulwark runs against Stalwart 0.16.6 or 1.0. These parts need more."
          columns={["Feature", "Needs"]}
          rows={[
            ["Sign-in with OpenID Connect", "The full edition, or Lite served by Stalwart, and a provider Stalwart accepts. Stalwart's own provider needs nothing extra; another one needs an OpenID directory in Stalwart, and several directories per domain need a Stalwart Enterprise licence."],
            ["Policies, signatures, templates, External label", "Nothing extra. In Lite, a policy.json file you write."],
            ["Team templates and shared tag names", "Stalwart 1.0"],
            ["Recover deleted items", "A Stalwart Enterprise licence with archiving turned on"],
            ["S/MIME", "The S/MIME plugin from the extension directory, and the full edition"],
            ["Opening a mailbox from your panel", "A Stalwart account with the Impersonate permission, and the full edition"],
            ["Office editing", "Collabora Online, ONLYOFFICE or EuroOffice, and the full edition"],
            ["Branding per web address", "The full edition"],
            ["Delegates, free/busy and people pickers", "On Stalwart 1.0, an admin turns on directory queries"],
            ["Admin console", "The full edition, not Lite"],
          ]}
        />

        <TileSection
          heading="Start here."
          columns={3}
          tiles={[
            { title: "Roll Bulwark out", text: "A checklist for Stalwart, Bulwark and the day people sign in.", href: "/docs/guides/organisation/rollout" },
            { title: "Authentication", text: "OpenID Connect, single sign-on only, and auto sign-in.", href: "/docs/getting-started/configuration/authentication" },
            { title: "Domains and groups", text: "A policy per domain or group, and what one address gets.", href: "/docs/guides/organisation/domains-and-groups" },
            { title: "Running Bulwark for customers", text: "Servers by domain, branding per address, several replicas.", href: "/docs/deployment/hosting-providers" },
            { title: "Security and updates", text: "Where fixes are announced and how to verify a download.", href: "/docs/deployment/security-updates" },
            { title: "Which way to run it?", text: "A one-minute quiz on Bulwark and Bulwark Lite.", href: "/choose" },
          ]}
        />

        <TextSection
          heading="Talk to us about support."
          text={
            <>
              There is no paid support for Bulwark today. If your organisation would want it, tell us what you need:{" "}
              <a href="mailto:dev@bulwarkmail.org" className="bw-link">
                dev@bulwarkmail.org
              </a>
              .
            </>
          }
        />
      </main>
      <Footer />
    </div>
  );
}
