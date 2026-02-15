import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import { getCachedCollection, getCachedDocument, getDocument } from "@/lib/payload";
import type { Service } from "@/types/payload-types";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { generateMeta } from "@/utilities/generateMeta";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { docs: services } = await getCachedCollection<Service>("services", {
      depth: 0,
      limit: 1000,
    });

    if (!services.length) {
      return [{ slug: "_placeholder" }];
    }

    return services.map((service) => ({ slug: service.slug }));
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const service = draft
    ? await getDocument<Service>("services", slug, {
        depth: 2,
        draft,
      })
    : await getCachedDocument<Service>("services", slug, {
        depth: 2,
      });

  if (!service) {
    notFound();
  }

  return (
    <article>
      {draft && <LivePreviewListener />}
      {service.hero && <RenderHero {...service.hero} />}
      <MaxWidthWrapper className="py-12 md:py-16">
        <RenderBlocks blocks={service.layout} />
      </MaxWidthWrapper>
    </article>
  );
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const service = draft
    ? await getDocument<Service>("services", slug, {
        depth: 1,
        draft,
      })
    : await getCachedDocument<Service>("services", slug, {
        depth: 1,
      });

  return generateMeta({ doc: service });
}
