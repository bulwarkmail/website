import { CONTACT_EMAIL, GITHUB_ORG, SITE_URL } from "./site";

// schema.org data (JSON-LD) that search engines and AI tools read to tell what
// a page is and who publishes it. Pages refer to the organisation and the
// website by @id, so each is described once, on the home page.

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Bulwark Mail",
  url: SITE_URL,
  logo: `${SITE_URL}/branding/logo/${encodeURIComponent("Bulwark Logo Color.png")}`,
  sameAs: [GITHUB_ORG],
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, url: `${SITE_URL}/about#contact` },
};

export const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Bulwark Webmail",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

/** A docs page: the article and the breadcrumb trail above it. */
export function docsPageData({
  title,
  description,
  path,
  crumbs,
  updated,
}: {
  title: string;
  description: string;
  path: string;
  /** The ISO date the page last changed, from git. */
  updated?: string;
  /** Docs, then the section, as on the page. */
  crumbs: { name: string; path: string }[];
}) {
  const url = `${SITE_URL}${path}`;
  const trail = [...crumbs, { name: title, path }];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: { "@id": SOFTWARE_ID },
        ...(updated ? { dateModified: updated } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: trail.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: `${SITE_URL}${c.path}`,
        })),
      },
    ],
  };
}
