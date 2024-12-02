import { Slider, styled } from "@mui/material";

export const MyRangeSlider = styled(Slider)({
  color: "#2CDFC9",
  height: 30,
  "&.MuiSlider-root": {
    "& .MuiSlider-thumb": {
      transform: "translate(1.5rem, -50%) !important",
    },
    "& .MuiSlider-thumb::after": {
      transform: "translate(-32rem, -50%) !important",
    },
  },
  "& .MuiSlider-mark": {
    display: "none !important",
  },
  "& .MuiSlider-markLabel": {
    top: "55px !important",
    color: "gray",
  },
  "& .MuiSlider-markLabelActive": {
    color: "#2CDFC9 !important",
    fontWeight: "600",
  },
  "& .MuiSlider-track": {
    marginLeft: "3px !important",
    borderRadius: "50px",
  },
  "& .MuiSlider-rail": {
    padding: "3px",
    backgroundColor: "white",
    outline: "1px solid #2CDFC9 !important",
    borderRadius: "50px",
  },
  "& .MuiSlider-thumb": {
    height: 40,
    width: 40,
    border: "2px solid #2CDFC9",
    backgroundColor: "#fff",
    outline: "2px solid #fff",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1,
    fontSize: 12,
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#fff !important",
    color: "#1758BA",
    fontWeight: 700,
    transform: "translate(0px, 13px)",
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabelOpen": {
    transform: "translate(0px, 13px) !important",
  },
});
