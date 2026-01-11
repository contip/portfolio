import React from "react";
import type { Page } from "@/types/payload-types";
import RichText from "@/components/RichText";
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
        "relative mt-(--nav-height) py-16 md:py-24",
        bgColor
      )}
      style={!bgColor?.startsWith("bg-") && bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="container">
        <div className="max-w-[48rem]">
          {children ||
            (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
      </div>
    </section>
  );
};

export default LowImpactHero;
