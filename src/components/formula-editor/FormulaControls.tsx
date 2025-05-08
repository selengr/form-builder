import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface FormulaControlsProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const FormulaControls: React.FC<FormulaControlsProps> = ({ onSubmit, onCancel }) => {
  return (
    <Box
      display="flex"
      gap={3}
      width="100%"
      marginBottom={2}
      sx={{ justifyContent: "center" }}
    >
      <Button
        onClick={onSubmit}
        variant="contained"
        sx={{
          backgroundColor: "#1758BA",
          fontWeight: "500",
          fontSize: "15px",
          borderRadius: "8px",
          height: "50px",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
          },
          minWidth: "132px",
        }}
      >
        <Typography
          variant="body2"
          py={0.5}
          sx={{ color: "#fff", fontWeight: 500 }}
        >
          تایید
        </Typography>
      </Button>

      <Button
        variant="outlined"
        sx={{
          height: "50px",
          minWidth: "132px",
          fontWeight: "500",
          borderRadius: "8px",
          fontSize: "15px",
          borderColor: "#1758BA",
          background: "#F7F7FF",
        }}
        onClick={onCancel}
      >
        <Typography
          variant="body2"
          py={0.5}
          color="#1758BA"
          sx={{ fontWeight: 500 }}
        >
          انصراف
        </Typography>
      </Button>
    </Box>
  );
};

export default FormulaControls;
