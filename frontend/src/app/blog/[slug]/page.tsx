import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { draftMode } from "next/headers";

import {
  getCachedCollection,
  getCachedDocument,
  getDocument,
} from "@/lib/payload";
import type { Category, Media as MediaType, Post } from "@/types/payload-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/Media";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { formatDateTime } from "@/utilities/formatDateTime";
import { PostCard } from "@/blocks/Blog/PostCard";
import { generateMeta } from "@/utilities/generateMeta";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const resolveCategory = (post: Post): Category | null => {
  if (post.category && typeof post.category === "object") {
    return post.category;
  }
  return null;
};

export async function generateStaticParams() {
  try {
    const { docs: posts } = await getCachedCollection<Post>("posts", {
      depth: 0,
      limit: 1000,
    });

    if (!posts.length) {
      return [{ slug: "_placeholder" }];
    }

    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const post = draft
    ? await getDocument<Post>("posts", slug, {
        depth: 2,
        draft,
      })
    : await getCachedDocument<Post>("posts", slug, {
        depth: 2,
      });

  if (!post) {
    notFound();
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === "object"
      ? (post.heroImage as MediaType)
      : null;

  const category = resolveCategory(post);

  const relatedPosts = (post.relatedPosts || [])
    .map((item) => (typeof item === "object" ? item : null))
    .filter((related): related is Post => Boolean(related));

  return (
    <div className="min-h-screen">
      {draft && <LivePreviewListener />}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <div className="container-art relative pb-16 pt-[calc(var(--nav-height)+1rem)] md:pt-[calc(var(--nav-height)+2rem)]">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {category && (
                  <Link href={`/blog/category/${category.slug}`}>
                    <Badge variant="secondary">{category.title}</Badge>
                  </Link>
                )}
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>
                  {post.publishedAt
                    ? formatDateTime(post.publishedAt)
                    : formatDateTime(post.updatedAt)}
                </span>
                {post.readingTime && <span>{post.readingTime} min read</span>}
                {post.populatedAuthor?.name && (
                  <span>{post.populatedAuthor.name}</span>
                )}
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
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  📖
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <article className="container-art py-16">
        <RenderBlocks blocks={post.layout} />
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-border/60 py-16">
          <div className="container-art">
            <h2 className="text-3xl font-semibold">Related Posts</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();

  const post = draft
    ? await getDocument<Post>("posts", slug, {
        depth: 1,
        draft,
      })
    : await getCachedDocument<Post>("posts", slug, {
        depth: 1,
      });

  return generateMeta({ doc: post });
}
