import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { draftMode } from "next/headers";

import { getCachedCollection, getCollection } from "@/lib/payload";
import type { CaseStudy, Media as MediaType } from "@/types/payload-types";
import { Button } from "@/components/ui/button";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { Media } from "@/components/Media";

const resolveHero = (caseStudy: CaseStudy): MediaType | null => {
  if (caseStudy.heroImage && typeof caseStudy.heroImage === "object") {
    return caseStudy.heroImage;
  }

  if (caseStudy.hero?.media && typeof caseStudy.hero.media === "object") {
    return caseStudy.hero.media;
  }

  return null;
};

export default async function CaseStudiesPage() {
  const { isEnabled: draft } = await draftMode();
  const collection = draft ? getCollection : getCachedCollection;

  const { docs: caseStudies } = await collection<CaseStudy>("caseStudies", {
    depth: 2,
    limit: 200,
    sort: "-publishedAt",
    draft,
  });

  return (
    <div className="min-h-screen">
      {draft && <LivePreviewListener />}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <div className="container-art relative pb-20 pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>

          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Case Studies
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Proven Delivery Outcomes
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Real projects, real constraints, and measurable impact across cloud
              migrations, platform modernization, and software delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        {caseStudies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((caseStudy) => {
              const hero = resolveHero(caseStudy);

              return (
                <article
                  key={caseStudy.id}
                  className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-[0_35px_110px_-85px_rgba(26,22,18,0.9)]"
                >
                  <Link href={`/case-studies/${caseStudy.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {hero ? (
                        <Media
                          resource={hero}
                          fill
                          imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          size="(max-width: 1024px) 100vw, 500px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    </div>
                  </Link>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {caseStudy.industry || "Case Study"}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      <Link
                        href={`/case-studies/${caseStudy.slug}`}
                        className="hover:underline"
                      >
                        {caseStudy.title}
                      </Link>
                    </h2>
                    {caseStudy.summary && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {caseStudy.summary}
                      </p>
                    )}
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      View case study
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No case studies yet</h2>
            <p className="mt-2 text-muted-foreground">
              Add case studies in Payload to populate this page.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
