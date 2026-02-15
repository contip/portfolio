import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { draftMode } from "next/headers";

import { getCachedCollection, getCollection } from "@/lib/payload";
import type { Service } from "@/types/payload-types";
import { Button } from "@/components/ui/button";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { Media } from "@/components/Media";

export default async function ServicesPage() {
  const { isEnabled: draft } = await draftMode();
  const collection = draft ? getCollection : getCachedCollection;

  const { docs: services } = await collection<Service>("services", {
    depth: 2,
    limit: 200,
    sort: "title",
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
              Services
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Complete Cloud & Software Engineering Offerings
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Engagements designed to accelerate delivery, reduce technical
              risk, and create measurable business outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        {services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const heroMedia =
                service.hero?.media && typeof service.hero.media === "object"
                  ? service.hero.media
                  : null;

              return (
                <article
                  key={service.id}
                  className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-[0_35px_110px_-85px_rgba(26,22,18,0.9)]"
                >
                  <Link href={`/services/${service.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {heroMedia ? (
                        <Media
                          resource={heroMedia}
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
                    <h2 className="text-2xl font-semibold tracking-tight">
                      <Link href={`/services/${service.slug}`} className="hover:underline">
                        {service.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      View service
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No services yet</h2>
            <p className="mt-2 text-muted-foreground">
              Add service offerings in Payload to populate this page.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
