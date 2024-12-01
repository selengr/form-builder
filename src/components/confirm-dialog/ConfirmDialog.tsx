import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { ConfirmDialogProps } from "./types";

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  cancelText,
  cancelStatus = true,
  loading = false,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog
      fullWidth
      dir="rtl"
      maxWidth="xs"
      open={open}
      {...other}
      sx={{
        overflow: "hidden",
        scrollbarWidth: "none",
        "& .MuiPaper-root": {
          margin: "10px",
          borderRadius: "24px",
        },
        "& .MuiDialog-container": {
          backdropFilter: "blur(4px)",
          backgroundColor: "hsl(0deg 0% 100% / 50%)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, fontWeight: "700" }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: "body2", fontWeight: "700" }}>
          {" "}
          {content}{" "}
        </DialogContent>
      )}

      <DialogActions
        sx={{
          display: "flex",
          gap: 3,
          width: "100%",
          marginTop: 1,
          marginBottom: 2,
          paddingX: "30px",
        }}
      >
        {action}
        {cancelStatus && (
          <Button
            disabled={loading}
            onClick={onClose}
            type="button"
            fullWidth
            disableRipple={true}
            variant="outlined"
            sx={{
              marginX: "0 !important",
              height: "45px",
              fontWeight: "400",
              fontSize: "15px",
              borderRadius: "10px",
              borderColor: "#1758BA",
            }}
          >
            <Typography color="#1758BA" component={"p"} py={0.5}>
              {cancelText ?? "نه، منصرف شدم"}
            </Typography>
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
