"use client";

import {useContext} from "react";
import {QuestionLoadingContext} from "@/context/AllContexts";

export default function useQuestionLoading() {
  const context = useContext(QuestionLoadingContext);

  if (context === null) {
    throw new Error(
      "useQuestionLoading must be used within a QuestionLoadingContext"
    );
  }

  return context;
}
