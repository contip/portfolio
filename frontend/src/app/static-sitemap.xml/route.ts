import { getServerSideSitemap } from "next-sitemap";
import { cacheTag } from "next/cache";
import { getCachedCollection } from "@/lib/payload";
import type { Lizard } from "@/types/payload-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  "https://example.com";

async function getSitemap() {
  "use cache";
  cacheTag("static-sitemap");

  const dateFallback = new Date().toISOString();

  const { docs: lizards } = await getCachedCollection<Lizard>("lizards");

  const staticRoutes = [
    {
      loc: SITE_URL,
      lastmod: dateFallback,
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/lizards`,
      lastmod: dateFallback,
      priority: 0.8,
    },
  ];

  const lizardRoutes = lizards
    .filter((lizard) => Boolean(lizard?.slug))
    .map((lizard) => ({
      loc: `${SITE_URL}/lizards/${lizard.slug}`,
      lastmod: lizard.updatedAt || dateFallback,
      priority: 0.6,
    }));

  return [...staticRoutes, ...lizardRoutes];
}

export async function GET() {
  const sitemap = await getSitemap();
  return getServerSideSitemap(sitemap);
}
