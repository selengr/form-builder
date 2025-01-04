import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { SxProps, Theme } from "@mui/material";
import CreateCalculatorDialog from "./CreateCalculatorDialog";

const buttonSx: SxProps<Theme> = {
  height: 52,
  width: "100%",
  display: "flex",
  color: "#6F6F6F",
  cursor: "pointer",
  marginTop: "10px",
  marginBottom: "50px",
  alignItems: "center",
  justifyContent: "center",
  border: "1px dashed #DDE1E6",
  "&:hover": {
    backgroundColor: "#F7F7FF",
  },
};

const CreateCalculator = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <LoadingButton
        variant="text"
        onClick={() => setOpen(true)}
        // loading={}
        fullWidth
        sx={buttonSx}
      >
        ایجاد محاسبه‌گر
      </LoadingButton>

      <CreateCalculatorDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCalculator;
