import React from "react";
import { Box, Modal, Slide, Grid2 } from "@mui/material";
import { styled } from "@mui/system";
import { TransitionProps } from "@mui/material/transitions";
import Divider from "@mui/material/Divider";
import useOpenBottomSheet from "@/hooks/useOpenBottomSheet";
import useActionOpenBottomSheet from "@/hooks/useActionOpenBottomSheet";
import useActionDesigner from "@/hooks/useActionDesigner";

interface BottomSheetProps {
  children: React.ReactNode;
}

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  outline: "none",
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DesignerBottomSheet: React.FC<BottomSheetProps> = ({ children }) => {
  const openBottomSheet = useOpenBottomSheet();
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const { setSelectedGroup } = useActionDesigner();

  return (
    <StyledModal
      open={openBottomSheet}
      onClose={() => {
        setOpenBottomSheet(false);
        setSelectedGroup(null);
      }}
      aria-labelledby="bottom-sheet-title"
      aria-describedby="bottom-sheet-description"
      closeAfterTransition
    >
      <Transition in={openBottomSheet}>
        <Box
          sx={{
            width: { xs: "100%", md: "70%", sm: "100%", xl: "50%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
        >
          <Grid2 container>
            <Grid2
              size={{ xs: 12 }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Divider
                sx={{ width: "3.5rem", height: "0.2rem" }}
                color="#2cdfc9"
              />
            </Grid2>
            <Grid2
              size={{ xs: 12 }}
              sx={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 100px)",
                padding: "16px",
              }}
            >
              {children}
            </Grid2>
          </Grid2>
        </Box>
      </Transition>
    </StyledModal>
  );
};

export default DesignerBottomSheet;
