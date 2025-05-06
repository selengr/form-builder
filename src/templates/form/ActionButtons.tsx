"use client";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

export default function ActionButtons({
  prevAction = () => {},
  nextAction = () => {},
  disablePrev = false,
  disableNext = false,
  loadingPrev = false,
  loadingNext = false,
}: {
  prevAction?: () => void;
  nextAction?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  loadingPrev?: boolean;
  loadingNext?: boolean;
}) {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
    >
      <LoadingButton
        sx={{
          width: "100px",
          height: "52px",
          borderRadius: "0 10px 10px 0",
          boxShadow: "none",
          "& .MuiButtonBase-root, &.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
        disabled={disablePrev}
        loading={loadingPrev}
        variant="contained"
        onClick={prevAction}
      >
        سوال قبلی
      </LoadingButton>
      <Box></Box>
      <LoadingButton
        sx={{
          width: "100px",
          height: "52px",
          borderRadius: "10px 0 0 10px",
          boxShadow: "none",
          "& .MuiButtonBase-root, &.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
        disabled={disableNext}
        loading={loadingNext}
        variant="contained"
        onClick={nextAction}
      >
        سوال بعدی
      </LoadingButton>
    </Box>
  );
}
