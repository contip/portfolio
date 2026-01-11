"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Post, Media as MediaType } from "@/types/payload-types";
import { Media } from "@/components/Media";
import { formatDateTime } from "@/utilities/formatDateTime";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/Motion";

interface BlogHeroProps {
  post: Post;
}

const BlogHero: React.FC<BlogHeroProps> = ({ post }) => {
  const { title, heroImage, publishedAt, category } = post;
  const hasHeroImage = heroImage && typeof heroImage !== "number";

  return (
    <section className="relative -mt-[var(--nav-height)] w-full">
      {/* Hero Image Background */}
      {hasHeroImage && (
        <div className="absolute inset-0 h-[70vh] overflow-hidden">
          <Media
            fill
            priority
            imgClassName="object-cover"
            resource={heroImage as MediaType}
          />
          {/* Sophisticated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>
      )}

      {/* Content Wrapper */}
      <div
        className={cn(
          "relative z-10 flex flex-col justify-between",
          hasHeroImage
            ? "h-[70vh] pt-[var(--nav-height)]"
            : "bg-muted/30 py-16 md:py-24"
        )}
      >
        {/* Top Navigation Bar */}
        <FadeIn
          className="container mx-auto px-4 pt-6 md:pt-8"
          y={-20}
          duration={0.5}
          delay={0.1}
        >
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <Link
                href="/posts"
                className={cn(
                  "group flex items-center gap-2 text-sm font-semibold transition-all duration-300",
                  "md:text-base",
                  hasHeroImage
                    ? "text-white/90 hover:text-white drop-shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to Blog</span>
              </Link>

              {/* Meta Info */}
              <div
                className={cn(
                  "flex items-center gap-4 text-sm font-medium",
                  hasHeroImage
                    ? "text-white/80 drop-shadow-lg"
                    : "text-muted-foreground"
                )}
              >
                {category && typeof category === "object" && (
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                    {category.title}
                  </span>
                )}
                {publishedAt && (
                  <time
                    dateTime={publishedAt}
                    className="flex items-center gap-1.5"
                  >
                    <Calendar className="h-4 w-4" />
                    {formatDateTime(publishedAt)}
                  </time>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Title Section */}
        <FadeIn
          className="container mx-auto px-4 pb-12"
          y={30}
          duration={0.6}
          delay={0.3}
        >
          <div className="mx-auto max-w-5xl">
            {hasHeroImage ? (
              <div className="relative">
                <div className="rounded-2xl bg-black/40 px-8 py-8 backdrop-blur-md md:px-12 md:py-10">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-xl md:text-4xl lg:text-5xl xl:text-6xl">
                    {title}
                  </h1>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl xl:text-6xl">
                  {title}
                </h1>
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Fallback background when no hero image */}
      {!hasHeroImage && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 to-background" />
      )}
    </section>
  );
};

export default BlogHero;
