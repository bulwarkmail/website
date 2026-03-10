"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Container, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "docker", label: "Docker", icon: Container },
  { id: "source", label: "From Source", icon: Terminal },
] as const;

type TabId = (typeof tabs)[number]["id"];

const codeBlocks: Record<TabId, { lines: { text: string; comment?: boolean; empty?: boolean }[] }> = {
  docker: {
    lines: [
      { text: "# Pull and run with Docker", comment: true },
      { text: "docker run -d \\", },
      { text: "  --name bulwark \\", },
      { text: '  -e JMAP_SERVER_URL="https://mail.example.com" \\', },
      { text: "  -p 3000:3000 \\", },
      { text: "  rootfr/bulwark:latest", },
      { text: "", empty: true },
      { text: "# Or use docker-compose", comment: true },
      { text: "docker compose up -d", },
    ],
  },
  source: {
    lines: [
      { text: "# Clone and install", comment: true },
      { text: "git clone https://github.com/root-fr/jmap-webmail.git", },
      { text: "cd bulwark", },
      { text: "npm install", },
      { text: "", empty: true },
      { text: "# Configure", comment: true },
      { text: "cp .env.example .env.local", },
      { text: '# Edit .env.local with your JMAP server URL', comment: true },
      { text: "", empty: true },
      { text: "# Start development server", comment: true },
      { text: "npm run dev", },
    ],
  },
};

export function DeploySection() {
  const [activeTab, setActiveTab] = useState<TabId>("docker");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = codeBlocks[activeTab].lines
      .filter((l) => !l.empty)
      .map((l) => l.text)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="deploy" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/10 text-primary text-xs font-medium mb-4">
            Get started
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-exo2)' }}>
            Deploy in seconds
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Pre-built Docker images on Docker Hub and GHCR. Or build from source.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-md border border-border bg-card overflow-hidden shadow-2xl shadow-black/10"
        >
          {/* Tabs */}
          <div className="flex items-center border-b border-border bg-muted/30 px-2 py-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code */}
          <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
            {codeBlocks[activeTab].lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-6 text-right mr-4 text-muted-foreground/30 select-none text-xs leading-relaxed">
                  {line.empty ? "" : i + 1}
                </span>
                {line.empty ? (
                  <span>&nbsp;</span>
                ) : line.comment ? (
                  <span className="text-muted-foreground">{line.text}</span>
                ) : (
                  <span className="text-foreground">{line.text}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
