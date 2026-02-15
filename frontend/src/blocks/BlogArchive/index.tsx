import RichText from "@/components/RichText";
import { getCachedCollection, getCollection } from "@/lib/payload";
import type {
  BlogArchiveBlock as BlogArchiveBlockProps,
  Post,
  Where,
} from "@/types/payload-types";
import { PostCard } from "../Blog/PostCard";
import { draftMode } from "next/headers";

const resolveSelectedPosts = (
  selectedDocs: BlogArchiveBlockProps["selectedDocs"]
) => {
  if (!selectedDocs) return [];
  return selectedDocs
    .map((doc) => {
      if (doc && typeof doc === "object" && "value" in doc) {
        return typeof doc.value === "object" ? (doc.value as Post) : null;
      }
      return null;
    })
    .filter((post): post is Post => Boolean(post));
};

const resolveCategoryIds = (
  categories: BlogArchiveBlockProps["categories"]
) => {
  if (!categories) return [];
  return categories
    .map((category) => {
      if (typeof category === "object" && category !== null) {
        return category.id;
      }
      return category;
    })
    .filter((id): id is number => typeof id === "number");
};

const loadPosts = async (
  block: BlogArchiveBlockProps,
  draft: boolean
): Promise<Post[]> => {
  if (block.populateBy === "selection") {
    return resolveSelectedPosts(block.selectedDocs);
  }

  const where: Where = {};
  const categoryIds = resolveCategoryIds(block.categories);
  if (categoryIds.length > 0) {
    where.category = { in: categoryIds };
  }

  const { docs } = draft
    ? await getCollection<Post>("posts", {
        limit: block.limit ?? 12,
        where,
        draft,
      })
    : await getCachedCollection<Post>("posts", {
        limit: block.limit ?? 12,
        where,
      });

  return docs;
};

export const BlogArchiveBlock = async (props: BlogArchiveBlockProps) => {
  const { introContent } = props;
  const { isEnabled: draft } = await draftMode();
  const posts = await loadPosts(props, draft);

  return (
    <section className="space-y-8">
      {introContent && <RichText data={introContent} enableGutter={false} />}

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No posts available yet.
        </div>
      )}
    </section>
  );
};
