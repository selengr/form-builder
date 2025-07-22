"use client";

import {useContext} from "react";
import {OpenBottomSheetContext} from "@/context/AllContexts";

export default function useOpenBottomSheet() {
  const context = useContext(OpenBottomSheetContext);

  if (context === null) {
    throw new Error(
      "useOpenBottomSheet must be used within a OpenBottomSheetContext"
    );
  }

  return context;
}
