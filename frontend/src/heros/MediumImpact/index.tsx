import React from "react";
import type { Page, Media as MediaType } from "@/types/payload-types";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import CMSLink from "@/components/CMSLink";
import { cn } from "@/lib/utils";
import {
  FadeIn,
  MotionStaggerChildren,
  MotionStaggeredChild,
} from "@/components/Motion";

type MediumImpactHeroProps = Page["hero"];

const MediumImpactHero: React.FC<MediumImpactHeroProps> = ({
  richText,
  links,
  media,
  bgColor,
}) => {
  const hasMedia = media && typeof media === "object";

  return (
    <section
      className={cn(
        "relative flex min-h-[70vh] items-center justify-center overflow-hidden",
        bgColor?.startsWith("bg-") ? bgColor : ""
      )}
      style={
        !bgColor?.startsWith("bg-") && bgColor && !hasMedia
          ? { backgroundColor: bgColor }
          : undefined
      }
      data-theme="dark"
    >
      {/* Background Media */}
      {hasMedia && (
        <div className="absolute inset-0 z-0">
          <Media
            fill
            imgClassName="object-cover brightness-[0.55]"
            priority
            resource={media as MediaType}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-28">
        <div className="mx-auto max-w-[42rem] text-center">
          <FadeIn duration={0.7}>
            {richText && (
              <RichText
                className={cn(
                  "mb-8",
                  "[&>h1]:text-4xl [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:tracking-tight",
                  "md:[&>h1]:text-5xl lg:[&>h1]:text-6xl",
                  "[&>h1]:mb-6",
                  "[&>p]:text-lg [&>p]:leading-relaxed [&>p]:font-light",
                  "md:[&>p]:text-xl",
                  hasMedia
                    ? "[&>h1]:text-white [&>p]:text-gray-200 [&>*]:drop-shadow-lg"
                    : "[&>h1]:text-foreground [&>p]:text-muted-foreground",
                  "[&_strong]:text-primary [&_strong]:font-semibold"
                )}
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            )}
          </FadeIn>

          {Array.isArray(links) && links.length > 0 && (
            <MotionStaggerChildren
              as="ul"
              animate="visible"
              staggerChildren={0.12}
              delayChildren={0.3}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {links.map(({ link }, i) => (
                <MotionStaggeredChild
                  key={i}
                  className="h-auto! w-auto!"
                  duration={0.4}
                >
                  <CMSLink
                    link={link}
                    className={cn(
                      "shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
                      (link.appearance as string) === "link" &&
                        hasMedia &&
                        "text-white hover:text-primary"
                    )}
                  />
                </MotionStaggeredChild>
              ))}
            </MotionStaggerChildren>
          )}
        </div>
      </div>

      {/* Bottom fade for smooth transition to content */}
      {hasMedia && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      )}
    </section>
  );
};

export default MediumImpactHero;
