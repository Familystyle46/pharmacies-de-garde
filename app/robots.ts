import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://pharmacies-de-garde.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: SITE_URL.replace(/^https?:\/\//, ""),
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
