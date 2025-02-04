"use client"
import { Box, Typography, Button } from "@mui/material"
import { FormProvider } from "react-hook-form"
import { SubmitButtons } from "@/templates/condition/SubmitButtons";

export default function ConditionalSystem() {
  
  const onSubmit = (input: FormData) => {
    console.log("Submitted data:", input);

  };

  return (
    <Box
      sx={{ width: "100%", p: 3, display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}
    >
      <Typography
        variant="subtitle1"
        sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700, mb: 1 }}
      >
        شرط
      </Typography>
      <FormProvider >
        <form >
          
          <Button
            variant="outlined"
            sx={{
              ml: 2,
              height: 52,
              maxWidth: 155,
              color: "white",
              bgcolor: "#1758BA",
              borderRadius: "8px",
            }}
          >
            افزودن شرط جدید
          </Button>
          <SubmitButtons />
        </form>
      </FormProvider>
    </Box>
  )
}

