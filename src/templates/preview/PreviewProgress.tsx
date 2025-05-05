"use client";
import usePreview from "@/hooks/usePreview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function PreviewProgress() {
  const router = useRouter();
  const { dispatch, index, numQuestions } = usePreview();

  return (
    <Box
      component="header"
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
    >
      <Button
        sx={{
          width: "100px",
          height: "52px",
          borderRadius: "0 10px 10px 0",
          boxShadow: "none",
          "& .MuiButtonBase-root, &.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
        disabled={index === 0}
        variant="contained"
        onClick={() => {
          if (index !== 0) {
            router.push(`?question=${index - 1}`);
            dispatch({ type: "pervQuestion" });
          }
        }}
      >
        سوال قبلی
      </Button>
      <Typography fontSize="16px" fontWeight={600}>
        سوال {numQuestions === 0 ? 0 : index + 1} از {numQuestions}
      </Typography>
      <Button
        sx={{
          width: "100px",
          height: "52px",
          borderRadius: "10px 0 0 10px",
          boxShadow: "none",
          "& .MuiButtonBase-root, &.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
        disabled={index + 1 === (numQuestions as number) || numQuestions === 0}
        variant="contained"
        onClick={() => {
          if (index > (numQuestions as number)) return;

          router.push(`?question=${index + 1}`);
          dispatch({ type: "nextQuestion" });
        }}
      >
        سوال بعدی
      </Button>
    </Box>
  );
}
