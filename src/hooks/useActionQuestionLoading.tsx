"use client";

import { useContext } from "react";
import { ActionQuestionLoadingContext } from "@/context/AllContexts";

export default function useActionQuestionLoading() {
  const context = useContext(ActionQuestionLoadingContext);

  if (context === null) {
    throw new Error(
      "useActionQuestionLoading must be used within a ActionQuestionLoadingContext"
    );
  }

  return context;
}
