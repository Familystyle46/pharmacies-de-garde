import type { MetadataRoute } from "next";
import { getVillesForSitemap } from "@/lib/pharmacies";

const SITE_URL = process.env.SITE_URL || "https://pharmacies-de-garde.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date();
  const villes = await getVillesForSitemap();

  const villeUrls: MetadataRoute.Sitemap = villes.map(({ slug }) => ({
    url: `${SITE_URL}/pharmacie-de-garde/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...villeUrls,
  ];
}
