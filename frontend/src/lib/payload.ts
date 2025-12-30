import type { Lizard } from "@/types/payload-types";
import { cacheTag } from "next/cache";

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

type PayloadSelect = Record<string, boolean>;
type PayloadWhere = Record<string, unknown>;

interface CachedQueryOptions {
  depth?: number;
  draft?: boolean;
  locale?: string;
  fallbackLocale?: string;
  select?: PayloadSelect;
}

interface CachedCollectionOptions extends CachedQueryOptions {
  where?: PayloadWhere;
  limit?: number;
  page?: number;
  sort?: string;
  pagination?: boolean;
}

export type { Lizard };

class PayloadApiError extends Error {
  status: number;

  constructor(status: number, statusText: string) {
    super(`Payload API error: ${status} ${statusText}`);
    this.name = "PayloadApiError";
    this.status = status;
  }
}

function appendNestedParams(
  params: URLSearchParams,
  key: string,
  value: unknown
): void {
  if (value === undefined || value === null) {
    return;
  }

  if (value instanceof Date) {
    params.set(key, value.toISOString());
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendNestedParams(params, `${key}[${index}]`, item);
    });
    return;
  }

  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(
      ([entryKey, entryValue]) => {
        appendNestedParams(params, `${key}[${entryKey}]`, entryValue);
      }
    );
    return;
  }

  params.set(key, String(value));
}

function applyCommonParams(
  params: URLSearchParams,
  options?: CachedQueryOptions
): void {
  if (!options) {
    return;
  }

  if (options.depth !== undefined) {
    params.set("depth", String(options.depth));
  }

  if (options.draft !== undefined) {
    params.set("draft", String(options.draft));
  }

  if (options.locale) {
    params.set("locale", options.locale);
  }

  if (options.fallbackLocale) {
    params.set("fallback-locale", options.fallbackLocale);
  }

  if (options.select) {
    appendNestedParams(params, "select", options.select);
  }
}

async function fetchPayload<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const { headers: optionsHeaders, next, cache, ...rest } = options;
  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      ...headers,
      ...optionsHeaders,
    },
  };

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (next) {
    (fetchOptions as RequestInit & { next?: RequestInit["next"] }).next = next;
  } else if (!cache) {
    (fetchOptions as RequestInit & { next?: RequestInit["next"] }).next = {
      revalidate: 60,
    };
  }

  const res = await fetch(`${PAYLOAD_API_URL}/api${endpoint}`, fetchOptions);

  if (!res.ok) {
    throw new PayloadApiError(res.status, res.statusText);
  }

  return res.json();
}

export async function getCachedCollection<T>(
  collection: string,
  options: CachedCollectionOptions = {}
): Promise<PayloadListResponse<T>> {
  "use cache";
  cacheTag(collection);

  const params = new URLSearchParams();

  applyCommonParams(params, options);

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  if (options.page !== undefined) {
    params.set("page", String(options.page));
  }

  if (options.sort) {
    params.set("sort", options.sort);
  }

  if (options.pagination !== undefined) {
    params.set("pagination", String(options.pagination));
  }

  if (options.where) {
    appendNestedParams(params, "where", options.where);
  }

  const query = params.toString();
  const endpoint = query ? `/${collection}?${query}` : `/${collection}`;

  return fetchPayload<PayloadListResponse<T>>(endpoint, { cache: "no-store" });
}

export async function getCachedDocument<T>(
  collection: string,
  slug: string,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  "use cache";
  cacheTag(`${collection}-${slug}`);

  const params = new URLSearchParams();
  params.set("where[slug][equals]", slug);
  params.set("limit", "1");

  applyCommonParams(params, options);

  const query = params.toString();
  const endpoint = query ? `/${collection}?${query}` : `/${collection}`;
  const response = await fetchPayload<PayloadListResponse<T>>(endpoint, {
    cache: "no-store",
  });

  return response.docs[0] || null;
}

export async function getCachedDocumentByID<T>(
  collection: string,
  id: string,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  "use cache";
  cacheTag(`${collection}-${id}`);

  const params = new URLSearchParams();
  applyCommonParams(params, options);

  const query = params.toString();
  const endpoint = query
    ? `/${collection}/${id}?${query}`
    : `/${collection}/${id}`;

  try {
    return await fetchPayload<T>(endpoint, { cache: "no-store" });
  } catch (error) {
    if (error instanceof PayloadApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getLizards(): Promise<Lizard[]> {
  try {
    const response = await getCachedCollection<Lizard>("lizards");
    return response.docs;
  } catch (error) {
    console.error("Failed to fetch lizards:", error);
    return [];
  }
}

export async function getLizardBySlug(slug: string): Promise<Lizard | null> {
  try {
    return await getCachedDocument<Lizard>("lizards", slug);
  } catch (error) {
    console.error(`Failed to fetch lizard with slug ${slug}:`, error);
    return null;
  }
}

export async function getPayloadHealth(): Promise<boolean> {
  try {
    // Payload doesn't have a dedicated health endpoint, so we check if API responds
    const res = await fetch(`${PAYLOAD_API_URL}/api/lizards?limit=0`, {
      next: { revalidate: 30 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// export async function getCachedDocument<T>(
//   collection: string,
//   depth: number,
//   slug?: string,
//   id?: string,
//   select?: { [k: string]: true }
// ): Promise<T | null> {
//   "use cache";
//   const params = new URLSearchParams();
// }

export { PAYLOAD_API_URL };
