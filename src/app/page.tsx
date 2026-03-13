"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Github, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MailHero } from "@/components/mail-hero";
import { FeaturesSection } from "@/components/features-section";
import { ScreenshotsSection } from "@/components/screenshots-section";
import { TechSection } from "@/components/tech-section";
import { DeploySection } from "@/components/deploy-section";
import { ComparisonSection } from "@/components/comparison-section";
import { FaqSection } from "@/components/faq-section";
import { CommunitySection } from "@/components/community-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { Footer } from "@/components/footer";

const PHRASES = ["Stalwart", "the 21st Century", "everyone", "your privacy", "power users"];

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 px-6 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-x-0 top-0 z-0 w-full opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `url('/Gemini_Generated_Image_ks4ya8ks4ya8ks4y.png')`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            maxHeight: '100vh',
            height: '100%',
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
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
                v1.1.2 — MIT License
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg" style={{ fontFamily: 'var(--font-exo2)', textShadow: '0 0 30px hsl(var(--background)), 0 0 60px hsl(var(--background)), 0 2px 4px rgba(0,0,0,0.8)' }}>
              Webmail built for
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={PHRASES[phraseIndex]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent"
                >
                  {PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg"
            style={{ textShadow: '0 0 24px hsl(var(--background)), 0 0 48px hsl(var(--background)), 0 2px 4px rgba(0,0,0,0.8)' }}
          >
            A modern, self-hosted email client powered by the JMAP protocol.
            Email, calendar, contacts — fast, private, and open source.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
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
          </motion.div>

          {/* Hero mail app */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MailHero />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
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
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4" style={{ fontFamily: 'var(--font-exo2)' }}>
              Ready to take control of your email?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Self-host your webmail with Stalwart. No tracking, no ads, no compromises.
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
                href="https://ghcr.io/root-fr/jmap-webmail"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-card border border-border text-foreground font-medium text-sm hover:bg-muted/50 transition-all duration-200"
              >
                Container Registry
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
