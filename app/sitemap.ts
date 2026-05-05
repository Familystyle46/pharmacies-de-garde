import type { MetadataRoute } from "next";
import {
  getVillesForSitemap,
  getAllPharmaciesSlugs,
  getTopDepartementsCodes,
} from "@/lib/pharmacies";
import { JOURS_FERIES } from "@/lib/jours-feries";

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

  const joursFeriesIndexUrl: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/jours-feries`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.85,
    },
  ];

  const joursFeriesUrls: MetadataRoute.Sitemap = JOURS_FERIES.map((j) => ({
    url: `${SITE_URL}/jours-feries/${j.slug}`,
    lastModified: today,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...joursFeriesIndexUrl,
    ...joursFeriesUrls,
    ...departementUrls,
    ...villeUrls,
    ...pharmacieUrls,
  ];
}
