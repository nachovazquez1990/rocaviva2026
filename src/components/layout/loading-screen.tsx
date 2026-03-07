"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Easing } from "framer-motion";
import Image from "next/image";

const ease: Easing = [0.16, 1, 0.3, 1];

export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("rocaviva-loaded");
    if (!seen) {
      if (prefersReducedMotion) {
        sessionStorage.setItem("rocaviva-loaded", "1");
        return;
      }
      setShow(true); // eslint-disable-line react-hooks/set-state-in-effect -- synchronizing with sessionStorage
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("rocaviva-loaded", "1");
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-50"
        >
          {/* Logo with scale + fade animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease }}
          >
            <Image
              src="/images/rocaviva_logo.svg"
              alt="Rocaviva Eventos"
              width={280}
              height={396}
              className="w-[min(50vw,220px)] h-auto"
              priority
            />
          </motion.div>

          {/* Pulsing dot loader */}
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand-600"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
