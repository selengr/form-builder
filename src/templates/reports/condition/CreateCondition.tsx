"use client";
import {useState} from "react";
import {Button, SxProps, Theme} from "@mui/material";
import CreateConditionDialog from "./CreateConditionDialog";

const buttonSx: SxProps<Theme> = {
  height: 52,
  width: "100%",
  display: "flex",
  color: "#6F6F6F",
  cursor: "pointer",
  marginTop: "10px",
  borderRadius : "8px",
  marginBottom: "20px",
  alignItems: "center",
  justifyContent: "center",
  border: "1px dashed #DDE1E6",
  "&:hover": {
    backgroundColor: "#F7F7FF",
  },
};

const CreateCondition = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <Button
        variant="text"
        onClick={() => setOpen(true)}
        // loading={}
        fullWidth
        sx={buttonSx}
      >
        افزودن خرده‌گزارش
      </Button>

      <CreateConditionDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCondition;
