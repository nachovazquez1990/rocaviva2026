import type { Variants, Easing } from "framer-motion";

const easeOutExpo: Easing = [0.16, 1, 0.3, 1];

// Reduced-motion-safe variants: animations resolve to final state instantly
// Framer Motion respects prefers-reduced-motion automatically when using
// the `layout` prop and `AnimatePresence`. For explicit variants, we keep
// the same structure but the CSS media query in globals.css ensures
// CSS transitions/animations are disabled.

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: easeOutExpo },
  },
};

/**
 * Helper: returns reduced-motion-safe transition settings.
 * Use with Framer Motion's `transition` prop directly.
 */
export const reducedMotionTransition = {
  duration: 0,
  ease: "linear" as const,
};
