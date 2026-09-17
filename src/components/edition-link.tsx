"use client";

import Link, { type LinkProps } from "next/link";
import { EDITION_QUERY_KEY, useEdition, type Edition } from "@/components/edition-provider";

type EditionLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  /** Force a particular edition into the URL instead of the current one. */
  edition?: Edition;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function withEdition(href: string, edition: Edition): string {
  if (edition === "full") return href;
  if (/^https?:\/\//.test(href) || href.startsWith("#")) return href;
  const [pathAndQuery, hash] = href.split("#");
  const [path, query] = pathAndQuery.split("?");
  const params = new URLSearchParams(query ?? "");
  params.set(EDITION_QUERY_KEY, edition);
  return `${path}?${params.toString()}${hash ? `#${hash}` : ""}`;
}

/**
 * A Link that carries the current edition into the URL, so a reader in Lite
 * mode who copies or opens a docs link in a new tab lands on the Lite view.
 * Within the tab the data-edition attribute already persists across client
 * navigations; the parameter is for the hard loads.
 */
export function EditionLink({ href, edition, children, ...rest }: EditionLinkProps) {
  const current = useEdition().edition;
  return (
    <Link href={withEdition(href, edition ?? current)} {...rest}>
      {children}
    </Link>
  );
}
