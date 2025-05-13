import {useCallback, useEffect, useMemo, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from "sonner";
import AxiosApi from "@/services/axios/AxiosApi";
import {ElementsType, FormElements} from "@/types/FormElements";
import withValidation from "@/components/Fields/FormHOC";
import {fetchUserInfo} from "@/lib/auth";

export interface ILimitation {
  isLimited: boolean;
  limitationType: "" | "phone" | "email";
}

export const useParticipateForm = () => {

  const [question, setQuestion] = useState<any>(null);
  const [formData, setFormData] = useState<any>("");
  const [isValid, setIsValid] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [takePartId, setTakePartId] = useState<any>(null);
  const [finishPage, setFinishPage] = useState(false);
  const [limitation, setLimitation] = useState<ILimitation>({isLimited: false, limitationType: ""});

  const {slug} = useParams<{ slug: string }>();
  const {replace} = useRouter();

  const extractProperty = useCallback((list: any[], key: string) =>
    list?.find((item) => item.questionPropertyEnum === key)?.value, []);

  const initializeQuestion = useCallback((q: any) => {
    const required = extractProperty(q.questionPropertyList, "REQUIRED") === "true";
    const pattern = extractProperty(q.questionPropertyList, "TEXT_FIELD_PATTERN");
    const minLength = Number(extractProperty(q.questionPropertyList, "MINIMUM_LEN"));
    const isMultiSelect = extractProperty(q.questionPropertyList, "MULTI_SELECT") === "true";

    switch (q.questionType) {
      case "SPECTRAL": {
        const start = Number(extractProperty(q.questionPropertyList, "SPECTRAL_START"));
        const end = Number(extractProperty(q.questionPropertyList, "SPECTRAL_END"));
        const type = extractProperty(q.questionPropertyList, "SPECTRAL_TYPE");
        setFormData(type === "DOMAIN" ? [start, end] : start);
        break;
      }
      case "MULTIPLE_CHOICE":
      case "MULTIPLE_CHOICE_IMAGE":
        setFormData(isMultiSelect ? [] : "");
        break;
      default:
        setFormData("");
    }

    const valid =
      !required ||
      (q.questionType === "TEXT_FIELD" &&
        (pattern === "SHORT_TEXT" || pattern === "LONG_TEXT") &&
        minLength <= 0);

    setIsValid(valid);
  }, [extractProperty]);

  const fetchInitialData = useCallback(async () => {
    try {
      const res = await AxiosApi.post("/take-part/check-response-limitation-form", {
        link: slug.startsWith("public-") ? slug : null,
        id: !slug.startsWith("public-") ? slug : null,
      });
      const { userInfo, isAuthenticated, error } = await fetchUserInfo();
      if (res?.data?.loggedInStatus === false && res?.data?.responseLimitation) {
        setLimitation({isLimited: true, limitationType: res.data.responseLimitation});
      } else if (res?.data?.responseLimitation) {
        await checkAnswerBefore(userInfo.user.username);
      } else {
        await takePart(userInfo.user.username);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFirstLoading(false);
    }
  }, [slug]);

  const takePart = async (userName:string) => {
    const res = await AxiosApi.post("/take-part", {
      link: slug.startsWith("public-") ? slug : null,
      formId: !slug.startsWith("public-") ? slug : null,
      username: userName,
    });

    setTakePartId(res.data.takePart);
    setQuestion(res.data.questionModel);
    initializeQuestion(res.data.questionModel);
  };

  const checkAnswerBefore = async (userName:string) => {

    const res = await AxiosApi.post("/take-part/check-answer-to-form-before", {
      link: slug.startsWith("public-") ? slug : null,
      formId: !slug.startsWith("public-") ? slug : null,
      username: userName,
    });

    setTakePartId(res.data.takePart);
    setQuestion(res.data.questionModel);
    initializeQuestion(res.data.questionModel);
  };

  const handleValidationUpdate = (isValid: boolean, value: any) => {
    setIsValid(isValid);
    setFormData(value);
  };

  const handleNext = async () => {
    if (!isValid) return toast.error("پاسخ به این سوال الزامی می‌باشد");
    setQuestionLoading(true);

    try {
      const props = question.questionPropertyList;
      const isMultiSelect = extractProperty(props, "MULTI_SELECT") === "true";
      const spectralType = extractProperty(props, "SPECTRAL_TYPE");

      const needsOption = isMultiSelect || spectralType === "DOMAIN";
      const answerList = needsOption
        ? formData.map((item: any) => ({optionId: question.questionType === "SPECTRAL" ? null : item, answer: item}))
        : [{optionId: ["SPECTRAL", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE_IMAGE"].includes(question.questionType) ? formData : null, answer: formData}];

      const res = await AxiosApi.post("/take-part/insert-answer", {
        formId: question.formId,
        takePartId,
        questionId: question.questionId,
        answerList,
      });

      if (!res.data.questionId) {
        setFinishPage(true);
      } else {
        setQuestion(res.data);
        initializeQuestion(res.data);
      }
    } catch (e) {
      console.error(e);
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

      setQuestion(q);
      initializeQuestion(q);

      const isMultiSelect = extractProperty(q.questionPropertyList, "MULTI_SELECT") === "true";
      const spectralType = extractProperty(q.questionPropertyList, "SPECTRAL_TYPE");

      if (isMultiSelect) {
        setFormData(a.map((ans: any) => Number(ans.optionId)));
      } else if (spectralType === "DOMAIN") {
        setFormData(a.map((ans: any) => Number(ans.answer)));
      } else {
        setFormData(a[0]?.answer);
      }

      setIsValid(true);
    } catch (e) {
      console.error(e);
    } finally {
      setQuestionLoading(false);
    }
  };

  const FormComponent = useMemo(() => FormElements[question?.questionType as ElementsType]?.formComponent, [question]);
  const ValidatedInput = useMemo(() => withValidation(FormComponent), [FormComponent]);

  useEffect(() => {
    (async () => {
      await fetchInitialData();
    })();

  }, [fetchInitialData]);

  return {
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
  };
};
