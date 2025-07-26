"use client";

import * as z from "zod"
import { CgClose } from "react-icons/cg";
import { useForm } from "react-hook-form"
import Dialog from "@mui/material/Dialog";
import { FormProvider } from "react-hook-form"
import { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod"

import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/hook-form";
import DialogContent from "@mui/material/DialogContent";
import { SubmitButtons } from "@/components/condition/form/SubmitButtons";
import { usePostChangeStatus } from "../_hooks/usePostChangeStatus";

export interface IProps {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  publicationApprovalByAdmin: string
};

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: "ltr",
  maxHeight: "75vh",
  scrollbarWidth: "thin",
  maxWidth: "100%",
  padding: "32px",
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

const TicketSchema = z.object({
  ticket: z.string().min(1, { message: "اين فيلد الزامي است" }),
})
type TTicketFormData = z.infer<typeof TicketSchema>

export const ChangeStatusDialog: React.FC<IProps> = ({
  id,
  open,
  setOpen,
  publicationApprovalByAdmin
}) => {
  const postChangeStatus = usePostChangeStatus();

  const methods = useForm<TTicketFormData>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      ticket: ""
    },
  })

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  const onSubmit = ({ ticket }: { ticket: string }) => {
    postChangeStatus.mutate({
      data: {
        ticket,
        formId: JSON.stringify(26),
        publicationApprovalByAdmin : publicationApprovalByAdmin ? "false" : "true"
      }
    }, {
      onSuccess: () => {
        // refresh()
        handleClose()
      },
    });
  };

  return (
    <StyledDialog open={open} maxWidth="xl">
      <StyledDialogContent>
        <div className="flex items-center justify-end h-6 -ml-2">
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
          شرح عملیات
        </label>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RHFTextField multiline rows={6} name="ticket"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px"
                }
              }} />
            <SubmitButtons isLoading={false} handleClose={handleClose} />
          </form>
        </FormProvider>

      </StyledDialogContent>
    </StyledDialog>
  );
};

export default ChangeStatusDialog;
