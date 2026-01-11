import type { Where } from "@/types/payload-types";
import { cacheTag } from "next/cache";
import { stringify } from "qs-esm";

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

interface CachedQueryOptions {
  depth?: number;
  draft?: boolean;
  locale?: string;
  fallbackLocale?: string;
  select?: PayloadSelect;
}

interface CachedCollectionOptions extends CachedQueryOptions {
  where?: Where;
  limit?: number;
  page?: number;
  sort?: string;
  pagination?: boolean;
}

class PayloadApiError extends Error {
  status: number;

  constructor(status: number, statusText: string) {
    super(`Payload API error: ${status} ${statusText}`);
    this.name = "PayloadApiError";
    this.status = status;
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

  const { where, ...rest } = options;
  const queryString = stringify(
    { where, ...rest },
    { addQueryPrefix: true, skipNulls: true }
  );

  return fetchPayload<PayloadListResponse<T>>(`/${collection}${queryString}`, {
    cache: "no-store",
  });
}

export async function getCachedDocument<T>(
  collection: string,
  slug: string,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  "use cache";
  cacheTag(`${collection}-${slug}`);

  const queryString = stringify(
    {
      where: { slug: { equals: slug } },
      limit: 1,
      ...options,
    },
    { addQueryPrefix: true, skipNulls: true }
  );

  const response = await fetchPayload<PayloadListResponse<T>>(
    `/${collection}${queryString}`,
    { cache: "no-store" }
  );

  return response.docs[0] || null;
}

export async function getCachedDocumentByID<T>(
  collection: string,
  id: string,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  "use cache";
  cacheTag(`${collection}-${id}`);

  const queryString = stringify(options, {
    addQueryPrefix: true,
    skipNulls: true,
  });

  try {
    return await fetchPayload<T>(`/${collection}/${id}${queryString}`, {
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof PayloadApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getCachedGlobal<T>(
  slug: string,
  options: CachedQueryOptions = {}
): Promise<T> {
  "use cache";
  cacheTag(`global_${slug}`);

  const queryString = stringify(options, {
    addQueryPrefix: true,
    skipNulls: true,
  });

  return fetchPayload<T>(`/globals/${slug}${queryString}`, {
    cache: "no-store",
  });
}

export async function getPayloadHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/api/lizards?limit=0`, {
      next: { revalidate: 30 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { PAYLOAD_API_URL };
