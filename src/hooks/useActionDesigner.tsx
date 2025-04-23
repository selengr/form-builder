"use client";

import { useContext } from "react";
import { ActionDesignerContext } from "@/context/AllContexts";

export default function useActionDesigner() {
  const context = useContext(ActionDesignerContext);

  if (context === null) {
    throw new Error(
      "useActionDesigner must be used within a ActionDesignerContext"
    );
  }

  return context;
}
