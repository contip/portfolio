import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category, Media as MediaType, Post } from "@/types/payload-types";
import { Media } from "@/components/Media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utilities/formatDateTime";
import { cn } from "@/lib/utils";

type FeaturedPostProps = {
  post: Post;
  className?: string;
};

const resolveCategory = (post: Post): Category | null => {
  if (post.category && typeof post.category === "object") {
    return post.category;
  }
  return null;
};

export function FeaturedPost({ post, className }: FeaturedPostProps) {
  const heroImage =
    post.heroImage && typeof post.heroImage === "object"
      ? (post.heroImage as MediaType)
      : null;

  const category = resolveCategory(post);
  const metaDate = post.publishedAt || post.updatedAt;
  const postHref = post.slug ? `/blog/${post.slug}` : "/blog";

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]",
        className
      )}
    >
      <Link
        href={postHref}
        className="group relative isolate overflow-hidden rounded-[32px] border border-border/60 bg-muted/40 shadow-[0_45px_130px_-90px_rgba(26,22,18,0.95)]"
      >
        {heroImage ? (
          <Media
            resource={heroImage}
            fill
            imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            size="(max-width: 1024px) 100vw, 720px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 flex flex-wrap items-center gap-2">
          <Badge className="rounded-full px-3 py-1">Featured</Badge>
          {category?.slug && (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {category.title}
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex h-full flex-col justify-between rounded-[32px] border border-border/60 bg-card/80 p-8 shadow-[0_40px_110px_-90px_rgba(26,22,18,0.95)]">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Featured Story
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {post.title}
          </h2>
          {post.description && (
            <p className="mt-4 text-base text-muted-foreground">
              {post.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {metaDate && <span>{formatDateTime(metaDate)}</span>}
            {post.readingTime && <span>{post.readingTime} min read</span>}
            {post.populatedAuthor?.name && (
              <span>{post.populatedAuthor.name}</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Button asChild className="group">
            <Link href={postHref}>
              Read the story
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {category.title}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
