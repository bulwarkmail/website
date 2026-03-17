import { ArrowRight, Github, Star } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { HeroPhrases } from "@/components/hero-phrases";
import { Footer } from "@/components/footer";

const MailHero = dynamic(
  () => import("@/components/mail-hero").then((m) => ({ default: m.MailHero })),
  { loading: () => <div className="aspect-[16/10] rounded-xl bg-card border border-border animate-pulse" /> }
);
const FeaturesSection = dynamic(() =>
  import("@/components/features-section").then((m) => ({ default: m.FeaturesSection }))
);
const ScreenshotsSection = dynamic(() =>
  import("@/components/screenshots-section").then((m) => ({ default: m.ScreenshotsSection }))
);
const ComparisonSection = dynamic(() =>
  import("@/components/comparison-section").then((m) => ({ default: m.ComparisonSection }))
);
const TechSection = dynamic(() =>
  import("@/components/tech-section").then((m) => ({ default: m.TechSection }))
);
const ArchitectureSection = dynamic(() =>
  import("@/components/architecture-section").then((m) => ({ default: m.ArchitectureSection }))
);
const DeploySection = dynamic(() =>
  import("@/components/deploy-section").then((m) => ({ default: m.DeploySection }))
);
const CommunitySection = dynamic(() =>
  import("@/components/community-section").then((m) => ({ default: m.CommunitySection }))
);
const FaqSection = dynamic(() =>
  import("@/components/faq-section").then((m) => ({ default: m.FaqSection }))
);

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bulwark Webmail",
    applicationCategory: "CommunicationApplication",
    operatingSystem: "Web, Docker, Linux",
    description:
      "A modern, open-source webmail client for Stalwart Mail Server. Built with Next.js and JMAP for fast, private, self-hosted email, calendar, contacts, and file storage.",
    url: "https://bulwarkmail.org",
    downloadUrl: "https://github.com/bulwarkmail/webmail",
    softwareVersion: "1.3.0",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Email client for Stalwart Mail Server",
      "JMAP protocol support",
      "Calendar management",
      "Contact management",
      "File storage",
      "Self-hosted deployment",
      "Docker support",
      "Dark mode",
      "Keyboard shortcuts",
    ],
    author: {
      "@type": "Organization",
      name: "Bulwark Mail",
      url: "https://bulwarkmail.org",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-24 md:pt-52 md:pb-32 px-4 sm:px-6 overflow-hidden">
          {/* Background image */}
          <Image
            src="/1cf5514a-706d-4f84-8dbc-7be2fe7eaa0d.jpg"
            alt=""
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-top opacity-[0.25] pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 90%)',
            }}
          />
          {/* Vignette overlay for text readability */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 55% at center 30%, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.6) 50%, transparent 100%)',
            }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Badge */}
            <div
              className="flex justify-center mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <a
                href="https://github.com/bulwarkmail/webmail"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  <Star className="w-3 h-3 fill-primary" />
                  Open Source
                </span>
                <span className="w-px h-4 bg-border" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  v1.3.0 AGPL-3.0
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>

            {/* Title */}
            <div
              className="text-center mb-6 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] drop-shadow-lg" style={{ fontFamily: 'var(--font-exo2)', textShadow: '0 0 30px hsl(var(--background)), 0 0 60px hsl(var(--background))' }}>
                Webmail built for
                <br />
                <HeroPhrases />
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg animate-fade-in-up"
              style={{ animationDelay: '0.3s', textShadow: '0 0 24px hsl(var(--background)), 0 0 48px hsl(var(--background))' }}
            >
              A modern, self-hosted webmail client for Stalwart Mail Server, powered by the JMAP protocol.
              Email, calendar, contacts, and files - fast, private, and open source.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <a
                href="#deploy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/bulwarkmail/webmail"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-card border border-border text-foreground font-medium text-sm hover:bg-muted/50 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            </div>

            {/* Hero mail app */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <MailHero />
            </div>
          </div>
        </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="border-t border-border/50" />
      </div>

      <FeaturesSection />

      <ScreenshotsSection />

      <ComparisonSection />

      <TechSection />

      <ArchitectureSection />

      <DeploySection />

      <CommunitySection />

      <FaqSection />

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4" style={{ fontFamily: 'var(--font-exo2)' }}>
            Ready to take control of your email?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Self-host your webmail with Bulwark and Stalwart Mail Server. Email, calendar, contacts, and files - no tracking, no ads, no compromises.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </a>
            <a
              href="https://ghcr.io/bulwarkmail/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-card border border-border text-foreground font-medium text-sm hover:bg-muted/50 transition-all duration-200"
            >
              Container Registry
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
