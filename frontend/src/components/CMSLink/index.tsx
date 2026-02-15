import Link from "next/link";
import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CaseStudy, Category, Page, Post, Service } from "@/types/payload-types";

type LinkAppearance =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive"
  | "text"
  | "null"
  | null
  | undefined;

type LinkType = {
  type?: ("reference" | "custom") | null;
  newTab?: boolean | null;
  reference?:
    | ({ relationTo: "pages"; value: number | Page } | null)
    | ({ relationTo: "posts"; value: number | Post } | null)
    | ({ relationTo: "services"; value: number | Service } | null)
    | ({ relationTo: "caseStudies"; value: number | CaseStudy } | null)
    | ({ relationTo: "categories"; value: number | Category } | null);
  url?: string | null;
  label: string;
  appearance?: LinkAppearance;
};

interface CMSLinkProps {
  link: LinkType;
  className?: string;
  children?: React.ReactNode;
}

const resolveInternalHref = (link: LinkType): string => {
  const reference = link.reference;
  if (!reference || typeof reference.value !== "object" || !reference.value) {
    return "";
  }

  const value = reference.value;

  if (reference.relationTo === "categories") {
    const category = value as Category;
    if (typeof category.url === "string" && category.url) return category.url;
    return category.slug ? `/blog/category/${category.slug}` : "";
  }

  const slug = value.slug;
  if (!slug) return "";

  if (reference.relationTo === "posts") return `/blog/${slug}`;
  if (reference.relationTo === "services") return `/services/${slug}`;
  if (reference.relationTo === "caseStudies") return `/case-studies/${slug}`;

  return `/${slug}`;
};

export const CMSLink: React.FC<CMSLinkProps> = ({
  link,
  className,
  children,
}) => {
  const {
    type,
    newTab,
    url,
    label,
    appearance = "default",
  } = link;

  let href: string = url || "";

  if (type === "reference") {
    href = resolveInternalHref(link);
  }

  const newTabProps = newTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const isTextLink = appearance === "text" || appearance === "null" || appearance === null;

  const getVariant = (
    value: LinkAppearance
  ): "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" => {
    switch (value) {
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

  if (isTextLink) {
    return (
      <Link
        href={href}
        {...newTabProps}
        className={cn(
          "inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary",
          className
        )}
      >
        {linkContent}
      </Link>
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
