import type { MetadataRoute } from "next";
import {
  getVillesForSitemap,
  getAllPharmaciesSlugs,
  getTopDepartementsCodes,
} from "@/lib/pharmacies";
import { DATA_LAST_UPDATED } from "@/lib/pharmacies";
import { JOURS_FERIES, TOP_VILLES } from "@/lib/jours-feries";
import { REGIONS } from "@/lib/regions";

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
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pharmacieUrls: MetadataRoute.Sitemap = pharmacies.map(
    ({ ville_slug, pharmacie_slug }) => ({
      url: `${SITE_URL}/pharmacie-de-garde/${ville_slug}/${pharmacie_slug}`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const departementUrls: MetadataRoute.Sitemap = deptCodes.map((code) => ({
    url: `${SITE_URL}/departement/${code}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/3237-pharmacie-de-garde`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pharmacie-de-garde-aujourd-hui`,
      lastModified: today, // seule page au contenu réellement quotidien
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pharmacie-ouverte-dimanche`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/pharmacie-de-garde-nuit`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];

  // 330 pages croisées jour-férié × ville (11 × 30)
  const joursFeriesVilleUrls: MetadataRoute.Sitemap = JOURS_FERIES.flatMap((j) =>
    TOP_VILLES.map((v) => ({
      url: `${SITE_URL}/jours-feries/${j.slug}/${v.slug}`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }))
  );

  const regionUrls: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${SITE_URL}/region/${r.slug}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const joursFeriesIndexUrl: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/jours-feries`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.85,
    },
  ];

  const joursFeriesUrls: MetadataRoute.Sitemap = JOURS_FERIES.map((j) => ({
    url: `${SITE_URL}/jours-feries/${j.slug}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...staticPages,
    ...joursFeriesIndexUrl,
    ...joursFeriesUrls,
    ...joursFeriesVilleUrls,
    ...regionUrls,
    ...departementUrls,
    ...villeUrls,
    ...pharmacieUrls,
  ];
}
