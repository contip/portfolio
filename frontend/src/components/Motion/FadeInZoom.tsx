"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInZoomProps {
  className?: string;
  children: ReactNode;
  /** The portion of the element that needs to be in view before animation triggers */
  amount?: number;
  /** The duration of the animation in seconds. Default: 0.6 */
  duration?: number;
  /** Delay before animation starts in seconds. Default: 0 */
  delay?: number;
  /** Initial scale value. Default: 0 */
  initialScale?: number;
}

export default function FadeInZoom({
  className,
  children,
  amount = 0.01,
  duration = 0.6,
  delay = 0,
  initialScale = 0,
}: FadeInZoomProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
