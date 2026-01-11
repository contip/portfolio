"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Nav, Page, Post } from "@/types/payload-types";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoIcon } from "@/components/Logo";

interface MobileNavProps {
  data: Nav | null;
}

type NavItem = NonNullable<Nav["navItems"]>[number];
type DropdownLink = NonNullable<
  NonNullable<NavItem["ddSettings"]>["ddLinks"]
>[number];

function getLinkHref(link: DropdownLink["link"] | NavItem["link"]): string {
  if (link.type === "reference" && link.reference) {
    const { relationTo, value } = link.reference;
    if (typeof value === "object" && value !== null) {
      const slug = (value as Page | Post).slug;
      return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
    }
  }
  return link.url || "#";
}

const MobileNav = ({ data }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavItem | null>(null);

  const { navItems = [] } = data || {};

  const handleClose = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const handleLinkClick = () => {
    handleClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-80 flex-col p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8" />
            <span className="text-lg font-semibold">Peter T Conti</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          {activeDropdown ? (
            // Dropdown submenu view
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="mb-4 flex w-full items-center justify-start gap-2 px-2"
                onClick={() => setActiveDropdown(null)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <div className="mb-4 px-2">
                <h3 className="text-lg font-semibold">
                  {activeDropdown.ddSettings?.title}
                </h3>
              </div>

              {activeDropdown.ddSettings?.ddLinks?.map((linkItem) => (
                <Link
                  key={linkItem.id}
                  href={getLinkHref(linkItem.link)}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex flex-col gap-1 rounded-md px-3 py-3 transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="font-medium">{linkItem.link.label}</span>
                  {linkItem.description && (
                    <span className="text-sm text-muted-foreground">
                      {linkItem.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            // Main menu view
            <nav className="space-y-1">
              {navItems && navItems.length > 0 ? (
                navItems.map((navItem) => (
                  <div key={navItem.id}>
                    {navItem.type === "link" ? (
                      <Link
                        href={getLinkHref(navItem.link)}
                        onClick={handleLinkClick}
                        className={cn(
                          "flex w-full items-center rounded-md px-3 py-3 text-base font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {navItem.link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => setActiveDropdown(navItem)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span>{navItem.ddSettings?.title}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                // Fallback navigation
                <>
                  <Link
                    href="/"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-3 text-base font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Contact
                  </Link>
                </>
              )}
            </nav>
          )}
        </ScrollArea>

        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
