import type { Cat } from "@/types/payload-types";

// NEXT_PUBLIC_PAYLOAD_API_URL is baked in at build time for client-side code
// PAYLOAD_API_URL is the runtime env var for server-side code (Lambda)
const PAYLOAD_API_URL =
  process.env.PAYLOAD_API_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
  "http://localhost:3001";

interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export type { Cat };

async function fetchPayload<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const res = await fetch(`${PAYLOAD_API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getCats(): Promise<Cat[]> {
  try {
    const response = await fetchPayload<PayloadListResponse<Cat>>("/cats");
    return response.docs;
  } catch (error) {
    console.error("Failed to fetch cats:", error);
    return [];
  }
}

export async function getCatBySlug(slug: string): Promise<Cat | null> {
  try {
    const params = new URLSearchParams();
    params.set("where[slug][equals]", slug);
    const response = await fetchPayload<PayloadListResponse<Cat>>(
      `/cats?${params.toString()}`
    );
    return response.docs[0] || null;
  } catch (error) {
    console.error(`Failed to fetch cat with slug ${slug}:`, error);
    return null;
  }
}

export async function getPayloadHealth(): Promise<boolean> {
  try {
    // Payload doesn't have a dedicated health endpoint, so we check if API responds
    const res = await fetch(`${PAYLOAD_API_URL}/api/cats?limit=0`, {
      next: { revalidate: 30 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { PAYLOAD_API_URL };
