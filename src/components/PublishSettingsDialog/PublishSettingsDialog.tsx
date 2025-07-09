"use client";
import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import PublishSettingsTabValue from "./PublishSettingsTabValue";

interface PublishSettingsDialogProps {
  formId: string;
  formData: any;
}

export default function PublishSettingsDialog({ formId, formData }: PublishSettingsDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        aria-label="تنظیمات انتشار"
      >
        <IoSettingsOutline color="#2A2A2A" />
      </IconButton>
      <Dialog
        open={openDialog}
        onClose={handleOpen}
        dir="ltr"
        sx={{
          overflow: "hidden",
          scrollbarWidth: "none",
          "& .MuiPaper-root": {
            borderRadius: "24px",
            margin: "10px",
            width: "100%",
            maxWidth: "600px",
          },
          "& .MuiDialog-container": {
            backdropFilter: "blur(4px)",
            backgroundColor: "hsl(0deg 0% 100% / 50%)",
          },
        }}
      >
        <Box className="flex items-center justify-start" sx={{ p: 2 }}>
          <IconButton onClick={handleOpen} aria-label="بستن">
            <CgClose color="#404040" size="1.5rem" />
          </IconButton>
        </Box>
        <DialogContent
          dir="rtl"
          sx={{
            maxHeight: "75vh",
            scrollbarWidth: "thin",
            paddingX: 1,
            paddingTop: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box className="flex justify-center items-baseline" sx={{ mb: 3, pt: 1 }}>
            <Typography variant="h6" component="p" fontWeight="bold" textAlign="center">
              تنظیمات انتشار
            </Typography>
          </Box>
          <PublishSettingsTabValue
            handleOpen={handleOpen}
            formId={formId}
            formData={formData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}