"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { CaseStudy, Category, Nav, Page, Post, Service } from "@/types/payload-types";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoFull } from "@/components/Logo";

const navLabelTypography = "text-lg font-semibold";

const navLinkStyles = cn(
  "relative inline-flex items-center justify-center px-6 py-3 !text-lg !font-semibold",
  "text-foreground/80 hover:text-foreground",
  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2",
  "after:bg-primary after:transition-all after:duration-300",
  "hover:after:w-full",
  "transition-colors duration-200"
);

const navTriggerStyles = cn(
  "relative inline-flex items-center justify-center gap-2 px-6 py-3 !text-lg !font-semibold",
  "text-foreground/80 hover:text-foreground",
  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2",
  "after:bg-primary after:transition-all after:duration-300",
  "hover:after:w-full data-[state=open]:after:w-full",
  "transition-colors duration-200",
  "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
);

interface NavClientProps {
  data: Nav | null;
}

type NavItem = NonNullable<Nav["navItems"]>[number];
type DropdownLink = NonNullable<NonNullable<NavItem["ddSettings"]>["ddLinks"]>[number];
type HeroLink = NonNullable<NonNullable<NavItem["ddSettings"]>["hero"]>["heroLink"];

type LinkType = DropdownLink["link"] | NavItem["link"] | HeroLink;

function getLinkHref(link: LinkType): string {
  if (link.type === "reference" && link.reference) {
    const { relationTo, value } = link.reference;

    if (typeof value === "object" && value !== null) {
      if (relationTo === "categories") {
        if (typeof value.url === "string" && value.url) return value.url;
        return value.slug ? `/blog/category/${value.slug}` : "/blog/category";
      }

      const slug = (value as Page | Post | Service | CaseStudy | Category).slug;
      if (!slug) return "#";
      if (relationTo === "posts") return `/blog/${slug}`;
      if (relationTo === "services") return `/services/${slug}`;
      if (relationTo === "caseStudies") return `/case-studies/${slug}`;
      return `/${slug}`;
    }
  }

  return link.url || "#";
}

function ListItem({
  title,
  description,
  href,
  className,
}: {
  title: string;
  description?: string | null;
  href: string;
  className?: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group/item block select-none rounded-xl border border-transparent px-4 py-3 no-underline outline-none transition-all duration-200",
            "hover:border-border/70 hover:bg-muted/45 focus:border-border/70 focus:bg-muted/45",
            className
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className={cn(navLabelTypography, "leading-snug text-foreground")}>
                {title}
              </div>
              {description && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-foreground" />
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function HeroCard({
  hero,
}: {
  hero: NonNullable<NavItem["ddSettings"]>["hero"];
}) {
  if (!hero) return null;

  const href = hero.heroLink ? getLinkHref(hero.heroLink) : "#";

  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="group relative flex h-full min-h-[19rem] w-full select-none flex-col overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-muted/65 via-card to-background p-6 no-underline outline-none transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.32em] text-muted-foreground">
          Featured
        </span>
        <div className="mt-auto">
          <div className={cn(navLabelTypography, "leading-tight text-foreground")}>
            {hero.title}
          </div>
          {hero.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {hero.description}
            </p>
          )}
          {hero.heroLink?.label && (
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-foreground/80 transition-colors group-hover:text-foreground">
              {hero.heroLink.label}
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

const NavClient = ({ data }: NavClientProps) => {
  const { navItems = [] } = data || {};

  return (
    <>
      <Link href="/" className="flex items-center">
        <LogoFull className="h-14 w-auto md:h-16" />
      </Link>

      <div className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems && navItems.length > 0 ? (
              navItems.map((navItem) => (
                <NavigationMenuItem key={navItem.id}>
                  {navItem.type === "link" ? (
                    <NavigationMenuLink asChild>
                      <Link href={getLinkHref(navItem.link)} className={navLinkStyles}>
                        {navItem.link.label}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className={navTriggerStyles}>
                        {navItem.ddSettings?.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="p-0">
                        {navItem.ddSettings?.enableHero &&
                        navItem.ddSettings?.hero ? (
                          <div className="grid w-[min(92vw,46rem)] gap-4 p-5 md:grid-cols-[minmax(14rem,0.9fr)_minmax(0,1fr)] md:p-6">
                            <div>
                              <HeroCard hero={navItem.ddSettings.hero} />
                            </div>
                            <ul className="grid content-start gap-2">
                              {navItem.ddSettings?.ddLinks?.map((linkItem) => (
                                <ListItem
                                  key={linkItem.id}
                                  title={linkItem.link.label}
                                  description={linkItem.description}
                                  href={getLinkHref(linkItem.link)}
                                />
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <ul className="grid w-[min(92vw,38rem)] gap-2 p-5 md:grid-cols-2 md:p-6">
                            {navItem.ddSettings?.ddLinks?.map((linkItem) => (
                              <ListItem
                                key={linkItem.id}
                                title={linkItem.link.label}
                                description={linkItem.description}
                                href={getLinkHref(linkItem.link)}
                              />
                            ))}
                          </ul>
                        )}
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={navLinkStyles}>
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/services" className={navLinkStyles}>
                      Services
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/case-studies" className={navLinkStyles}>
                      Case Studies
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog" className={navLinkStyles}>
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle className="hidden md:inline-flex" />
        <MobileNav data={data} />
      </div>
    </>
  );
};

export default NavClient;
