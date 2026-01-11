import { getCachedCollection, getCachedDocument } from "@/lib/payload";
import {
  type Lizard,
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

export const Redirects = async ({ disableNotFound, url }: Props) => {
  const { docs: redirects } = await getCachedCollection<Redirect>("redirects");

  const redirectItem = redirects.find((redirect) => redirect.from === url);

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url);
    }

    let redirectUrl: string;

    if (typeof redirectItem.to?.reference?.value === "string") {
      const collection = redirectItem.to?.reference?.relationTo;
      const id = redirectItem.to?.reference?.value;

      const document = (await getCachedDocument<Page | Post | Lizard | Service>(
        collection!,
        id!
      )) as Page | Post | Lizard | Service | null;
      redirectUrl = `${redirectItem.to?.reference?.relationTo !== "pages" ? `/${redirectItem.to?.reference?.relationTo}` : ""}/${
        document?.slug
      }`;
    } else {
      redirectUrl = `${redirectItem.to?.reference?.relationTo !== "pages" ? `/${redirectItem.to?.reference?.relationTo}` : ""}/${
        typeof redirectItem.to?.reference?.value === "object"
          ? redirectItem.to?.reference?.value?.slug
          : ""
      }`;
    }

    if (redirectUrl) redirect(redirectUrl);
  }

  if (disableNotFound) return null;

  notFound();
};
