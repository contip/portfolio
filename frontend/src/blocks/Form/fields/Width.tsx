import React from "react";
import { cn } from "@/lib/utils";

export const Width: React.FC<{
  children: React.ReactNode;
  className?: string;
  width?: number | string | null;
}> = ({ children, className, width }) => {
  return (
    <div
      className={cn("space-y-2", className)}
      style={{ maxWidth: width ? `${width}%` : undefined }}
    >
      {children}
    </div>
  );
};
