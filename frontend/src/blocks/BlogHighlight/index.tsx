import type {
  BlogHighlightBlock as BlogHighlightBlockProps,
  Post,
} from "@/types/payload-types";
import { PostCard } from "../Blog/PostCard";

const resolveFeaturedPosts = (
  featuredPosts: BlogHighlightBlockProps["featuredPosts"]
) => {
  if (!featuredPosts) return [];
  return featuredPosts
    .map((post) => (typeof post === "object" ? (post as Post) : null))
    .filter((post): post is Post => Boolean(post));
};

export const BlogHighlightBlock = (props: BlogHighlightBlockProps) => {
  const { title, subtitle } = props;
  const posts = resolveFeaturedPosts(props.featuredPosts);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        {title && <h2 className="text-3xl font-semibold">{title}</h2>}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No featured posts selected yet.
        </div>
      )}
    </section>
  );
};
