/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || "https://pharmacies-de-garde.net",
  generateRobotsTxt: true,
  exclude: [],
};
