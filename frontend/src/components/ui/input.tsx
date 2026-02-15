import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-200",
          "placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/30 focus-visible:border-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
