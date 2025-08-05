"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from "sonner";
import {AxiosApi} from "@/services/axios/AxiosApi";
import {ElementsType, FormElements} from "@/types/FormElements";
import withValidation from "@/components/Fields/FormHOC";
import {fetchUserInfo} from "@/lib/auth";

export interface ILimitation {
    isLimited: boolean;
    limitationType: "" | "PHONE_NUMBER" | "EMAIL";
}

interface HasError {
    status: boolean;
    message: string;
}

export const useParticipateForm = () => {
    const [question, setQuestion] = useState<any>(null);
    const [formData, setFormData] = useState<any>("");
    const [isValid, setIsValid] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const [questionLoading, setQuestionLoading] = useState(false);
    const [takePartId, setTakePartId] = useState<any>(null);
    const [finishPage, setFinishPage] = useState(false);
    const [answerId, setAnswerId] = useState<number>();
    const [formName, setFormName] = useState("");
    const [firstQuestionId, setFirstQuestionId] = useState<number | string | null>(null);
    const [realFormID, setRealFormID] = useState();
    const [hasError, setHasError] = useState<HasError>({status: false, message: ""});
    const [limitation, setLimitation] = useState<ILimitation>({
        isLimited: false, limitationType: "",
    });

    const hasFetchedRef = useRef(false);
    const {slug} = useParams<{ slug: string }>();
    const {replace} = useRouter();

    const isCurrentFirstQuestion = useMemo(() => {
        return question?.questionId === firstQuestionId;
    }, [question, firstQuestionId]);

    const extractProperty = useCallback((list: any[], key: string) => list?.find((item) => item.questionPropertyEnum === key)?.value, []);

    const initializeQuestion = useCallback((q: any, previousAnswers?: any[]) => {
        if (!q?.questionType) return setQuestion(null);

        const props = q.questionPropertyList;
        const required = extractProperty(props, "REQUIRED") === "true";
        const pattern = extractProperty(props, "TEXT_FIELD_PATTERN");
        const minLength = Number(extractProperty(props, "MINIMUM_LEN"));
        const isMultiSelect = extractProperty(props, "MULTI_SELECT") === "true";
        const spectralType = extractProperty(props, "SPECTRAL_TYPE");

        let value: any = "";
        let currentAnswerId: number | undefined;

        if (previousAnswers && previousAnswers.length > 0) {
            const first = previousAnswers[0];

            if (q.questionType === "SPECTRAL") {
                value = spectralType === "DOMAIN"
                    ? previousAnswers.map((a) => Number(a.answer))
                    : Number(first.answer);
            } else if (["MULTIPLE_CHOICE", "MULTIPLE_CHOICE_IMAGE"].includes(q.questionType)) {
                if (isMultiSelect) {
                    value = previousAnswers.map((a) => a.optionId);
                } else {
                    value = first.optionId;
                    currentAnswerId = first?.id;
                }
            } else {
                value = first.answer;
                currentAnswerId = first?.id;
            }
        } else {
            if (q.questionType === "SPECTRAL") {
                const start = Number(extractProperty(props, "SPECTRAL_START"));
                const end = Number(extractProperty(props, "SPECTRAL_END"));
                value = spectralType === "DOMAIN" ? [start, end] : start;
            } else if (["MULTIPLE_CHOICE", "MULTIPLE_CHOICE_IMAGE"].includes(q.questionType)) {
                value = isMultiSelect ? [] : "";
            } else {
                value = "";
            }
        }

        const valid = !required || (q.questionType === "TEXT_FIELD" && ["SHORT_TEXT", "LONG_TEXT"].includes(pattern) && minLength <= 0);

        setIsValid(valid);
        setFormData(value);
        setQuestion(q);
        setAnswerId(currentAnswerId);
    }, [extractProperty]);

    const fetchInitialData = useCallback(async () => {
        try {
            const res = await AxiosApi.post("/take-part/check-response-limitation-form", {
                link: /^public-|^solo-/.test(slug) ? slug : null,
                id: !/^public-|^solo-/.test(slug) ? slug : null,
            });

            const {userInfo} = await fetchUserInfo();
            const username = userInfo?.user?.username || null;

            if (res?.data?.loggedInStatus === false && res?.data?.responseLimitation) {
                setLimitation({
                    isLimited: true, limitationType: res.data.responseLimitation,
                });
            } else if (res?.data?.responseLimitation) {
                await checkAnswerBefore(username);
            } else {
                await takePart(username);
            }
        } catch (e: any) {
            if (e?.response?.status === 409) {
                setHasError({status: true, message: e?.response.data.message[0].title});
            } else {
                setHasError({status: true, message: "متأسفیم! فرم مورد نظر در حال حاضر در دسترس نیست."});
            }
        } finally {
            setFirstLoading(false);
        }
    }, [slug]);

    const takePart = async (username: string | null) => {
        try {
            const res = await AxiosApi.post("/take-part", {
                link: /^public-|^solo-/.test(slug) ? slug : null,
                formId: !/^public-|^solo-/.test(slug) ? slug : null,
                username,
            });

            const q = res.data.questionModel;

            if (q?.isFirstQuestion) {
                setFirstQuestionId(q.questionId);
            }

            setRealFormID(res.data.formId ?? "");
            setFormName(res.data.formName);
            setTakePartId(res.data.takePart);
            initializeQuestion(q);
        } catch (e) {
            console.error("Error in takePart:", e);
            throw e;
        }
    };

    const checkAnswerBefore = async (username: string | null) => {
        try {
            const url = "/take-part/check-answer-to-form-before";
            const res = await AxiosApi.post(url, {
                link: /^public-|^solo-/.test(slug) ? slug : null,
                formId: !/^public-|^solo-/.test(slug) ? slug : null,
                username,
            });
            setTakePartId(res.data.takePart);
            initializeQuestion(res.data.questionModel, res.data.userAnswerModel?.answersModel ?? []);
        } catch (e) {
            console.error("Error in checkAnswerBefore:", e);
            throw e;
        }
    };

    const handleValidationUpdate = (valid: boolean, value: any) => {
        setIsValid(valid);
        setFormData(value);
        if (answerId) {
            setAnswerId(undefined);
        }
    };

    const handleNext = async () => {
        if (!isValid) return toast.error("پاسخ به این سوال الزامی می‌باشد");
        setQuestionLoading(true);

        try {
            const props = question.questionPropertyList;
            const isMultiSelect = extractProperty(props, "MULTI_SELECT") === "true";
            const spectralType = extractProperty(props, "SPECTRAL_TYPE");

            const needsOption = isMultiSelect || ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE_IMAGE"].includes(question.questionType);
            let answerList;

            if (needsOption) {
                if (Array.isArray(formData)) {
                    answerList = formData.map((item: any) => ({
                        optionId: Number(item),
                        answer: null,
                    }));
                } else {
                    answerList = [{
                        optionId: Number(formData),
                        id: answerId,
                        answer: null,
                    }];
                }
            } else {
                answerList = [{
                    optionId: null,
                    id: answerId,
                    answer: String(formData),
                }];
            }

            const res = await AxiosApi.post("/take-part/insert-answer", {
                formId: question.formId, takePartId, questionId: question.questionId, answerList,
            });

            if (!res.data.questionId) {
                setFinishPage(true);
            } else {
                initializeQuestion(res.data, res.data.userAnswerModel?.answersModel ?? []);
            }

        } catch (e) {
            console.error("Error in handleNext:", e);
            toast.error("خطا در ارسال پاسخ");
        } finally {
            setQuestionLoading(false);
        }
    };

    const handlePrev = async () => {
        try {
            setQuestionLoading(true);
            const res = await AxiosApi.post("/question/previous-question", {takePartId});
            const q = res.data.questionModel;
            const a = res.data.userAnswerModel?.answersModel ?? [];

            initializeQuestion(q, a);
            setIsValid(true);
        } catch (e) {
            console.error("Error in handlePrev:", e);
            toast.error("خطا در بازگشت به سوال قبلی");
        } finally {
            setQuestionLoading(false);
        }
    };

    const FormComponent = useMemo(() => {
        return question?.questionType ? FormElements[question.questionType as ElementsType]?.formComponent : null;
    }, [question]);

    const ValidatedInput = useMemo(() => {
        return FormComponent ? withValidation(FormComponent) : () => null;
    }, [FormComponent]);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchInitialData();
    }, [fetchInitialData]);

    return {
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
        hasError,
        realFormID,
        isCurrentFirstQuestion
    };
};