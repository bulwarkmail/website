"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons";
import { ICON } from "@/lib/icon";

/** An outlined button that copies a piece of text and says so. */
export function CopyButton({ text, label, copiedLabel = "Copied" }: { text: string; label: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore - clipboard may be blocked in some browsers
    }
  };

  return (
    <button type="button" onClick={onCopy} className="bw-btn bw-btn-ghost" aria-live="polite">
      {copied ? copiedLabel : label}
      {copied ? <Check size={16} {...ICON} /> : <Copy size={16} {...ICON} />}
    </button>
  );
}
