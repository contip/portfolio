import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Post } from "@/types/payload-types";

type LinkAppearance =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive"
  | null
  | undefined;

type LinkType = {
  type?: ("reference" | "custom") | null;
  newTab?: boolean | null;
  reference?:
    | ({
        relationTo: "pages";
        value: number | Page;
      } | null)
    | ({
        relationTo: "posts";
        value: number | Post;
      } | null);
  url?: string | null;
  label: string;
  appearance?: LinkAppearance;
};

interface CMSLinkProps {
  link: LinkType;
  className?: string;
  children?: React.ReactNode;
}

export const CMSLink: React.FC<CMSLinkProps> = ({
  link,
  className,
  children,
}) => {
  const {
    type,
    newTab,
    reference,
    url,
    label,
    appearance = "default",
  } = link;

  let href: string = url || "";

  if (type === "reference" && reference) {
    const { relationTo, value } = reference;
    if (typeof value === "object" && value !== null) {
      const slug = value.slug;
      href = relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
    }
  }

  const newTabProps = newTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  // Map appearance to button variant
  const getVariant = (
    appearance: LinkAppearance
  ): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
    switch (appearance) {
      case "outline":
        return "outline";
      case "secondary":
        return "secondary";
      case "ghost":
        return "ghost";
      case "link":
        return "link";
      case "destructive":
        return "destructive";
      default:
        return "default";
    }
  };

  const variant = getVariant(appearance);

  const linkContent = children || label;

  if (!href) {
    return (
      <Button variant={variant} className={className}>
        {linkContent}
      </Button>
    );
  }

  return (
    <Link
      href={href}
      {...newTabProps}
      className={cn(buttonVariants({ variant }), className)}
    >
      {linkContent}
    </Link>
  );
};

export default CMSLink;
