import RichText from "@/components/RichText";
import React from "react";
import { cn } from "@/lib/utils";

import type { ContentBlock as ContentBlockProps } from "@/types/payload-types";

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props;

  const colsSpanClasses = {
    full: "col-span-12",
    half: "col-span-12 md:col-span-6",
    oneThird: "col-span-12 md:col-span-4",
    twoThirds: "col-span-12 md:col-span-8",
  };

  return (
    <div className="grid grid-cols-12">
      {columns?.map((col, index) => {
        const { richText, size = "full", backgroundColor } = col;

        return (
          <div
            key={index}
            className={cn(
              colsSpanClasses[size!],
              "py-8 px-6",
              backgroundColor || "bg-transparent"
            )}
          >
            {richText && <RichText data={richText} />}
          </div>
        );
      })}
    </div>
  );
};
