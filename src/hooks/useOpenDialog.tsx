"use client";

import { useContext } from "react";
import { OpenDialogContext } from "@/context/AllContexts";

export default function useOpenDialog() {
  const context = useContext(OpenDialogContext);

  if (context === null) {
    throw new Error("useOpenDialog must be used within a OpenDialogContext");
  }

  return context;
}
