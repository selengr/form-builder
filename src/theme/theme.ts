"use client";

import { createTheme } from "@mui/material";
import { palette } from "./palette";
import { components } from "./components";

const theme = createTheme({
  palette,
  components,
  direction: "rtl"
});

export { theme };
