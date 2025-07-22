"use client";

import {useContext} from "react";
import PreviewContext from "../context/PreviewContext";

export default function usePreview() {
  const context = useContext(PreviewContext);

  if (context === null) {
    throw new Error("usePreview must be used within a PreviewContext");
  }

  return context;
}
