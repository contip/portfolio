import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { draftMode } from "next/headers";

import { getCachedCollection, getCollection } from "@/lib/payload";
import type { Category, Post } from "@/types/payload-types";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/blocks/Blog/PostCard";
import { FeaturedPost } from "@/blocks/Blog/FeaturedPost";
import { CategoryCard } from "@/blocks/Blog/CategoryCard";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { formatDateTime } from "@/utilities/formatDateTime";

const resolveLatestDate = (posts: Post[]): string | null => {
  let latest: string | null = null;

  posts.forEach((post) => {
    const candidate = post.publishedAt || post.updatedAt;
    if (!candidate) return;
    if (!latest || new Date(candidate) > new Date(latest)) {
      latest = candidate;
    }
  });

  return latest;
};

export default async function BlogPage() {
  const { isEnabled: draft } = await draftMode();
  const collection = draft ? getCollection : getCachedCollection;

  const [postsResponse, featuredResponse, categoriesResponse] =
    await Promise.all([
      collection<Post>("posts", {
        depth: 2,
        limit: 30,
        sort: "-publishedAt",
        draft,
      }),
      collection<Post>("posts", {
        depth: 2,
        limit: 1,
        sort: "-featuredRank",
        where: {
          featured: {
            equals: true,
          },
        },
        draft,
      }),
      collection<Category>("categories", {
        depth: 1,
        pagination: false,
        limit: 100,
        sort: "title",
        draft,
      }),
    ]);

  const posts = postsResponse.docs || [];
  const categories = categoriesResponse.docs || [];
  const featuredPost = featuredResponse.docs?.[0] || posts[0] || null;

  const latestPosts = featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id).slice(0, 9)
    : posts.slice(0, 9);

  const featuredCategories = categories
    .filter((category) => category.featured)
    .sort((a, b) => (b.featuredRank || 0) - (a.featuredRank || 0))
    .slice(0, 4);

  const fallbackCategories = categories.slice(0, 4);
  const displayCategories =
    featuredCategories.length > 0 ? featuredCategories : fallbackCategories;

  const latestDate = resolveLatestDate(posts);
  const totalPosts = postsResponse.totalDocs || posts.length;
  const totalCategories = categoriesResponse.totalDocs || categories.length;
  const totalCategoryPosts = categories.reduce(
    (sum, category) => sum + (category.posts?.totalDocs || 0),
    0
  );

  return (
    <div className="min-h-screen">
      {draft && <LivePreviewListener />}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <div className="container-art relative pb-20 pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Insights
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Engineering Notes & Delivery Playbooks
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Practical writing on cloud architecture, delivery strategy,
                observability, performance, and engineering execution.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-[0_35px_110px_-90px_rgba(26,22,18,0.85)]">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                At a Glance
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
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
                    Categories
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {totalCategories}
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
              {totalCategoryPosts > 0 && (
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {totalCategoryPosts} total entries across the archive
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        {featuredPost ? (
          <FeaturedPost post={featuredPost} />
        ) : (
          <div className="rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No featured post yet</h2>
            <p className="mt-2 text-muted-foreground">
              Mark a post as featured in Payload to spotlight it here.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-16">
        <div className="container-art">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Categories
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Explore by Topic
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Filter content by capability area and delivery theme.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog/category">
                View all categories
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayCategories.length ? (
              displayCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
                <h3 className="text-2xl font-semibold">No categories yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Create categories in Payload to populate this section.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Latest Posts
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              New Articles
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Fresh takes from active client delivery and platform engineering
              work.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blog/category">
              Browse categories
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {latestPosts.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No posts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Publish a post in Payload to see it here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
