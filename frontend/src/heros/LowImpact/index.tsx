import React from "react";
import type { Page } from "@/types/payload-types";
import RichText from "@/components/RichText";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";

type LowImpactHeroProps = {
  richText?: Page["hero"]["richText"];
  bgColor?: string | null;
  children?: React.ReactNode;
};

const LowImpactHero: React.FC<LowImpactHeroProps> = ({
  richText,
  bgColor,
  children,
}) => {
  return (
    <section
      className={cn(
        "relative mt-(--nav-height) py-16 md:py-24 items-center justify-center",
        bgColor,
      )}
      style={
        !bgColor?.startsWith("bg-") && bgColor
          ? { backgroundColor: bgColor }
          : undefined
      }
    >
      <MaxWidthWrapper className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-[48rem]">
          {children ||
            (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default LowImpactHero;
