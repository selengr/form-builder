"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useResponsive } from "@/hooks/useResponsive";

export default function AnimatedBox({ children }: { children: ReactNode }) {
  const isMobile = useResponsive("down", "md");

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ ease: "easeInOut", duration: 1 }}
    className={`
        w-full h-full 
        flex align-middle 
        rounded-xl 
        my-8
        ${isMobile ? "p-8" : "p-12"} 
      `}
  >
    {children}
  </motion.div>
  );
}
