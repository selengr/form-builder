import { Switch, styled } from "@mui/material";

export const SwitchButton = styled(Switch)(({ theme }) => ({
  width: 43,
  height: 23,
  padding: 0,
  transform: "rotate(180deg)",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(19px)",
      color: "white",
      "& + .MuiSwitch-track": {
        backgroundColor: "#1758BA",
        opacity: 1,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
      "& .MuiSwitch-thumb": {
        border: `none !important`,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "white",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 19,
    height: 19,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
