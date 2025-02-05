import { LoadingButton } from "@mui/lab"
import { Box, Typography, Button } from "@mui/material"

export function SubmitButtons() {
  return (
    <Box
      display="flex"
      gap={2}
      width="100%"
      marginBottom={2}
      marginTop={5}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#1758BA",
          borderRadius: "8px",
          height: "52px",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
          },
          minWidth: 113,
        }}
      >
        <Typography variant="body2" component={"p"} py={0.5} sx={{ color: "#fff", fontWeight: 500 }}>
          تایید
        </Typography>
      </LoadingButton>
      <Button
        type="button"
        variant="outlined"
        sx={{
          height: "52px",
          minWidth: 113,
          borderRadius: "8px",
          borderColor: "#1758BA",
          background: "#F7F7FF",
        }}
      >
        <Typography variant="body2" component={"p"} py={0.5} color={"#1758BA"} sx={{ fontWeight: 500 }}>
          انصراف
        </Typography>
      </Button>
    </Box>
  )
}

