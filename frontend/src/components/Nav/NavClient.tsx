"use client";

import Link from "next/link";
import { Media } from "@/components/Media";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type {
  Nav,
  Page,
  Post,
  Media as MediaType,
} from "@/types/payload-types";
import { cn } from "@/lib/utils";
import React from "react";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

// Professional nav link styles
const navLinkStyles = cn(
  "relative inline-flex items-center justify-center px-6 py-3 text-xl font-semibold",
  "text-foreground/80 hover:text-foreground",
  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2",
  "after:bg-primary after:transition-all after:duration-300",
  "hover:after:w-full",
  "transition-colors duration-200"
);

// Dropdown trigger styles
const navTriggerStyles = cn(
  "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-xl font-semibold",
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
type DropdownLink = NonNullable<
  NonNullable<NavItem["ddSettings"]>["ddLinks"]
>[number];
type HeroLink = NonNullable<
  NonNullable<NavItem["ddSettings"]>["hero"]
>["heroLink"];

type LinkType = DropdownLink["link"] | NavItem["link"] | HeroLink;

function getLinkHref(link: LinkType): string {
  if (link.type === "reference" && link.reference) {
    const { relationTo, value } = link.reference;
    if (typeof value === "object" && value !== null) {
      const slug = (value as Page | Post).slug;
      return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          )}
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
    <li className="row-span-3">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
        >
          <div className="mb-2 mt-4 text-lg font-medium">{hero.title}</div>
          {hero.description && (
            <p className="text-sm leading-tight text-muted-foreground">
              {hero.description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const NavClient = ({ data }: NavClientProps) => {
  const { logo, brandName = "Conti Digital", navItems = [] } = data || {};
  const logoResource =
    logo && typeof logo === "object" ? (logo as MediaType) : undefined;

  return (
    <>
      {/* Logo + Brand */}
      <Link href="/" className="flex items-center gap-4">
        {logoResource && (
          <div className="relative h-12 w-12 shrink-0">
            <Media resource={logoResource} fill imgClassName="object-contain" />
          </div>
        )}
        <span className="text-xl font-bold tracking-tight">{brandName}</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems && navItems.length > 0 ? (
              navItems.map((navItem) => (
                <NavigationMenuItem key={navItem.id}>
                  {navItem.type === "link" ? (
                    <NavigationMenuLink asChild>
                      <Link
                        href={getLinkHref(navItem.link)}
                        className={navLinkStyles}
                      >
                        {navItem.link.label}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className={navTriggerStyles}>
                        {navItem.ddSettings?.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul
                          className={cn(
                            "grid gap-3 p-4",
                            navItem.ddSettings?.enableHero &&
                              navItem.ddSettings?.hero
                              ? "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
                              : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                          )}
                        >
                          {navItem.ddSettings?.enableHero &&
                            navItem.ddSettings?.hero && (
                              <HeroCard hero={navItem.ddSettings.hero} />
                            )}
                          {navItem.ddSettings?.ddLinks?.map((linkItem) => (
                            <ListItem
                              key={linkItem.id}
                              title={linkItem.link.label}
                              description={linkItem.description}
                              href={getLinkHref(linkItem.link)}
                            />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))
            ) : (
              // Fallback navigation items
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
                    <Link href="/about" className={navLinkStyles}>
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className={navLinkStyles}>
                      Contact
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

        {/* Mobile Navigation */}
        <MobileNav data={data} />
      </div>
    </>
  );
};

export default NavClient;
