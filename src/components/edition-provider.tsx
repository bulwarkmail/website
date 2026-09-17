"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { useSearchParams } from "next/navigation";

// The site describes two editions of the same client: Bulwark (the Node.js
// service) and Bulwark Lite (the static export). The choice lives on <html>
// as data-edition, exactly like the theme lives there as a class, so that
// server-rendered markup can show or hide edition-specific content with CSS
// (.ed-full-only / .ed-lite-only) and never flashes the wrong accent.
//
// A blocking inline script in layout.tsx sets the attribute before paint from
// the ?edition= query string or localStorage. The attribute is the single
// source of truth; this provider subscribes to it (useSyncExternalStore over
// a MutationObserver) for the parts of the UI that need to read it: the
// switch's aria-checked, the docs search, edition-aware links.

export type Edition = "full" | "lite";

export const EDITION_STORAGE_KEY = "edition";
export const EDITION_QUERY_KEY = "edition";

export const FAVICONS: Record<Edition, string> = {
  full: "/branding/favicon/Bulwark%20Favicon.svg",
  lite: "/branding/favicon/Bulwark%20Favicon%20Lite.svg",
};

export function isEdition(value: unknown): value is Edition {
  return value === "full" || value === "lite";
}

interface EditionContextValue {
  edition: Edition;
  setEdition: (edition: Edition) => void;
}

const EditionContext = createContext<EditionContextValue>({
  edition: "full",
  setEdition: () => {},
});

export function useEdition() {
  return useContext(EditionContext);
}

function readDocumentEdition(): Edition {
  const attr = document.documentElement.getAttribute("data-edition");
  return isEdition(attr) ? attr : "full";
}

function subscribeToDocumentEdition(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-edition"] });
  return () => observer.disconnect();
}

function getServerEdition(): Edition {
  return "full";
}

export function applyEdition(edition: Edition) {
  const root = document.documentElement;
  if (root.getAttribute("data-edition") !== edition) root.setAttribute("data-edition", edition);
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
  if (icon) icon.href = FAVICONS[edition];
  try {
    localStorage.setItem(EDITION_STORAGE_KEY, edition);
  } catch {
    // private mode, quota - the attribute still holds for this page
  }
}

/** Client-side navigations with ?edition= in the URL (deep links from the
 *  landing page into the docs) never re-run the inline script, so pick the
 *  parameter up here as well. */
function EditionUrlSync() {
  const searchParams = useSearchParams();
  const requested = searchParams.get(EDITION_QUERY_KEY);
  useEffect(() => {
    if (isEdition(requested)) applyEdition(requested);
  }, [requested]);
  return null;
}

export function EditionProvider({ children }: { children: React.ReactNode }) {
  const edition = useSyncExternalStore(subscribeToDocumentEdition, readDocumentEdition, getServerEdition);
  const setEdition = useCallback((next: Edition) => applyEdition(next), []);

  return (
    <EditionContext.Provider value={{ edition, setEdition }}>
      <Suspense fallback={null}>
        <EditionUrlSync />
      </Suspense>
      {children}
    </EditionContext.Provider>
  );
}
