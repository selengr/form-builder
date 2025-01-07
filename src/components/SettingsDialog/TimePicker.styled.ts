import { Box, styled } from "@mui/material";

const TimePickerStyled = styled(Box)(({ theme }) => ({
  "& .rmdp-analog-clock": {
    display: "none",
  },
  "& .rmdp-time-picker": {
    padding: "15px 0 10px 0",
  },
  "& .rmdp-wrapper.rmdp-shadow": {
    borderRadius: "16px",
  },
  "& .bottom": {
    minWidth: "150px !important",
  },
  "& .rmdp-time-picker div input": {
    fontSize: "16px",
    width: "30px",
  },
  "& .dvdr": {
    fontSize: "20px",
  },
  "& .rmdp-container:focus-visible, & .rmdp-container input:focus-visible": {
    border: "none",
    outline: "none",
  },
  "& .rmdp-container input:disabled": {
    backgroundColor: "transparent",
  },
  "& .rmdp-container input": {
    textAlign: "center !important",
  },
  "& .rmdp-arrow": {
    height: "8px",
    width: "8px",
  },
}));

export default TimePickerStyled;
