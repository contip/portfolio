import {
  CloudFrontClient,
  CreateInvalidationCommand,
  ListDistributionsCommand,
} from "@aws-sdk/client-cloudfront";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  paths?: string[];
  tags?: string[];
};

const normalizePath = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

const buildCloudFrontPaths = (
  paths: string[] = [],
  tags: string[] = []
): string[] => {
  const output = new Set<string>();

  paths.forEach((path) => {
    if (!path) return;
    output.add(normalizePath(path));
  });

  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      if (tag.startsWith("category:")) {
        const slug = tag.split("category:")[1];
        if (slug) output.add(`/blog/category/${slug}/*`);
      }
      if (tag.startsWith("categories-")) {
        const slug = tag.replace("categories-", "");
        if (slug) output.add(`/blog/category/${slug}`);
      }
      if (tag.startsWith("posts-")) {
        const slug = tag.replace("posts-", "");
        if (slug) output.add(`/blog/${slug}`);
      }
      if (tag.startsWith("services-")) {
        const slug = tag.replace("services-", "");
        if (slug) output.add(`/services/${slug}`);
      }
      if (tag.startsWith("caseStudies-")) {
        const slug = tag.replace("caseStudies-", "");
        if (slug) output.add(`/case-studies/${slug}`);
      }
      if (tag.startsWith("pages-")) {
        const slug = tag.replace("pages-", "");
        output.add(slug === "home" ? "/" : `/${slug}`);
      }
      if (tag === "static-sitemap") {
        output.add("/sitemap.xml");
        output.add("/sitemap.xml.gz");
      }
      if (
        tag === "global_nav" ||
        tag === "global_footer" ||
        tag === "global_about"
      ) {
        output.add("/*");
      }
    });

  return Array.from(output);
};

const resolveDistributionId = async (
  client: CloudFrontClient
): Promise<string | null> => {
  const directId =
    process.env.CLOUDFRONT_ID || process.env.CLOUDFRONT_DISTRIBUTION_ID;
  if (directId) return directId;

  const frontendUrl =
    process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const host = frontendUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!host) return null;

  let marker: string | undefined;

  do {
    const response = await client.send(
      new ListDistributionsCommand({ Marker: marker })
    );
    const list = response.DistributionList;
    const items = list?.Items || [];

    const match = items.find((distribution) => {
      if (distribution.DomainName === host) return true;
      const aliases = distribution.Aliases?.Items || [];
      return aliases.includes(host);
    });

    if (match?.Id) return match.Id;

    marker = list?.NextMarker;
  } while (marker);

  return null;
};

const shouldInvalidateCloudFront = (): boolean => {
  return process.env.APP_STAGE === "production";
};

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const providedSecret =
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!secret || providedSecret !== secret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const paths = Array.isArray(body.paths) ? body.paths : [];
  const tags = Array.isArray(body.tags) ? body.tags : [];

  paths.forEach((path) => {
    revalidatePath(normalizePath(path));
  });

  const tagProfile = { expire: 0 };
  tags.forEach((tag) => {
    revalidateTag(tag, tagProfile);
  });

  const cfPaths = buildCloudFrontPaths(paths, tags);

  let cloudfrontInvalidationId: string | null = null;

  if (cfPaths.length > 0 && shouldInvalidateCloudFront()) {
    try {
      const client = new CloudFrontClient({});
      const distributionId = await resolveDistributionId(client);

      if (!distributionId) {
        console.warn(
          "CloudFront invalidation skipped: distribution ID not found"
        );
      } else {
        const response = await client.send(
          new CreateInvalidationCommand({
            DistributionId: distributionId,
            InvalidationBatch: {
              CallerReference: `reval-${Date.now()}`,
              Paths: {
                Quantity: cfPaths.length,
                Items: cfPaths,
              },
            },
          })
        );

        cloudfrontInvalidationId = response.Invalidation?.Id || null;
      }
    } catch (error) {
      console.error("CloudFront invalidation failed:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    pathsRevalidated: paths.length,
    tagsRevalidated: tags.length,
    cloudfrontInvalidationId,
  });
}
