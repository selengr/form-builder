import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";

export default function FieldDialogActionBottomButtons({
  status,
}: {
  status: boolean;
}) {
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();

  return (
    <div className="flex gap-6 w-full mt-10 mb-4 px-[20px]">
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        loading={status}
        sx={{
          bgcolor: "#1758BA",
          fontWeight: "400",
          fontSize: "15px",
          height: "50px",
          borderRadius: "10px",
          boxShadow: "none",
          "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
            bgcolor: "#1758BA",
            boxShadow: "none",
          },
        }}
      >
        <p className="text-[16px] text-white font-bold">ثبت</p>
      </LoadingButton>
      <Button
        disabled={status}
        type="button"
        fullWidth
        sx={{
          height: "50px",
          fontWeight: "400",
          fontSize: "15px",
          borderRadius: "10px",
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
        <p className="text-[16px] text-[#1758BA] font-bold">انصراف</p>
      </Button>
    </div>
  );
}
