"use client";

import { CgClose } from "react-icons/cg";
import { IconButton } from "@mui/material";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
// components
import DestroyTicketCard from "./DestroyTicketCard";
// _hooks
import { useGetTicketList } from "../_hooks/useGetTicketList";
// style
import { StyledDialog, StyledDialogContent } from "./userReports.style";

export interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DestroyTicketDialog: React.FC<IProps> = ({
  open,
  setOpen,
}) => {
  const { id } = useParams();
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
