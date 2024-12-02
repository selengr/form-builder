"use client";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { CgClose } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useOpenDialog from "@/hooks/useOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useQuestionLoading from "@/hooks/useQuestionLoading";
import PropertiesFormSidebar from "./PropertiesFormSidebar";

export default function CreateFieldDialog() {
  const setOpenDialog = useActionOpenDialog();
  const openDialog = useOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const questionLoading = useQuestionLoading();

  const handleClose = () => {
    setOpenDialog(!openDialog);
    setSelectedElement(null);
  };

  return (
    <Dialog
      open={openDialog}
      dir="ltr"
      sx={{
        overflow: "hidden",
        scrollbarWidth: "none",
        "& .MuiPaper-root": {
          borderRadius: "24px",
          margin: "10px",
        },
        "& .MuiDialog-container": {
          backdropFilter: "blur(4px)",
          backgroundColor: "hsl(0deg 0% 100% / 50%)",
        },
      }}
    >
      {openDialog && (
        <>
          {!questionLoading && (
            <div className="flex items-center justify-start">
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ marginX: 1, marginTop: 1, marginBottom: 0 }}
              >
                <CgClose color="#404040" width={25} height={25} />
              </IconButton>
            </div>
          )}
          <DialogContent
            dir="rtl"
            sx={{
              maxHeight: "75vh",
              scrollbarWidth: "thin",
              maxWidth: "100%",
              width: "450px",
              paddingX: 1,
              paddingBottom: 0,
              paddingTop: 0,
            }}
          >
            {questionLoading ? (
              <div className="flex min-h-[50vh] items-center justify-center w-full h-full">
                <ImSpinner2 className="animate-spin h-12 w-12" />
              </div>
            ) : (
              <PropertiesFormSidebar />
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
