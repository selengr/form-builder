"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useResponsive } from "@/hooks/useResponsive";

export default function AnimatedBox({ children }: { children: ReactNode }) {
  const isMobile = useResponsive("down", "md");

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      style={{
        width: "100%",
        margin: "1rem 0",
        maxHeight: "5000px",
        borderRadius: "10px",
        padding: isMobile ? "1rem 2rem" : "2rem 3rem",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        border: "1px solid #e5e5e5",
      }}
    >
      {children}
    </motion.div>
  );
}
