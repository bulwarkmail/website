import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AUDIENCE_PAGES } from "@/lib/site";
import { BULWARK_VERSION } from "@/lib/version";
import { pageMetadata } from "@/lib/og";
import { EDITIONS_NOTE, FullEdition } from "@/components/edition-link";
import { FeatureRow, PageHero, TableSection, TextSection, TileSection } from "@/components/sections";

// =============================================================================
// For IT departments, schools, the public sector and hosters. Every row is
// one thing they evaluate, shown in a real screenshot; requirements such as
// Stalwart 1.0, an Enterprise licence or Bulwark (full) are stated where
// they apply and again in the table at the end.
// =============================================================================

const { title: TITLE, description: DESCRIPTION } = AUDIENCE_PAGES.organisations;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/organisations",
  image: { url: "/og-organisations.png", width: 1200, height: 630, alt: "Bulwark for organisations" },
});

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
          heading="What Stalwart does and what Bulwark adds."
          text="Stalwart holds the accounts, groups and mailboxes, delivers mail, filters spam, and can be your OpenID Connect provider. Bulwark is what people open in the browser, plus the controls around it: sign-in, policies, signatures, branding and an admin console. It keeps no copy of the mail."
        />

        <FeatureRow
          heading="Sign in through your identity provider."
          text="A Sign in with SSO button sends people to your OpenID Connect provider: Stalwart's own, or one such as Keycloak or Authentik. You can also hide the password form, or skip the login page and send people straight to the provider."
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
          heading="One switch stops Bulwark's outside connections."
          text="Out of the box, Bulwark checks for updates, loads sender icons, and uses the project's push relay, extension directory and link Connector. Turn on No third-party traffic and all of that stops, and the page may only load from the hosts you configured, such as your Stalwart and office server. Usage stats stay off until an admin turns them on."
          link={{ label: "Third-party traffic", href: "/docs/guides/organisation/third-party-traffic" }}
          shot={{ name: "admin-third-party", alt: "The admin console's Security page with No third-party traffic turned on and the list of allowed hosts" }}
        />
        {/* Every claim here is in docs/legal/privacy.md or the third-party traffic guide. */}
        <TextSection
          band
          id="gdpr"
          heading="GDPR: the mail stays on servers you run."
          text="Bulwark and Stalwart both run on your own servers, so mail, contacts and calendars never pass through the Bulwark project, and Bulwark keeps no copy of the mail. What the project's own services see is small and documented: the push relay gets a device token, an account label and the ids of changed messages, never subjects, senders or bodies, and every server the project operates is in Germany. Usage stats stay off until an admin turns them on, and No third-party traffic ends every outside connection. Bulwark is written and maintained in the EU."
          links={[
            { label: "What the project's services collect", href: "/docs/legal/privacy" },
            { label: "Third-party traffic", href: "/docs/guides/organisation/third-party-traffic" },
          ]}
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
            { title: "Accessibility", text: "Presets for every user, links to your statement, and templates for a BITV statement and the BFSG.", href: "/docs/legal/accessibility" },
            { title: "Embedded in your portal", text: "Bulwark inside another web app's frame, signed in through the same provider.", href: "/docs/guides/embedded-sso" },
            { title: "Kubernetes", text: "Runs from the same image; a community Helm chart exists.", href: "/docs/deployment/kubernetes" },
            { title: "Security and updates", text: "Published advisories, and attestations on every release since 1.12.0.", href: "/docs/deployment/security-updates" },
          ]}
        />

        <TableSection
          heading="What each part needs."
          text={`Bulwark runs against Stalwart 0.16.6 or newer; Stalwart 1.0 needs Bulwark ${BULWARK_VERSION} or newer. These parts need more. ${EDITIONS_NOTE}`}
          columns={["Feature", "Needs"]}
          rows={[
            ["Sign-in with OpenID Connect", <><FullEdition />, or Lite served by Stalwart, and a provider Stalwart accepts. Stalwart&apos;s own provider needs nothing extra; another one needs an OpenID directory in Stalwart, and several directories per domain need a Stalwart Enterprise licence.</>],
            ["Policies, signatures, templates, External label", "Nothing extra. In Lite, a policy.json file you write."],
            ["Team templates and shared tag names", "Stalwart 1.0"],
            ["Recover deleted items", "A Stalwart Enterprise licence with archiving turned on"],
            ["S/MIME", <>The S/MIME plugin from the extension directory, and <FullEdition /></>],
            ["Opening a mailbox from your panel", <>A Stalwart account with the Impersonate permission, and <FullEdition /></>],
            ["Office editing", <>Collabora Online, ONLYOFFICE or EuroOffice, and <FullEdition /></>],
            ["Branding per web address", <FullEdition key="branding" />],
            ["Delegates, free/busy and people pickers", "On Stalwart 1.0, an admin turns on directory queries"],
            ["Admin console", <><FullEdition />, not Lite</>],
          ]}
        />

        <TileSection
          heading="Start here."
          columns={3}
          tiles={[
            { title: "Roll Bulwark out", text: "A checklist for Stalwart, Bulwark and the day people sign in.", href: "/docs/guides/organisation/rollout" },
            { title: "Authentication", text: "OpenID Connect, single sign-on only, and auto sign-in.", href: "/docs/getting-started/configuration/authentication" },
            { title: "Domains and groups", text: "A policy per domain or group, and what one address gets.", href: "/docs/guides/organisation/domains-and-groups" },
            { title: "Running Bulwark for customers", text: "Servers by domain, branding per address, and what replicas need.", href: "/docs/deployment/hosting-providers" },
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
