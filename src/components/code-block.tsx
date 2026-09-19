"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons";
import { ICON } from "@/lib/icon";

type CodeBlockProps = {
  code: string;
  /** Show a "$ " prompt in front of the first line. It is not copied. */
  prompt?: boolean;
  /** What the copy button puts on the clipboard, when it differs from `code`. */
  copyText?: string;
  label?: string;
};

/** A code block with a copy button. Monospace appears nowhere else on the site. */
export function CodeBlock({ code, prompt = false, copyText, label = "Copy" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore - clipboard may be blocked in some browsers
    }
  };

  return (
    <div className="bw-codewrap">
      <pre className="bw-code" tabIndex={0}>
        <code>
          {prompt ? <span className="bw-code-prompt">$ </span> : null}
          {code}
        </code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="bw-copy"
        data-copied={copied}
        aria-label={copied ? "Copied" : label}
      >
        {copied ? <Check size={16} {...ICON} /> : <Copy size={16} {...ICON} />}
      </button>
    </div>
  );
}
