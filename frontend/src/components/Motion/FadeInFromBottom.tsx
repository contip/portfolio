"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInFromBottomProps {
  className?: string;
  children: ReactNode;
  /** The portion of the element that needs to be in view before animation triggers */
  amount?: number;
  /** The duration of the animation in seconds. Default: 0.6 */
  duration?: number;
  /** Delay before animation starts in seconds. Default: 0 */
  delay?: number;
}

export default function FadeInFromBottom({
  className,
  children,
  amount = 0.5,
  duration = 0.6,
  delay = 0,
}: FadeInFromBottomProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
