// NEXT_PUBLIC_STRAPI_URL is baked in at build time for client-side code
// STRAPI_URL is the runtime env var for server-side code (Lambda)
const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Cat {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  Breed: string; // Capital B - matches Strapi field name
  weight: number;
  age: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getCats(): Promise<Cat[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<Cat[]>>("/cats?populate=*");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cats:", error);
    return [];
  }
}

export async function getCatBySlug(slug: string): Promise<Cat | null> {
  try {
    const response = await fetchStrapi<StrapiResponse<Cat[]>>(
      `/cats?filters[slug][$eq]=${slug}&populate=*`
    );
    return response.data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch cat with slug ${slug}:`, error);
    return null;
  }
}

export async function getStrapiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/_health`, {
      next: { revalidate: 30 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { STRAPI_URL };
