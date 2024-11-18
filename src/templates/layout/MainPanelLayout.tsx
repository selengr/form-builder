import { Box } from "@mui/material";
import { type ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export default function MainPanelLayout({ children }: TProps) {
  return (
    <Box display="flex">
      <Box width="250px" height="500px" bgcolor="#ddd"></Box>
      <Box width="250px" height="500px" bgcolor="red"></Box>
      <div className="bg-slate-800 h-full">{children}</div>
    </Box>
  );
}
