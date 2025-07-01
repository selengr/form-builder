"use client";
import usePreview from "@/hooks/usePreview";
import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";

export default function PreviewProgress() {
  const router = useRouter();
  const { dispatch, index, numQuestions } = usePreview();

  const handlePrev = () => {
    if (index > 0) {
      router.push(`?question=${index - 1}`);
      dispatch({ type: "pervQuestion" });
    }
  };

  const handleNext = () => {
    if (index + 1 < numQuestions!) {
      router.push(`?question=${index + 1}`);
      dispatch({ type: "nextQuestion" });
    }
  };

  return (
    <div className="w-full justify-center items-center mt-6">
      <div className="bg-[#F7F7FF] rounded-xl overflow-hidden flex items-center">
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={index === 0}
          sx={{
            width: 120,
            height: 52,
            borderRadius: 0,
            bgcolor: "#1758BA",
            boxShadow: "none",
            "&:hover": { bgcolor: "#174AA0" },
          }}
        >
          قبلی
        </Button>

        <div className="w-full flex items-center justify-center px-4">
          <Typography fontSize={16} fontWeight={600}>
            سوال {numQuestions === 0 ? 0 : index + 1} از {numQuestions}
          </Typography>
        </div>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={index + 1 === numQuestions || numQuestions === 0}
          sx={{
            width: 120,
            height: 52,
            borderRadius: 0,
            bgcolor: "#1758BA",
            boxShadow: "none",
            "&:hover": { bgcolor: "#174AA0" },
          }}
        >
         بعدی
        </Button>
      </div>
    </div>
  );
}
