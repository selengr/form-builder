"use client";

import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import ResponsiveContainer from "@/templates/form/ContentWrapper";
import AnimatedBox from "@/templates/form/AnimatedBox";
import FormLimitation from "@/templates/form/FormLimitation";
import ActionButtons from "@/templates/form/ActionButtons";
import { useParticipateForm } from "@/hooks/useParticipateForm";
import Loading from "@/app/(builder)/preview/[id]/loading";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import finalStep from "@/../public/images/home-page/finalStep.svg";
import Image from "next/image";

export default function ParticipateFormPage() {
  const [limitationStepPassed, setLimitationStepPassed] = useState(false);

  const {
    firstLoading,
    questionLoading,
    finishPage,
    limitation,
    question,
    formData,
    formName,
    ValidatedInput,
    handleValidationUpdate,
    handleNext,
    handlePrev,
    replace,
    setLimitation,
    setQuestion,
    initializeQuestion,
  } = useParticipateForm();

  if (firstLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <Loading />
      </div>
    );
  }

  if (limitation.isLimited && !limitationStepPassed) {
    return (
      <ResponsiveContainer>
        <FormLimitation
          type={limitation.limitationType}
          setLimitation={setLimitation}
          setQuestion={setQuestion}
          addQuestion={(data) => {
            initializeQuestion(data);
            setLimitationStepPassed(true);
          }}
        />
      </ResponsiveContainer>
    );
  }

  if (finishPage) {
    return (
      <div className="w-full flex flex-col p-4 overflow-hidden">
        <div className="flex flex-col bg-white rounded-xl h-full max-h-screen">
          <div className="flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-3 mb-4 relative">
            <IconButton
              sx={{ position: "absolute", left: "8px" }}
              onClick={() => replace("/")}
            >
              <MdOutlineKeyboardArrowRight color="#292D32" />
            </IconButton>
            <p className="text-base font-bold text-[#161616] text-center">پایان</p>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-y-auto px-4">
            <div className="w-full max-w-3xl">
              <AnimatedBox>
                <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
                  <p className="text-lg font-semibold leading-relaxed">
                    پاسخ‌های شما به{" "}
                    <span className="text-xl font-bold">«{formName}»</span>{" "}
                    با موفقیت ثبت شد.
                  </p>

                  <div className="w-full max-w-xs sm:max-w-md">
                    <Image
                      src={finalStep}
                      alt="نتیجه"
                      width={300}
                      height={300}
                      priority
                      className="w-full h-auto max-h-[400px] object-contain"
                      draggable={false}
                    />
                  </div>

                  <Button
                    sx={{
                      width: "150px",
                      height: "52px",
                      borderRadius: "10px",
                      backgroundColor: "#1758BA",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1758BA",
                        boxShadow: "none",
                      },
                    }}
                    variant="contained"
                    onClick={() => replace("/")}
                  >
                    بازگشت
                  </Button>
                </div>
              </AnimatedBox>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 overflow-hidden">
      <div className="flex flex-col bg-white rounded-xl h-full max-h-screen">
        <div className="flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-3 mb-4 relative">
          <IconButton
            sx={{ position: "absolute", left: "8px" }}
            onClick={() => {}}
          >
            <MdOutlineKeyboardArrowRight color="#292D32" />
          </IconButton>
          <p className="text-base font-bold text-[#161616] text-center">{formName}</p>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4">
          <div className="w-full max-w-3xl">
            {question && (
              <AnimatedBox key={question.questionId}>
                <ValidatedInput
                  key={question.id}
                  formData={formData}
                  elementInstance={question}
                  onValidationUpdate={handleValidationUpdate}
                />
              </AnimatedBox>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between items-center px-2 py-4">
          <ActionButtons
            loadingNext={questionLoading}
            disablePrev={questionLoading}
            nextAction={handleNext}
            prevAction={handlePrev}
          />
        </div>
      </div>
    </div>
  );
}
