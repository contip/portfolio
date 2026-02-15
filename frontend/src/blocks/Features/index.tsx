import type { FeaturesBlock as FeaturesBlockProps, Icon } from "@/types/payload-types";
import RichText from "@/components/RichText";
import CMSLink from "@/components/CMSLink";
import { cn } from "@/lib/utils";

const renderIcon = (icon?: number | Icon | null) => {
  if (!icon || typeof icon !== "object" || !icon.svg) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-8 items-center justify-center [&_*]:fill-current [&_*]:stroke-current"
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
};

export const FeaturesBlock = ({
  tagline,
  richText,
  features,
  backgroundColor,
}: FeaturesBlockProps) => {
  const cards = features || [];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/70 p-8 md:p-10",
        "shadow-[0_55px_140px_-95px_rgba(15,23,42,0.8)]",
        backgroundColor || "bg-card/80"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_58%)]" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative z-10">
        {tagline ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.38em] text-muted-foreground">
            {tagline}
          </p>
        ) : null}

        {richText ? (
          <RichText
            data={richText}
            enableGutter={false}
            className="max-w-3xl [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:text-3xl [&_h2]:font-semibold"
          />
        ) : null}

        {cards.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((feature) => {
              const iconMarkup = renderIcon(feature.icon);

              return (
                <article
                  key={feature.id}
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-background/70 p-6",
                    "shadow-[0_35px_90px_-75px_rgba(15,23,42,0.9)] backdrop-blur-sm",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)] opacity-80" />
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card text-primary shadow-sm">
                      {iconMarkup}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{feature.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>

                    {feature.hasLink && feature.link ? (
                      <div className="mt-5">
                        <CMSLink
                          link={{
                            ...feature.link,
                            appearance: feature.link.appearance ?? "text",
                          }}
                          className="text-sm font-semibold"
                        />
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FeaturesBlock;
