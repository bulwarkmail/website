import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";

const SITE_URL = "https://bulwarkmail.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();

  const docPages = docs.map((doc) => ({
    url: `${SITE_URL}/docs/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docPages,
  ];
}
