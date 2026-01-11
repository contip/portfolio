"use client";

import { motion } from "motion/react";

interface ScrollIndicatorProps {
  className?: string;
}

/**
 * Animated scroll indicator with bounce animation.
 * Shows "Scroll" text with an arrow that bounces up and down.
 */
export default function ScrollIndicator({ className }: ScrollIndicatorProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-white/60">
          Scroll
        </span>
        <svg
          className="h-6 w-6 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
