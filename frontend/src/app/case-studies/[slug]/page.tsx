import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { draftMode } from "next/headers";

import { getCachedCollection, getCachedDocument, getDocument } from "@/lib/payload";
import type { CaseStudy, Service } from "@/types/payload-types";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateMeta } from "@/utilities/generateMeta";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { docs: caseStudies } = await getCachedCollection<CaseStudy>(
      "caseStudies",
      {
        depth: 0,
        limit: 1000,
      }
    );

    if (!caseStudies.length) {
      return [{ slug: "_placeholder" }];
    }

    return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

const resolveServices = (caseStudy: CaseStudy): Service[] => {
  const services = caseStudy.services || [];
  return services.filter(
    (service): service is Service =>
      typeof service === "object" && service !== null
  );
};

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const caseStudy = draft
    ? await getDocument<CaseStudy>("caseStudies", slug, {
        depth: 2,
        draft,
      })
    : await getCachedDocument<CaseStudy>("caseStudies", slug, {
        depth: 2,
      });

  if (!caseStudy) {
    notFound();
  }

  const services = resolveServices(caseStudy);

  return (
    <article>
      {draft && <LivePreviewListener />}
      <section className="container-art pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/case-studies">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Studies
          </Link>
        </Button>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {caseStudy.industry && (
            <Badge variant="secondary">{caseStudy.industry}</Badge>
          )}
          {caseStudy.clientName && <Badge>{caseStudy.clientName}</Badge>}
          {caseStudy.engagementDuration && (
            <Badge variant="outline">{caseStudy.engagementDuration}</Badge>
          )}
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <Badge variant="outline">{service.title}</Badge>
            </Link>
          ))}
        </div>
      </section>

      {caseStudy.hero && <RenderHero {...caseStudy.hero} />}

      <MaxWidthWrapper className="py-12 md:py-16">
        {caseStudy.summary ? (
          <p className="mb-8 max-w-3xl text-lg text-muted-foreground">
            {caseStudy.summary}
          </p>
        ) : null}

        {caseStudy.keyResults && caseStudy.keyResults.length > 0 ? (
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            {caseStudy.keyResults.map((result) => (
              <div
                key={result.id}
                className="rounded-2xl border border-border/70 bg-card/80 p-5"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {result.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{result.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <RenderBlocks blocks={caseStudy.layout} />
      </MaxWidthWrapper>
    </article>
  );
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const caseStudy = draft
    ? await getDocument<CaseStudy>("caseStudies", slug, {
        depth: 1,
        draft,
      })
    : await getCachedDocument<CaseStudy>("caseStudies", slug, {
        depth: 1,
      });

  return generateMeta({ doc: caseStudy });
}
