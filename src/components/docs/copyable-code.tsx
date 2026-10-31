"use client";

import { useEffect, useRef } from "react";

// The same square icon style as the rest of the site (see lib/icon.ts), as
// markup because the buttons are attached to server-rendered <pre> elements.
const SVG_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">`;
const COPY_ICON = `${SVG_OPEN}<rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/></svg>`;
const CHECK_ICON = `${SVG_OPEN}<path d="m5 12 5 5 9-10"/></svg>`;

export function CopyableCode({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A block whose lines run wider than the box gets a strip at the top for
    // the button (bw-pre-scrolls), so no line starts or scrolls under it.
    const marked = new Set<HTMLPreElement>();
    const markScrolling = () =>
      marked.forEach((pre) => pre.classList.toggle("bw-pre-scrolls", pre.scrollWidth > pre.clientWidth));
    const observer = new ResizeObserver(markScrolling);

    const pres = container.querySelectorAll("pre");
    pres.forEach((pre) => {
      marked.add(pre);
      observer.observe(pre);
      if (pre.parentElement?.classList.contains("bw-prewrap")) return;

      // The button sits in a wrapper beside the scrolling <pre>, so it stays
      // in its corner when the code is scrolled sideways.
      const wrap = document.createElement("div");
      wrap.className = "bw-prewrap";
      pre.before(wrap);
      wrap.appendChild(pre);

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy to clipboard");
      btn.innerHTML = COPY_ICON;

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code?.textContent ?? pre.textContent ?? "";
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = CHECK_ICON;
          btn.classList.add("copied");
          btn.setAttribute("aria-label", "Copied");
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove("copied");
            btn.setAttribute("aria-label", "Copy to clipboard");
          }, 2000);
        });
      });

      wrap.appendChild(btn);
    });
    markScrolling();
    return () => observer.disconnect();
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose-docs"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
