"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ActionButtons from "@/templates/form/ActionButtons";
import ResponsiveContainer from "@/templates/form/ContentWrapper";
import AnimatedBox from "@/templates/form/AnimatedBox";
import FormLimitation from "@/templates/form/FormLimitation";
import AxiosApi from "@/services/axios/AxiosApi";
import { ElementsType, FormElements } from "@/types/FormElements";
import withValidation from "@/components/Fields/FormHOC";
import { toast } from "sonner";

export interface ILimitation {
  isLimited: boolean;
  limitationType: "" | "phone" | "email";
}

const extractProperty = (questionPropertyList: any[], propertyEnum: string) => {
  return questionPropertyList?.find(
    (prop: any) => prop.questionPropertyEnum === propertyEnum
  )?.value;
};

export default function ParticipateFormPage() {
  const [question, setQuestion] = useState<any>(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [takePartId, setTakePartId] = useState<any>(null);
  const [formData, setFormData] = useState<any>("");
  const [finishPage, setFinishPage] = useState<boolean>(false);
  const [limitation, setLimitation] = useState<ILimitation>({
    isLimited: false,
    limitationType: "",
  });

  const addNewQuestion = useCallback((response: any) => {
    const requiredData =
      extractProperty(response.questionPropertyList, "REQUIRED") === "true";
    const startData = extractProperty(
      response.questionPropertyList,
      "SPECTRAL_START"
    );
    const endData = extractProperty(
      response.questionPropertyList,
      "SPECTRAL_END"
    );
    const selectionTypeData = extractProperty(
      response.questionPropertyList,
      "SELECTION_TYPE"
    );
    const minLengthData = extractProperty(
      response.questionPropertyList,
      "MINIMUM_LEN"
    );
    const textFieldPatternData = extractProperty(
      response.questionPropertyList,
      "TEXT_FIELD_PATTERN"
    );

    if (response.questionType === "SPECTRAL") {
      // ^ Previos data saves
      // ^ spectral
      setFormData(
        selectionTypeData === "DOMAIN"
          ? [Number(startData), Number(endData)]
          : Number(startData)
      );
    } else {
      // ^ Previos data saves
      // ^ spectral
      setFormData("");
    }

    if (requiredData) {
      setIsValid(false);
    } else if (
      response.questionType === "TEXT_FIELD" &&
      (textFieldPatternData === "SHORT_TEXT" ||
        textFieldPatternData === "LONG_TEXT")
    ) {
      if (Number(minLengthData) > 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      setIsValid(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setFirstLoading(true);
        const res = await AxiosApi.post(
          "/take-part/check-response-limitation-form",
          {
            id: null,
            link: "public-e3b1018b-52cf-4016-b79e-36e647119872",
          }
        );

        if (res?.data?.loggedInStatus === false) {
          if (res?.data?.responseLimitation) {
            setLimitation({
              isLimited: true,
              limitationType: res.data.responseLimitation,
            });
            setQuestionLoading(false);
          } else {
            setLimitation({
              isLimited: false,
              limitationType: "",
            });
            takePartApi();
          }
        } else {
          if (res?.data?.responseLimitation) {
            checkAnswerFormBefore();
          } else {
            setLimitation({
              isLimited: false,
              limitationType: "",
            });
            takePartApi();
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function takePartApi() {
      try {
        const response = await AxiosApi.post("/take-part", {
          link: "public-e3b1018b-52cf-4016-b79e-36e647119872",
          formId: null,
          username: null,
        });

        addNewQuestion(response.data.questionModel);

        setFirstLoading(false);
        setTakePartId(response.data.takePart);
        setQuestion(response.data.questionModel);
      } catch (error) {
        console.log(error);
      }
    }

    async function checkAnswerFormBefore() {
      try {
        const response = await AxiosApi.post(
          "/take-part/check-answer-to-form-before",
          {
            formId: null,
            link: null,
            username: null,
          }
        );

        // ^ chec this out
        console.log(response.data);
        addNewQuestion(response.data);

        setFirstLoading(false);
        setTakePartId(response.data.takePart);
        setQuestion(response.data.questionModel);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const handleValidationUpdate = (isValid: boolean, value: any) => {
    setIsValid(isValid);
    setFormData(value);
  };

  const handleNext = async () => {
    if (!isValid) {
      toast.error("الزامی می باشد");
      return;
    }

    setQuestionLoading(true);

    const answerList = [
      {
        optionId: question.questionType !== "TEXT_FIELD" ? formData : null,
        answer: question.questionType === "TEXT_FIELD" ? formData : null,
      },
    ];

    try {
      const res = await AxiosApi.post(`/take-part/insert-answer`, {
        formId: question.formId,
        takePartId: takePartId,
        questionId: question.questionId,
        answerList,
      });

      if (!res.data.questionId) {
        setFinishPage(true);
      } else {
        addNewQuestion(res.data);
        setQuestion(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handlePrev = async () => {
    try {
      setQuestionLoading(true);
      const res = await AxiosApi.post(`/question/previous-question`, {
        takePartId,
      });

      addNewQuestion(res.data.questionModel);
      setQuestion(res.data.questionModel);
      setIsValid(true);
      setFormData(
        res.data.userAnswerModel.answersModel[0].answer ??
          res.data.userAnswerModel.answersModel[0].optionId
      );
    } catch (error) {
      console.log(error);
    } finally {
      setQuestionLoading(false);
    }
  };

  const FormComponent = useMemo(() => {
    return FormElements[question?.questionType as ElementsType]?.formComponent;
  }, [question]);

  const ValidatedInput = useMemo(() => {
    return withValidation(FormComponent);
  }, [FormComponent]);

  if (finishPage) {
    return (
      <ResponsiveContainer>
        <p>موفق باشید</p>
      </ResponsiveContainer>
    );
  }

  if (firstLoading) {
    return (
      <ResponsiveContainer>
        <Box width="100%" height="50px" display="flex" alignItems="center">
          <LinearProgress sx={{ width: "100%" }} />
        </Box>
      </ResponsiveContainer>
    );
  }

  if (limitation.isLimited) {
    return (
      <ResponsiveContainer>
        <FormLimitation
          type={limitation.limitationType}
          setLimitation={setLimitation}
          setQuestion={setQuestion}
          addQuestion={addNewQuestion}
        />
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <AnimatedBox key={question?.questionId}>
        {question ? (
          <ValidatedInput
            key={question?.id}
            formData={formData}
            elementInstance={question}
            onValidationUpdate={handleValidationUpdate}
          />
        ) : null}
      </AnimatedBox>
      <ActionButtons
        loadingNext={questionLoading}
        // ^ check
        disablePrev={questionLoading || question?.position === 0}
        nextAction={handleNext}
        prevAction={handlePrev}
      />
    </ResponsiveContainer>
  );
}
