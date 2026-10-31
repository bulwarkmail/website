import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeatureRow, PageHero, TableSection, TextSection, TileSection } from "@/components/sections";

// =============================================================================
// For people who run Stalwart at home, for a family or a club. Memory figures
// carry their method (docs/deployment/requirements.md has it in full); the
// sibling projects say how mature they are.
// =============================================================================

const TITLE = "Bulwark at home";
const DESCRIPTION =
  "Webmail for the Stalwart server in your home lab: one container for amd64 or arm64, Compose next to Stalwart, or Bulwark Lite as static files with no Node process.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/homelab" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bulwarkmail.org/homelab",
    images: [{ url: "/og-homelab.png", width: 1200, height: 630, alt: "Bulwark at home" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-homelab.png"] },
};

const COMPOSE = `services:
  stalwart:
    image: stalwartlabs/stalwart:v1.0
    ports: ["443:443", "25:25", "465:465", "993:993", "8080:8080"]
    volumes:
      - stalwart-etc:/etc/stalwart
      - stalwart-data:/var/lib/stalwart
    restart: unless-stopped

  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    ports: ["3000:3000"]
    environment:
      JMAP_SERVER_URL: https://mail.example.com
    volumes:
      - bulwark-data:/app/data
    depends_on: [stalwart]
    restart: unless-stopped

volumes:
  stalwart-etc:
  stalwart-data:
  bulwark-data:`;

export default function HomelabPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          title="Webmail for the Stalwart server in your home lab."
          lead="Run Bulwark as one container next to Stalwart on a NAS, a VM or a 64-bit ARM board, or put Bulwark Lite on a web server you already run and skip the Node process. It works for one person, a family or a club."
          primary={{ label: "Compose with Stalwart", href: "/docs/deployment/docker/compose" }}
          secondary={{ label: "Try the demo", href: "https://demo.bulwarkmail.org" }}
          shot={{ name: "unified-inbox", alt: "One inbox showing mail from two accounts and a shared mailbox together" }}
        />

        <TextSection
          band
          heading="Stalwart is the server you already run. Bulwark is the client for it."
          text="Stalwart handles SMTP, storage, spam filtering and the accounts. Bulwark talks JMAP to it from the browser and puts mail, calendar, contacts and files in one window."
        />

        <FeatureRow
          heading="Stalwart and Bulwark in one Compose file."
          text="The images are built for amd64 and arm64; a Raspberry Pi needs a 64-bit OS. On the project's amd64 test VM the container used about 70 MiB of memory at idle, signed out. Put Caddy, nginx or Traefik in front for HTTPS."
          link={{ label: "Compose with Stalwart", href: "/docs/deployment/docker/compose" }}
          code={{ code: COMPOSE, label: "Copy the Compose file" }}
        />
        <FeatureRow
          flip
          heading="Bulwark Lite is a folder of static files."
          text="Serve it from any web server, run the 23 MB nginx image, or let Stalwart serve it as an application. Lite leaves out the admin console, plugins and web push. Its nginx image used about 8 MiB at idle on the same VM."
          link={{ label: "Static hosting", href: "/docs/deployment/static" }}
          shot={{ name: "lite-inbox", alt: "Bulwark Lite's inbox, served as static files under /webmail", url: "mail.example.com/webmail" }}
        />
        <FeatureRow
          heading="Every account in one window."
          text="Sign in to your own mailbox and the family's at once and switch between them. An admin can allow one merged inbox across all of them."
          link={{ label: "Multiple accounts", href: "/docs/guides/multi-account" }}
          shot={{ name: "account-switcher", alt: "The account switcher open, with two signed-in accounts" }}
        />
        <FeatureRow
          flip
          heading="Push to the phone without opening a port for it."
          text="Stalwart sends push to the Bulwark relay over HTTPS, and the relay wakes the phone, so push needs no inbound connection. Reading mail away from home still needs Stalwart and Bulwark reachable, over HTTPS or a VPN. On Android without Google services, the app can push through UnifiedPush with a distributor such as ntfy, through the hosted relay or one you run. A relay of your own is pre-1.0, built from source, and needs a public HTTPS address. The phone app is a beta."
          link={{ label: "Mobile apps and push", href: "/docs/features/mobile" }}
          shot={{ name: "settings-notifications", alt: "Notification settings with the push relay chosen" }}
        />
        <FeatureRow
          heading="Plugins and themes, and your own."
          text="The admin console installs plugins and themes from the extension directory, such as Paperless-ngx, Nextcloud or a Thunderbird-like theme. Writing your own takes a manifest and some JavaScript, and the plugin guide covers the API."
          link={{ label: "Plugins", href: "/docs/guides/plugins" }}
          shot={{ name: "admin-marketplace", alt: "The admin console's marketplace listing plugins and themes from the extension directory" }}
        />

        <TileSection
          heading="Packages other people maintain."
          text="These are not run by the Bulwark project, and they may install an older release. Check the version before you use one."
          columns={3}
          compact
          tiles={[
            { title: "TrueNAS community app", text: "The bulwark-webmail app in the TrueNAS community train.", href: "https://github.com/truenas/apps/tree/master/ix-dev/community/bulwark-webmail" },
            { title: "Helm chart by HelmForge", text: "For Kubernetes; set the image tag yourself.", href: "/docs/deployment/kubernetes" },
            { title: "NixOS package and module", text: "The bulwark package and services.bulwark in nixpkgs unstable.", href: "https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/bu/bulwark/package.nix" },
          ]}
        />

        <TileSection
          heading="More from the Bulwark project."
          tiles={[
            { title: "Home Assistant", text: "Unread counts and new-mail events from any JMAP server. Pre-1.0, a HACS custom repository.", href: "https://github.com/bulwarkmail/homeassistant-jmap" },
            { title: "WordPress plugin", text: "Sends WordPress's mail through a JMAP server.", href: "https://github.com/bulwarkmail/wordpress-jmap" },
            { title: "Legacy Proxy", text: "Lets Bulwark read an existing IMAP account. Pre-1.0, mail and contacts only.", href: "https://github.com/bulwarkmail/legacy-proxy" },
            { title: "Bulwark Mobile", text: "Mail, calendar, contacts and files on Android and iOS, as a beta.", href: "https://github.com/bulwarkmail/native" },
          ]}
        />

        <TableSection
          heading="What each part needs."
          columns={["Feature", "Needs"]}
          rows={[
            ["Lite on a separate host", "The Permissive CORS policy in Stalwart, unless Stalwart serves Lite"],
            ["More than five accounts in one browser", "HTTPS (HTTP/2) between the browser and Bulwark"],
            ["Installing as an app", "HTTPS"],
            ["Web push in the browser", "HTTPS and the full edition"],
            ["Push to the phone", "The beta app, and Stalwart reaching the relay over public HTTPS"],
            ["UnifiedPush", "Android and a distributor app such as ntfy"],
            ["Plugins", "The full edition; an admin turns them on"],
          ]}
        />

        <TileSection
          heading="Start here."
          columns={3}
          tiles={[
            { title: "Compose with Stalwart", text: "Both containers in one file, with volumes.", href: "/docs/deployment/docker/compose" },
            { title: "Run Bulwark at home", text: "Reverse proxy, bind mounts, ARM boards and a NAS.", href: "/docs/deployment/home-server" },
            { title: "Requirements", text: "Architectures, memory and what needs HTTPS.", href: "/docs/deployment/requirements" },
            { title: "Static hosting", text: "Bulwark Lite on a web server you already run.", href: "/docs/deployment/static" },
            { title: "Install on Stalwart", text: "Let Stalwart serve Bulwark Lite itself.", href: "/docs/deployment/stalwart-app" },
            { title: "Try the demo", text: "Sample data, no mail server, nothing saved.", href: "https://demo.bulwarkmail.org" },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
