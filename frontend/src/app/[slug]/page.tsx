import type { Metadata } from "next";
import { Redirects } from "@/components/Redirects";
import { draftMode } from "next/headers";
import { getCachedDocument, getCachedCollection } from "@/lib/payload";
import { type Page } from "@/types/payload-types";
import { cache } from "react";
import { generateMeta } from "@/utilities/generateMeta";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export async function generateStaticParams() {
  const pages = await getCachedCollection<Page>("pages", {
    depth: 0,
    select: { slug: true },
    pagination: false,
    draft: false,
    limit: 10000,
  });
  const params = pages.docs
    ?.filter((doc) => doc.slug !== "home")
    .map(({ slug }) => ({ slug }));
  return params;
}

type Args = {
  params: Promise<{ slug: string }>;
};

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  const page = await getCachedDocument<Page>("pages", slug, { draft });
  return page;
});

export default async function Page({ params }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const url = "/" + decodedSlug;
  let page: Page | null = null;
  page = await queryPageBySlug({ slug: decodedSlug });
  if (!page) {
    return <Redirects url={url} />;
  }

  const { hero, layout } = page;
  return (
    <article>
      <Redirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      {hero && <RenderHero {...hero} />}
      <MaxWidthWrapper className="py-12 md:py-16">
        {layout && <RenderBlocks blocks={layout} />}
      </MaxWidthWrapper>
    </article>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug);
  const page = await queryPageBySlug({
    slug: decodedSlug,
  });

  return generateMeta({ doc: page });
}
