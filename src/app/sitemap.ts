import type { MetadataRoute } from "next";
import { getAllDocs, getDocSections } from "@/lib/docs";

const SITE_URL = "https://bulwarkmail.org";

// No lastModified: the build date would mark every page as changed on each
// deploy, which is worse than saying nothing.
export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();

  // Each section has its own page listing its pages, /docs/<section>.
  const sectionPages = getDocSections().map((section) => ({
    url: `${SITE_URL}/docs/${section.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const docPages = docs.map((doc) => ({
    url: `${SITE_URL}/docs/${doc.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
        changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
        changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/choose`,
        changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/brand`,
        changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/press`,
        changeFrequency: "monthly",
      priority: 0.4,
    },
    ...sectionPages,
    ...docPages,
  ];
}
