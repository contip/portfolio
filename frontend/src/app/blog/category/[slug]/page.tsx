import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { draftMode } from "next/headers";

import {
  getCachedCollection,
  getCachedDocument,
  getCollection,
  getDocument,
} from "@/lib/payload";
import type {
  Category,
  Media as MediaType,
  Post,
} from "@/types/payload-types";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/Media";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PostCard } from "@/blocks/Blog/PostCard";
import { formatDateTime } from "@/utilities/formatDateTime";
import { generateMeta } from "@/utilities/generateMeta";

interface BlogCategoryPageProps {
  params: Promise<{ slug: string }>;
}

const isMediaObject = (item: unknown): item is MediaType =>
  Boolean(item && typeof item === "object" && "url" in (item as MediaType));

export async function generateStaticParams() {
  try {
    const { docs: categories } = await getCachedCollection<Category>(
      "categories",
      {
        depth: 0,
        pagination: false,
        limit: 1000,
      }
    );

    const params = categories
      .filter((category) => Boolean(category.slug))
      .map((category) => ({ slug: category.slug as string }));

    if (!params.length) {
      return [{ slug: "_placeholder" }];
    }

    return params;
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const category = draft
    ? await getDocument<Category>("categories", slug, {
        depth: 2,
        draft,
      })
    : await getCachedDocument<Category>("categories", slug, {
        depth: 2,
      });

  if (!category) {
    notFound();
  }

  const heroImage = isMediaObject(category.image) ? category.image : null;

  const { docs: posts } = draft
    ? await getCollection<Post>("posts", {
        depth: 2,
        draft,
        limit: 50,
        sort: "-publishedAt",
        where: {
          category: {
            equals: category.id,
          },
        },
      })
    : await getCachedCollection<Post>("posts", {
        depth: 2,
        limit: 50,
        sort: "-publishedAt",
        where: {
          category: {
            equals: category.id,
          },
        },
      });

  return (
    <div className="min-h-screen">
      {draft && <LivePreviewListener />}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <div className="container-art relative pb-16 pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog/category">
                View all categories
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Category
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                {category.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {category.description ||
                  "Posts and delivery notes from this topic area."}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {posts.length} posts
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Updated {formatDateTime(category.updatedAt)}
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-border/60 bg-muted/40 shadow-[0_40px_120px_-80px_rgba(26,22,18,0.85)]">
              {heroImage ? (
                <Media
                  resource={heroImage}
                  fill
                  imgClassName="object-cover"
                  size="(max-width: 768px) 100vw, 420px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                  Category
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-art py-16">
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border/60 bg-card/80 p-12 text-center">
            <h2 className="text-2xl font-semibold">No posts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Publish a post in this category to see it here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const category = draft
    ? await getDocument<Category>("categories", slug, {
        depth: 1,
        draft,
      })
    : await getCachedDocument<Category>("categories", slug, {
        depth: 1,
      });

  return generateMeta({ doc: category });
}
