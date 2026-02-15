import * as React from "react";

import { cn } from "@/lib/utils";

const Label = ({
  className,
  ...props
}: React.ComponentProps<"label">) => (
  <label
    className={cn(
      "text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
);

Label.displayName = "Label";

export { Label };
