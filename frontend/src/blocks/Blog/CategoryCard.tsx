import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category, Media as MediaType } from "@/types/payload-types";
import { Media } from "@/components/Media";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

const resolveImage = (category: Category): MediaType | null => {
  if (category.image && typeof category.image === "object") {
    return category.image as MediaType;
  }
  return null;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const heroImage = resolveImage(category);
  const postCount = category.posts?.totalDocs ?? 0;
  const showCount = Number.isFinite(postCount) && postCount > 0;
  const href = category.slug ? `/blog/category/${category.slug}` : "/blog/category";

  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate flex h-full min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-[0_35px_110px_-85px_rgba(26,22,18,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-border/90 hover:shadow-[0_45px_130px_-85px_rgba(26,22,18,0.9)]",
        className
      )}
    >
      {heroImage ? (
        <div className="absolute inset-0">
          <Media
            resource={heroImage}
            fill
            imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            size="(max-width: 1024px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
      )}

      <div className="relative mt-auto flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {category.featured && (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Featured
            </Badge>
          )}
          {showCount && <span>{postCount} posts</span>}
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{category.title}</h3>
          {category.description && (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Explore Category
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
