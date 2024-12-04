import { memo } from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Backdrop from "@mui/material/Backdrop";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";

const FieldDialogActionBottomButtons = memo(
  function FieldDialogActionBottomButtons({ status }: { status: boolean }) {
    const setOpenDialog = useActionOpenDialog();
    const setSelectedElement = useActionSelectedElement();

    return (
      <>
        <div className="flex gap-6 w-full mt-10 mb-4 px-[20px]">
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={status}
            disabled={status}
            disableRipple
            sx={{
              bgcolor: "#1758BA",
              height: "50px",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "10px",
              boxShadow: "none",
              "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                bgcolor: "#1758BA",
                boxShadow: "none",
              },
            }}
          >
            ثبت
          </LoadingButton>
          <Button
            disabled={status}
            type="button"
            fullWidth
            className="text-[16px] text-[#1758BA]"
            sx={{
              height: "50px",
              fontWeight: "700",
              borderRadius: "10px",
              fontSize: "16px",
              color: "#1758BA",
              borderColor: "#1758BA",
              bgcolor: "white",
              "&.MuiButtonBase-root:hover": {
                bgcolor: "transparent",
                boxShadow: "none",
                color: "#1758BA",
              },
            }}
            variant="outlined"
            onClick={() => {
              if (status) return;

              setOpenDialog(false);
              setSelectedElement(null);
            }}
          >
            انصراف
          </Button>
        </div>
        {status && (
          <Backdrop
            sx={(theme) => ({
              color: "transparent",
              zIndex: theme.zIndex.drawer + 1,
              "&.MuiBackdrop-root": {
                bgcolor: "transparent",
              },
            })}
            open={status}
          />
        )}
      </>
    );
  }
);

export default FieldDialogActionBottomButtons;
