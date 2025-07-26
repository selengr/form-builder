import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: "ltr",
  maxHeight: "75vh",
  scrollbarWidth: "thin",
  maxWidth: "100%",
  padding: "32px",
  overflowX: "hidden",
  paddingTop: theme.spacing(2.8),
  paddingBottom: theme.spacing(1.8),
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
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