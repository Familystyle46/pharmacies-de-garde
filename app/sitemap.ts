import type { MetadataRoute } from "next";
import {
  getVillesForSitemap,
  getAllPharmaciesSlugs,
  getTopDepartementsCodes,
} from "@/lib/pharmacies";

const SITE_URL = process.env.SITE_URL || "https://pharmacies-de-garde.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date();

  const [villes, pharmacies, deptCodes] = await Promise.all([
    getVillesForSitemap(),
    getAllPharmaciesSlugs(),
    getTopDepartementsCodes(),
  ]);

  const villeUrls: MetadataRoute.Sitemap = villes.map(({ slug }) => ({
    url: `${SITE_URL}/pharmacie-de-garde/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pharmacieUrls: MetadataRoute.Sitemap = pharmacies.map(
    ({ ville_slug, pharmacie_slug }) => ({
      url: `${SITE_URL}/pharmacie-de-garde/${ville_slug}/${pharmacie_slug}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const departementUrls: MetadataRoute.Sitemap = deptCodes.map((code) => ({
    url: `${SITE_URL}/departement/${code}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...departementUrls,
    ...villeUrls,
    ...pharmacieUrls,
  ];
}
