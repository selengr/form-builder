"use client";

import { styled, InputBase } from "@mui/material";

const Input = styled(InputBase)(({ theme: { palette } }) => {
  return {
    border: "1px solid",
    borderColor: palette.grey[100],
    padding: "0.6rem",
    fontSize: "0.85rem",
    borderRadius: "0.5rem",
    transition: "border-color 200ms ease",
    color: palette.common.black,
    "&.Mui-focused": {
      borderColor: palette.grey[400],
    },
    "&.Mui-disabled": {
      backgroundColor: palette.grey[100],
      borderColor: palette.grey[400],
    },
  };
});

export default Input;
