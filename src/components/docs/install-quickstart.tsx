"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const INSTALL_COMMAND = `docker run -d -p 3000:3000 --name bulwark \\
  -v bulwark-config:/app/data/admin \\
  -v bulwark-state:/app/data/admin-state \\
  ghcr.io/bulwarkmail/webmail:latest`;

export function InstallQuickstart() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND.replace(/\\\n\s+/g, " "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard may be blocked in some browsers
    }
  };

  return (
    <div className="relative">
      <pre
        className="m-0 overflow-x-auto"
        style={{
          background: "var(--pre-bg)",
          border: "1px solid var(--rule)",
          padding: "1rem 3rem 1rem 1rem",
          fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
          fontSize: "0.8125rem",
          lineHeight: 1.55,
          color: "var(--foreground)",
        }}
      >
        <code>{INSTALL_COMMAND}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 transition-colors"
        style={{
          border: "1px solid var(--rule)",
          background: "var(--background)",
          color: copied ? "#22c55e" : "var(--muted-foreground)",
        }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
