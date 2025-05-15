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

export default function ParticipateFormPage() {
    const [limitationStepPassed, setLimitationStepPassed] = useState(false);
    const {
        firstLoading,
        questionLoading,
        finishPage,
        limitation,
        question,
        formData,
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
            <ResponsiveContainer>
                <div className="flex gap-4 flex-col justify-center items-center">
                    <p className="text-center font-bold">موفق باشید 🌹</p>
                    <Button
                        sx={{
                            width: "150px",
                            height: "52px",
                            borderRadius: "10px",
                            backgroundColor: "#1758BA",
                            boxShadow: "none",
                            "&:hover": { backgroundColor: "#1758BA", boxShadow: "none" },
                        }}
                        variant="contained"
                        onClick={() => replace("/")}
                    >
                        بازگشت
                    </Button>
                </div>
            </ResponsiveContainer>
        );
    }

    return (
        <div className="w-full flex flex-col p-4 overflow-y-hidden">
            <div className="flex h-[calc(100vh-1rem)] flex-col bg-white rounded-xl overflow-y-hidden">
                <div className="flex h-[52px] items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative m-4">
                    <IconButton
                        sx={{ position: "absolute", left: "8px" }}
                        onClick={() => {}}
                    >
                        <MdOutlineKeyboardArrowRight color="#292D32" />
                    </IconButton>
                    <p className="text-[16px] text-center font-bold text-[#161616]">
                        عنوان پرسشنامه
                    </p>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-y-auto">
                    <div className="w-full max-w-4xl h-[60%] flex items-center justify-center">
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
                <div className="w-full flex justify-between items-center">
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
