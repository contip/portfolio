import { getServerSideSitemap } from "next-sitemap";
import { cacheTag } from "next/cache";
import { getCachedCollection } from "@/lib/payload";
import type {
  CaseStudy,
  Category,
  Page,
  Post,
  Service,
} from "@/types/payload-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  "https://example.com";

async function getSitemap() {
  "use cache";
  cacheTag("static-sitemap");

  const dateFallback = new Date().toISOString();

  const { docs: pages } = await getCachedCollection<Page>("pages", {
    depth: 0,
    pagination: false,
    limit: 10000,
  });

  const { docs: services } = await getCachedCollection<Service>("services", {
    depth: 0,
    pagination: false,
    limit: 10000,
  });

  const { docs: caseStudies } = await getCachedCollection<CaseStudy>(
    "caseStudies",
    {
      depth: 0,
      pagination: false,
      limit: 10000,
    }
  );

  const { docs: posts } = await getCachedCollection<Post>("posts", {
    depth: 0,
    pagination: false,
    limit: 10000,
  });

  const { docs: categories } = await getCachedCollection<Category>(
    "categories",
    {
      depth: 0,
      pagination: false,
      limit: 10000,
    }
  );

  const staticRoutes = [
    {
      loc: SITE_URL,
      lastmod: dateFallback,
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/services`,
      lastmod: dateFallback,
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/case-studies`,
      lastmod: dateFallback,
      priority: 0.85,
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: dateFallback,
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/category`,
      lastmod: dateFallback,
      priority: 0.7,
    },
  ];

  const pageRoutes = pages
    .filter((page) => Boolean(page?.slug))
    .map((page) => ({
      loc: page.slug === "home" ? SITE_URL : `${SITE_URL}/${page.slug ?? ""}`,
      lastmod: page.updatedAt || dateFallback,
      priority: page.slug === "home" ? 1.0 : 0.75,
    }));

  const serviceRoutes = services
    .filter((service) => Boolean(service?.slug))
    .map((service) => ({
      loc: `${SITE_URL}/services/${service.slug}`,
      lastmod: service.updatedAt || dateFallback,
      priority: 0.75,
    }));

  const caseStudyRoutes = caseStudies
    .filter((caseStudy) => Boolean(caseStudy?.slug))
    .map((caseStudy) => ({
      loc: `${SITE_URL}/case-studies/${caseStudy.slug}`,
      lastmod: caseStudy.updatedAt || dateFallback,
      priority: 0.75,
    }));

  const blogRoutes = posts
    .filter((post) => Boolean(post?.slug))
    .map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: post.updatedAt || dateFallback,
      priority: 0.7,
    }));

  const categoryRoutes = categories
    .filter((category) => Boolean(category?.slug))
    .map((category) => ({
      loc: `${SITE_URL}/blog/category/${category.slug}`,
      lastmod: category.updatedAt || dateFallback,
      priority: 0.65,
    }));

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...serviceRoutes,
    ...caseStudyRoutes,
    ...blogRoutes,
    ...categoryRoutes,
  ];
}

export async function GET() {
  const sitemap = await getSitemap();
  return getServerSideSitemap(sitemap);
}
