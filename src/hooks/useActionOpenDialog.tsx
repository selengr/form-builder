"use client";

import { useContext } from "react";
import { ActionOpenDialogContext } from "@/context/AllContexts";

export default function useActionOpenDialog() {
  const context = useContext(ActionOpenDialogContext);

  if (context === null) {
    throw new Error(
      "useActionOpenDialog must be used within a ActionOpenDialogContext"
    );
  }

  return context;
}
