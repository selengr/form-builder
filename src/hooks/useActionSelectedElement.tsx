"use client";

import { useContext } from "react";
import { ActionSelectedElementContext } from "@/context/AllContexts";

export default function useActionSelectedElement() {
  const context = useContext(ActionSelectedElementContext);

  if (context === null) {
    throw new Error(
      "useActionSelectedElement must be used within a ActionSelectedElementContext"
    );
  }

  return context;
}
