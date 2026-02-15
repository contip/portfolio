import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { draftMode } from "next/headers";

import { getCachedCollection, getCollection } from "@/lib/payload";
import type { Category } from "@/types/payload-types";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/blocks/Blog/CategoryCard";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { formatDateTime } from "@/utilities/formatDateTime";

const resolveLatestDate = (categories: Category[]): string | null => {
  let latest: string | null = null;

  categories.forEach((category) => {
    const candidate = category.updatedAt;
    if (!candidate) return;
    if (!latest || new Date(candidate) > new Date(latest)) {
      latest = candidate;
    }
  });

  return latest;
};

const sortCategories = (categories: Category[]) => {
  return [...categories].sort((a, b) => {
    const featuredA = a.featured ? 1 : 0;
    const featuredB = b.featured ? 1 : 0;
    if (featuredA !== featuredB) return featuredB - featuredA;

    const rankA = a.featuredRank || 0;
    const rankB = b.featuredRank || 0;
    if (rankA !== rankB) return rankB - rankA;

    return (a.title || "").localeCompare(b.title || "");
  });
};

export default async function BlogCategoryIndexPage() {
  const { isEnabled: draft } = await draftMode();
  const collection = draft ? getCollection : getCachedCollection;

  const { docs: categories, totalDocs } = await collection<Category>(
    "categories",
    {
      depth: 1,
      pagination: false,
      limit: 100,
      sort: "title",
      draft,
    }
  );

  const sortedCategories = sortCategories(categories || []);
  const totalCategories = totalDocs || sortedCategories.length;
  const totalPosts = sortedCategories.reduce(
    (sum, category) => sum + (category.posts?.totalDocs || 0),
    0
  );
  const latestDate = resolveLatestDate(sortedCategories);

  return (
    <div className="min-h-screen">
      {draft && <LivePreviewListener />}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <div className="container-art relative pb-20 pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Categories
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Explore the Archive by Theme
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Browse technical topics grouped by delivery patterns and platform
                capabilities.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-[0_35px_110px_-90px_rgba(26,22,18,0.85)]">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Overview
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Categories
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {totalCategories}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Posts
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {totalPosts}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Updated
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {latestDate ? formatDateTime(latestDate) : "—"}
                  </p>
                </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Looking for all posts?</span>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 font-semibold text-foreground"
                >
                  View insights
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        {sortedCategories.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No categories yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create categories in Payload to build your blog archive.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
