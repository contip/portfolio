"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface MotionStaggerChildrenProps {
  children: ReactNode;
  /** The initial variant key, e.g. "hidden". Default: "hidden" */
  initial?: string;
  /** The animate variant key, e.g. "visible". Default: undefined */
  animate?: string;
  /** The whileInView variant key, e.g. "visible". Default: undefined */
  whileInView?: string;
  /** Options for use when an element becomes visible in the viewport. */
  viewport?: { once?: boolean; amount?: number };
  /**
   * The delay in seconds before any children begin to animate.
   * `delayChildren` is how long to wait before **starting** to stagger.
   */
  delayChildren?: number;
  /**
   * The stagger time in seconds between each child's animation start.
   * Default: 0.25
   */
  staggerChildren?: number;
  /**
   * The direction of the stagger, 1 for forward, -1 for reverse.
   * Default: 1
   */
  staggerDirection?: 1 | -1;
  className?: string;
  /** HTML element to render. Default: "section" */
  as?: "section" | "div" | "ul" | "ol";
}

/**
 * Parent container that will stagger its children. By default, it uses
 * initial="hidden" and whileInView="visible" (if supplied).
 *
 * The `transition` in the `visible` variant will handle the staggering.
 */
const MotionStaggerChildren = ({
  children,
  initial = "hidden",
  animate,
  whileInView,
  viewport = { once: true, amount: 0.2 },
  delayChildren = 0,
  staggerChildren = 0.25,
  staggerDirection = 1,
  className,
  as = "section",
}: MotionStaggerChildrenProps) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
        staggerDirection,
      },
    },
  };

  const Component = motion[as];

  return (
    <Component
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      variants={variants}
      className={cn("h-full w-full", className)}
    >
      {children}
    </Component>
  );
};

export default MotionStaggerChildren;
