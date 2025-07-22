"use client";

import {useContext} from "react";
import {ActionOpenBottomSheetContext} from "@/context/AllContexts";

export default function useActionOpenBottomSheet() {
  const context = useContext(ActionOpenBottomSheetContext);

  if (context === null) {
    throw new Error(
      "useActionOpenBottomSheet must be used within a ActionOpenBottomSheetContext"
    );
  }

  return context;
}
