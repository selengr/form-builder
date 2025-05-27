"use client";
import {useState} from "react";
import {Button, SxProps, Theme} from "@mui/material";
import CreateCalculatorDialog from "./CreateCalculatorDialog";

const buttonSx: SxProps<Theme> = {
    height: 52,
    minHeight: 52,
    width: "100%",
    display: "flex",
    color: "#6F6F6F",
    cursor: "pointer",
    marginTop: "10px",
    marginBottom: "20px",
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
            <Button
                variant="text"
                onClick={() => setOpen(true)}
                // loading={}
                fullWidth
                sx={buttonSx}
            >
                ایجاد محاسبه‌گر
            </Button>
            <CreateCalculatorDialog open={open} setOpen={setOpen}/>
        </>
    );
};

export default CreateCalculator;
