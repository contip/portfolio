"use client";

import React, { useRef } from "react";
import type { Page, Media as MediaType } from "@/types/payload-types";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import CMSLink from "@/components/CMSLink";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import {
  FadeIn,
  MotionStaggerChildren,
  MotionStaggeredChild,
  ScrollIndicator,
} from "@/components/Motion";

type HighImpactHeroProps = Page["hero"];

const HighImpactHero: React.FC<HighImpactHeroProps> = ({
  richText,
  links,
  media,
  bgColor,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const hasMedia = media && typeof media === "object";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        bgColor?.startsWith("bg-") ? bgColor : ""
      )}
      style={
        !bgColor?.startsWith("bg-") && bgColor && !hasMedia
          ? { backgroundColor: bgColor }
          : undefined
      }
      data-theme="dark"
    >
      {/* Parallax Background Media */}
      {hasMedia && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 scale-110">
            <Media
              fill
              imgClassName="object-cover brightness-[0.45]"
              priority
              resource={media as MediaType}
            />
          </div>
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      )}

      {/* Animated Content */}
      <motion.div
        className="container relative z-10 py-24 md:py-32"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="mx-auto max-w-[44rem] text-center">
          {/* Main Content */}
          <FadeIn>
            {richText && (
              <RichText
                className={cn(
                  "mb-8",
                  "[&>h1]:text-5xl [&>h1]:font-extrabold [&>h1]:leading-[1.1] [&>h1]:tracking-tight",
                  "md:[&>h1]:text-6xl lg:[&>h1]:text-7xl",
                  "[&>h1]:mb-6",
                  "[&>p]:text-lg [&>p]:leading-relaxed [&>p]:font-light",
                  "md:[&>p]:text-xl lg:[&>p]:text-2xl",
                  hasMedia
                    ? "[&>h1]:text-white [&>p]:text-gray-300 [&>*]:drop-shadow-2xl"
                    : "[&>h1]:text-foreground [&>p]:text-muted-foreground",
                  "[&_strong]:text-primary [&_strong]:font-bold",
                  "[&>h1]:bg-gradient-to-r [&>h1]:from-white [&>h1]:to-gray-300 [&>h1]:bg-clip-text",
                  hasMedia && "[&>h1]:text-transparent"
                )}
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            )}
          </FadeIn>

          {/* Links with staggered animation */}
          {Array.isArray(links) && links.length > 0 && (
            <MotionStaggerChildren
              as="ul"
              animate="visible"
              staggerChildren={0.15}
              delayChildren={0.4}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-6"
            >
              {links.map(({ link }, i) => (
                <MotionStaggeredChild
                  key={i}
                  className="h-auto! w-auto!"
                  duration={0.5}
                >
                  <CMSLink
                    link={link}
                    className={cn(
                      "shadow-xl transition-all duration-300",
                      "hover:shadow-2xl hover:-translate-y-1 hover:scale-105",
                      "text-base md:text-lg px-6 py-3 md:px-8 md:py-4",
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
      </motion.div>

      {/* Scroll indicator - mobile only */}
      <ScrollIndicator className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 md:hidden" />

      {/* Bottom fade for smooth transition */}
      {hasMedia && (
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />
      )}
    </section>
  );
};

export default HighImpactHero;
