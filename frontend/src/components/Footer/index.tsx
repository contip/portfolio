import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCachedGlobal } from "@/lib/payload";
import type { Footer as FooterType } from "@/types/payload-types";
import { CMSLink } from "@/components/CMSLink";
import { LogoFull } from "@/components/Logo";
import CurrentYear from "@/components/CurrentYear";
import { cn } from "@/lib/utils";

const extractSocialHref = (social: NonNullable<FooterType["socials"]>[number]) => {
  if (!social.url) return "";

  if (social.url.type === "custom") return social.url.url || "";

  const reference = social.url.reference;
  if (!reference || typeof reference.value !== "object") return "";

  const slug = reference.value.slug;
  if (!slug) return "";

  if (reference.relationTo === "posts") return `/blog/${slug}`;
  if (reference.relationTo === "services") return `/services/${slug}`;
  if (reference.relationTo === "caseStudies") return `/case-studies/${slug}`;
  if (reference.relationTo === "categories") return `/blog/category/${slug}`;

  return `/${slug}`;
};

const extractSocialLabel = (href: string) => {
  if (!href) return "Social";

  try {
    const parsed = new URL(href.startsWith("http") ? href : `https://${href}`);
    const host = parsed.hostname.replace(/^www\./, "");
    return host.split(".")[0] || "Social";
  } catch {
    return "Social";
  }
};

const renderIcon = (icon: NonNullable<FooterType["socials"]>[number]["icon"]) => {
  if (!icon || typeof icon !== "object" || !icon.svg) return null;

  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center [&_*]:fill-current [&_*]:stroke-current"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
};

const exploreLinkStyles =
  "group inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground";

const ExploreLinkLabel = ({ label }: { label: string }) => (
  <>
    <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
      {label}
    </span>
    <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
  </>
);

const Footer = async () => {
  let footer: FooterType | null = null;

  try {
    footer = await getCachedGlobal<FooterType>("footer", { depth: 2 });
  } catch {
    footer = null;
  }

  const footerItems = footer?.footerItems || [];
  const socials = footer?.socials || [];

  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="container-art py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <LogoFull className="h-12 w-auto" />
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Engineering Outcomes
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Software and cloud engineering consultancy for teams that need to
              ship faster, scale safely, and convert technical execution into
              measurable business growth.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Based in the U.S. and available for remote-first engagements.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Explore</p>
            <ul className="mt-6 space-y-2">
              {footerItems.length > 0 ? (
                footerItems.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      link={{
                        ...item.link,
                        appearance: "text",
                      }}
                      className={exploreLinkStyles}
                    >
                      <ExploreLinkLabel label={item.link.label} />
                    </CMSLink>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/services" className={exploreLinkStyles}>
                      <ExploreLinkLabel label="Services" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/case-studies" className={exploreLinkStyles}>
                      <ExploreLinkLabel label="Case Studies" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className={exploreLinkStyles}>
                      <ExploreLinkLabel label="Blog" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Connect
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {socials.length > 0 ? (
                socials.map((social) => {
                  const href = extractSocialHref(social);
                  const label = extractSocialLabel(href);
                  if (!href) return null;

                  const icon = renderIcon(social.icon);
                  const isExternal = /^https?:\/\//.test(href);

                  return (
                    <li key={social.id}>
                      <Link
                        href={href}
                        className={cn(
                          "inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary",
                          "capitalize"
                        )}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                      >
                        {icon}
                        {label}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li>
                    <Link href="https://www.linkedin.com" className="hover:text-primary">
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com" className="hover:text-primary">
                      GitHub
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <p>
            © <CurrentYear /> Peter Conti Consulting
          </p>
          <p>Software, Cloud, and Platform Engineering</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
