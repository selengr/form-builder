"use client";

import { CgClose } from "react-icons/cg";
import Dialog from "@mui/material/Dialog";
import { Dispatch, SetStateAction } from "react";

import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import { useGetTicketList } from "../_hooks/useGetTicketList";
import DestroyTicketCard from "./DestroyTicketCard";

export interface IProps {
  id: string
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: "ltr",
  maxHeight: "75vh",
  scrollbarWidth: "thin",
  maxWidth: "100%",
  padding: "16px",
  overflowX: "hidden",
  paddingTop: theme.spacing(2.8),
  paddingBottom: theme.spacing(1.8),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  overflow: "hidden",
  scrollbarWidth: "none",
  "& .MuiPaper-root": {
    borderRadius: "24px",
    margin: "10px",
    width: "1050px",
  },
  "& .MuiDialog-container": {
    backdropFilter: "blur(4px)",
    backgroundColor: "hsl(0deg 0% 100% / 50%)",
  },
}));


export const DestroyTicketDialog: React.FC<IProps> = ({
  id,
  open,
  setOpen,
}) => {
  const { data, error, isLoading } = useGetTicketList(id);

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
        <label className="flex justify-center text-[15px] text-[#404040] mb-8 font-bold">
          وقایع
        </label>
        <DestroyTicketCard data={data} loading={isLoading} error={error}/>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default DestroyTicketDialog;
