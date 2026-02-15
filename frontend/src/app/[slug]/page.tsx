import type { Metadata } from "next";
import { Redirects } from "@/components/Redirects";
import { draftMode } from "next/headers";
import { getCachedCollection, getCachedDocument, getDocument } from "@/lib/payload";
import { type Page } from "@/types/payload-types";
import { generateMeta } from "@/utilities/generateMeta";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export async function generateStaticParams() {
  try {
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

    if (!params || params.length === 0) {
      return [{ slug: "home" }];
    }

    return params;
  } catch {
    return [{ slug: "home" }];
  }
}

type Args = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const url = "/" + decodedSlug;

  const page = draft
    ? await getDocument<Page>("pages", decodedSlug, { draft })
    : await getCachedDocument<Page>("pages", decodedSlug);

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
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await paramsPromise;
  const decodedSlug = decodeURIComponent(slug);

  const page = draft
    ? await getDocument<Page>("pages", decodedSlug, { draft })
    : await getCachedDocument<Page>("pages", decodedSlug);

  return generateMeta({ doc: page });
}
