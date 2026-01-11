"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface MotionStaggeredChildProps {
  children: ReactNode;
  className?: string;
  /**
   * The duration of the animation in seconds.
   * Default: 0.4
   */
  duration?: number;
}

/**
 * A child component meant to be used inside MotionStaggerChildren.
 * It will animate based on the parent's stagger configuration.
 */
const MotionStaggeredChild = ({
  children,
  className,
  duration = 0.4,
}: MotionStaggeredChildProps) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            bounce: 0.1,
            type: "spring",
          },
        },
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
};

export default MotionStaggeredChild;
