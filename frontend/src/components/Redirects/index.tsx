import { getCachedCollection, getCachedDocumentByID } from "@/lib/payload";
import {
  type CaseStudy,
  type Category,
  type Page,
  type Post,
  type Service,
  Redirect,
} from "@/types/payload-types";
import { notFound, redirect } from "next/navigation";

interface Props {
  disableNotFound?: boolean;
  url: string;
}

type RedirectDocument =
  | Page
  | Post
  | Service
  | CaseStudy
  | Category
  | {
      slug?: string | null;
      url?: string | null;
    };

const getCollectionBasePath = (relationTo?: string | null) => {
  switch (relationTo) {
    case "posts":
      return "/blog";
    case "categories":
      return "/blog/category";
    case "services":
      return "/services";
    case "caseStudies":
      return "/case-studies";
    default:
      return "";
  }
};

const resolveRedirectUrl = (
  relationTo: string | null | undefined,
  document: RedirectDocument | null
) => {
  if (!document) return "";

  if ("url" in document && typeof document.url === "string" && document.url) {
    return document.url;
  }

  const slug = document.slug;
  if (!slug) return "";

  const basePath = getCollectionBasePath(relationTo);
  return basePath ? `${basePath}/${slug}` : `/${slug}`;
};

export const Redirects = async ({ disableNotFound, url }: Props) => {
  const { docs: redirects } = await getCachedCollection<Redirect>("redirects");

  const redirectItem = redirects.find((item) => item.from === url);

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url);
    }

    let redirectUrl = "";

    if (typeof redirectItem.to?.reference?.value === "string") {
      const collection = redirectItem.to.reference.relationTo;
      const id = redirectItem.to.reference.value;

      const document = await getCachedDocumentByID<RedirectDocument>(
        collection,
        id
      );
      redirectUrl = resolveRedirectUrl(collection, document);
    } else {
      const reference = redirectItem.to?.reference;
      const value =
        typeof reference?.value === "object"
          ? (reference.value as RedirectDocument)
          : null;

      redirectUrl = resolveRedirectUrl(reference?.relationTo, value);
    }

    if (redirectUrl) redirect(redirectUrl);
  }

  if (disableNotFound) return null;

  notFound();
};
