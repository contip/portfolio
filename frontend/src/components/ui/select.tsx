import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm",
      "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      "focus-visible:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

export { Select };
