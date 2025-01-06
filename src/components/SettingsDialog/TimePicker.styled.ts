import { Box, styled } from "@mui/material";

const TimePickerStyled = styled(Box)(({ theme }) => ({
  "& .rmdp-analog-clock": {
    display: "none",
  },
  "& .rmdp-time-picker": {
    padding: "8px 0",
  },
  "& .rmdp-wrapper.rmdp-shadow": {
    borderRadius: "16px",
  },
  "& .bottom": {
    minWidth: "150px !important",
  },
  "& .rmdp-time-picker div input": {
    fontSize: "15px",
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
}));

export default TimePickerStyled;
