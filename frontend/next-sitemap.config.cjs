const SITE_URL = process.env.FRONTEND_URL || "https://example.com";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ["/static-sitemap.xml"],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        // disallow all during development
        disallow: ["*"],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/static-sitemap.xml`],
  },
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
};
