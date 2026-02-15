import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Media } from "@/components/Media";
import { formatDateTime } from "@/utilities/formatDateTime";
import type {
  Category,
  Media as MediaType,
  Post,
} from "@/types/payload-types";

type PostCardProps = {
  post: Post;
};

const resolveCategory = (post: Post): Category | null => {
  if (post.category && typeof post.category === "object") {
    return post.category;
  }
  return null;
};

export function PostCard({ post }: PostCardProps) {
  const heroImage =
    post.heroImage && typeof post.heroImage === "object"
      ? (post.heroImage as MediaType)
      : null;

  const category = resolveCategory(post);
  const categoryUrl = category?.slug ? `/blog/category/${category.slug}` : null;
  const metaDate = post.publishedAt || post.updatedAt;
  const postHref = post.slug ? `/blog/${post.slug}` : "/blog";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-[0_35px_110px_-85px_rgba(26,22,18,0.85)] transition-all duration-300 hover:-translate-y-1 hover:border-border/90 hover:shadow-[0_45px_130px_-85px_rgba(26,22,18,0.9)]">
      <Link href={postHref} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {heroImage ? (
            <Media
              resource={heroImage}
              fill
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              size="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
            {category && categoryUrl && (
              <Link href={categoryUrl}>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {category.title}
                </Badge>
              </Link>
            )}
            {post.featured && (
              <Badge className="rounded-full px-3 py-1">Featured</Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            <Link href={postHref} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          {post.description && (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {metaDate && <span>{formatDateTime(metaDate)}</span>}
          {post.readingTime && <span>{post.readingTime} min read</span>}
          {post.populatedAuthor?.name && (
            <span>{post.populatedAuthor.name}</span>
          )}
        </div>

        <Link
          href={postHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          Read story
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
