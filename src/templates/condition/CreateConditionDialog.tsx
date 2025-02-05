"use client";

import { CgClose } from "react-icons/cg";
import Dialog from "@mui/material/Dialog";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";

import { ConditionalSystem } from "./ConditionalSystem";
import { ICreateConditionDialogProps } from "@/types/condition";

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: "ltr",
  maxHeight: "75vh",
  scrollbarWidth: "thin",
  maxWidth: "100%",
  padding : "8px",
  overflowX : "hidden",
  paddingTop: theme.spacing(2.8),
  paddingBottom: theme.spacing(2.8),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  overflow: "hidden",
  scrollbarWidth: "none",
  "& .MuiPaper-root": {
    borderRadius: "24px",
    margin: "10px",
    width: "1010px",
  },
  "& .MuiDialog-container": {
    backdropFilter: "blur(4px)",
    backgroundColor: "hsl(0deg 0% 100% / 50%)",
  },
}));


export const CreateConditionDialog: React.FC<ICreateConditionDialogProps> = ({
  open,
  setOpen,
}) => {
 
  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledDialog open={open} maxWidth="xl">
      <StyledDialogContent>
        <div className="flex items-center justify-end h-6">
          <IconButton edge="end">
            <CgClose
              color="#404040"
              width={25}
              height={20}
              size="1.5rem"
              onClick={() => handleClose()}
            />
          </IconButton>
        </div>
        <ConditionalSystem handleClose={handleClose} />
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default CreateConditionDialog;
