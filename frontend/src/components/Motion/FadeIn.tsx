"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type CubicBezier = [number, number, number, number];

interface FadeInProps {
  className?: string;
  children: ReactNode;
  /** The duration of the animation in seconds. Default: 0.8 */
  duration?: number;
  /** Delay before animation starts in seconds. Default: 0 */
  delay?: number;
  /** Initial Y offset in pixels. Default: 40 */
  y?: number;
  /** Custom easing curve. Default: [0.25, 0.46, 0.45, 0.94] */
  ease?: CubicBezier;
}

/**
 * Simple fade-in animation that triggers on mount (not viewport).
 * Good for hero content that should animate immediately.
 */
export default function FadeIn({
  className,
  children,
  duration = 0.8,
  delay = 0,
  y = 40,
  ease = [0.25, 0.46, 0.45, 0.94] as CubicBezier,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
