"use client";

import {useEffect, useState} from "react";
import {Button, IconButton} from "@mui/material";
import ResponsiveContainer from "@/templates/form/ContentWrapper";
import AnimatedBox from "@/templates/form/AnimatedBox";
import FormLimitation from "@/templates/form/FormLimitation";
import ActionButtons from "@/templates/form/ActionButtons";
import {useParticipateForm} from "@/hooks/useParticipateForm";
import Loading from "@/app/(builder)/preview/[id]/loading";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import finalStep from "@/../public/images/home-page/finalStep.svg";
import Image from "next/image";
import AxiosApi from "@/services/axios/AxiosApi";
import {useParams} from "next/navigation";

export default function ParticipateFormPage() {
    const [limitationStepPassed, setLimitationStepPassed] = useState<boolean>(false);
    const [examTitle, setExamTitle] = useState<string>("");
    const {slug} = useParams();

    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const {data} = await AxiosApi.get(`/user/form/${slug}`);
                setExamTitle(data?.name || "بدون عنوان");
            } catch (error) {
                console.error("خطا در دریافت عنوان آزمون:", error);
            }

        };

        if (slug) fetchTitle();
    }, [slug]);
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
                <Loading/>
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
            <div className="w-full flex flex-col p-4 overflow-y-hidden">
                <div className="flex h-[calc(100vh-1rem)] flex-col bg-white rounded-xl overflow-y-hidden">
                    <div
                        className="flex h-[52px] items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative m-4">
                        <IconButton
                            sx={{position: "absolute", left: "8px"}}
                            onClick={() => replace("/")}
                        >
                            <MdOutlineKeyboardArrowRight color="#292D32"/>
                        </IconButton>
                        <p className="text-[16px] text-center font-bold text-[#161616]">
                            پایان
                        </p>
                    </div>

                    <div className="flex-1 flex items-center justify-center overflow-y-auto">
                        <div className="w-full max-w-4xl flex items-center justify-center">
                            <AnimatedBox>
                                <div className="w-full flex flex-col items-center justify-center gap-2">
                                    <p className="text-center text-lg font-semibold leading-relaxed">
                                        پاسخ‌های شما به{" "}
                                        <span className="text-xl font-bold">«{examTitle}»</span>{" "}
                                        با موفقیت در سامانه سنجش سایا ثبت شد.
                                    </p>

                                    <Image
                                        src={finalStep}
                                        alt="empty"
                                        width={300}
                                        height={300}
                                        priority
                                        draggable={false}
                                        className="w-full h-full max-h-[600px]"
                                    />
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
        <div className="w-full flex flex-col p-4 overflow-y-hidden">
            <div className="flex h-[calc(100vh-1rem)] flex-col bg-white rounded-xl overflow-y-hidden">
                <div
                    className="flex h-[52px] items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative m-4">
                    <IconButton
                        sx={{position: "absolute", left: "8px"}}
                        onClick={() => {
                        }}
                    >
                        <MdOutlineKeyboardArrowRight color="#292D32"/>
                    </IconButton>
                    <p className="text-[16px] text-center font-bold text-[#161616]">
                        {examTitle}
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
