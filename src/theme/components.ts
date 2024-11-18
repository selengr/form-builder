import type { ThemeOptions } from "@mui/material";

const components: ThemeOptions["components"] = {
  MuiButton: {
    variants: [
      {
        props: { variant: "outlined" },
        style: {
          backgroundColor: "#669ACB",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#669ACB",
            opacity: 0.85,
          },
        },
      },
    ],
  },
};

export { components };
