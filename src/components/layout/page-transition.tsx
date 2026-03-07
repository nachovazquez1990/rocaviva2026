"use client";

import { motion } from "framer-motion";
import type { Easing } from "framer-motion";

const ease: Easing = [0.16, 1, 0.3, 1];

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}
