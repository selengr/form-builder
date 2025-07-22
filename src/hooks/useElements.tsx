"use client";

import {useContext} from "react";
import {ElementsContext} from "@/context/AllContexts";

export default function useElements() {
  const context = useContext(ElementsContext);

  if (context === null) {
    throw new Error("useElements must be used within a ElementsContext");
  }

  return context;
}
