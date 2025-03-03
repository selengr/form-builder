import { Dialog, DialogContent, IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import PublishSettingsTabValue from "./PublishSettingsTabValue";

export default function PublishSettingsDialog({
  formId,
}: {
  formId: string | number;
}) {
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
      >
        <IoSettingsOutline color="#2A2A2A" />
      </IconButton>
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
            <div className="flex items-center justify-start">
              <button className="mx-4 mt-4 mb-0" onClick={handleOpen}>
                <CgClose color="#404040" width={25} height={25} size="1.5rem" />
              </button>
            </div>
            <DialogContent
              dir="rtl"
              sx={{
                maxHeight: "75vh",
                scrollbarWidth: "thin",
                maxWidth: "100%",
                width: "600px",
                paddingX: 1,
                paddingTop: 0,
              }}
            >
              <div dir="rtl" className="flex flex-col pb-4 p-2">
                <div className="flex justify-center items-baseline mb-6">
                  <p className="font-bold text-center text-[20px]">
                    تنظیمات انتشار
                  </p>
                </div>
                <PublishSettingsTabValue
                  handleOpen={handleOpen}
                  formId={formId as any}
                />
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
