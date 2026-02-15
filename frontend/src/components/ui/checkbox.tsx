import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-5 w-5 rounded-lg border border-border/70 bg-background text-primary",
      "shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      "focus-visible:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
