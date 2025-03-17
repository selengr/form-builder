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
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";

export interface ILimitation {
  isLimited: boolean;
  limitationType: "" | "phone" | "email";
}

const extractProperty = (questionPropertyList: any[], propertyEnum: string) => {
  return questionPropertyList?.find(
    (prop: any) => prop.questionPropertyEnum === propertyEnum
  )?.value;
};

export type SlugParams = {
  slug: string;
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

  const { replace } = useRouter();
  const { slug } = useParams<SlugParams>();

  const addNewQuestion = useCallback((response: any) => {
    const requiredData = extractProperty(
      response.questionPropertyList,
      "REQUIRED"
    );
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
      "SPECTRAL_TYPE"
    );
    const minLengthData = extractProperty(
      response.questionPropertyList,
      "MINIMUM_LEN"
    );
    const textFieldPatternData = extractProperty(
      response.questionPropertyList,
      "TEXT_FIELD_PATTERN"
    );
    const isMultiSelect = extractProperty(
      response.questionPropertyList,
      "MULTI_SELECT"
    );

    if (response.questionType === "SPECTRAL") {
      setFormData(
        selectionTypeData === "DOMAIN"
          ? [Number(startData), Number(endData)]
          : Number(startData)
      );
    } else if (
      response.questionType === "MULTIPLE_CHOICE" ||
      response.questionType === "MULTIPLE_CHOICE_IMAGE"
    ) {
      if (isMultiSelect === "true") {
        setFormData([]);
      } else {
        setFormData("");
      }
    } else {
      setFormData("");
    }

    if (requiredData === "true") {
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
            link: slug.startsWith("public-") ? slug : null,
            id: !slug.startsWith("public-") ? slug : null,
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
          link: slug.startsWith("public-") ? slug : null,
          formId: !slug.startsWith("public-") ? slug : null,
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
        addNewQuestion(response.data.questionModel);

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

    let shouldFillOptionId = null;

    if (
      question.questionType === "MULTIPLE_CHOICE" ||
      question.questionType === "MULTIPLE_CHOICE_IMAGE" ||
      question.questionType === "SPECTRAL"
    ) {
      const isMultiSelect = extractProperty(
        question.questionPropertyList,
        "MULTI_SELECT"
      );
      const selectionTypeData = extractProperty(
        question.questionPropertyList,
        "SPECTRAL_TYPE"
      );

      if (isMultiSelect === "true") {
        shouldFillOptionId = true;
      } else if (selectionTypeData === "DOMAIN") {
        shouldFillOptionId = true;
      }
    }

    let optionIdObj = null;

    if (shouldFillOptionId) {
      optionIdObj = formData.map((data: any) => {
        return {
          optionId: question.questionType === "SPECTRAL" ? null : data,
          answer: data,
        };
      });
    }

    const answerList = shouldFillOptionId
      ? optionIdObj
      : [
          {
            optionId: null,
            answer: formData,
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

      let shouldFillOptionId = null;

      if (
        res.data.questionModel.questionType === "MULTIPLE_CHOICE" ||
        res.data.questionModel.questionType === "MULTIPLE_CHOICE_IMAGE" ||
        res.data.questionModel.questionType === "SPECTRAL"
      ) {
        const isMultiSelect = extractProperty(
          res.data.questionModel.questionPropertyList,
          "MULTI_SELECT"
        );
        const selectionTypeData = extractProperty(
          res.data.questionModel.questionPropertyList,
          "SPECTRAL_TYPE"
        );

        if (isMultiSelect === "true") {
          shouldFillOptionId = true;
        } else if (selectionTypeData === "DOMAIN") {
          shouldFillOptionId = true;
        }
      }

      let optionIdObj = null;

      if (shouldFillOptionId) {
        optionIdObj = res.data.userAnswerModel.answersModel.map((data: any) => {
          if (
            res.data.questionModel.questionType === "MULTIPLE_CHOICE" ||
            res.data.questionModel.questionType === "MULTIPLE_CHOICE_IMAGE" ||
            res.data.questionModel.questionType === "SPECTRAL"
          ) {
            const isMultiSelect = extractProperty(
              res.data.questionModel.questionPropertyList,
              "MULTI_SELECT"
            );
            const selectionTypeData = extractProperty(
              res.data.questionModel.questionPropertyList,
              "SPECTRAL_TYPE"
            );

            if (isMultiSelect === "true") {
              return Number(data.optionId);
            } else if (selectionTypeData === "DOMAIN") {
              return Number(data.answer);
            }
          }
        });
      }

      if (shouldFillOptionId) {
        setFormData(optionIdObj);
      } else {
        setFormData(res.data.userAnswerModel.answersModel[0].answer);
      }
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
        <div className="flex gap-4 flex-col justify-center items-center">
          <p className="text-center font-bold">موفق باشید 🌹</p>
          <Button
            sx={{
              width: "150px",
              height: "52px",
              borderRadius: "10px",
              backgroundColor: "#1758BA",
              boxShadow: "none",
              "& .MuiButtonBase-root, &.MuiButtonBase-root:hover, &.MuiButtonBase-root:active":
                {
                  backgroundColor: "#1758BA",
                  boxShadow: "none",
                },
            }}
            variant="contained"
            onClick={() => {
              replace("/");
            }}
          >
            بازگشت
          </Button>
        </div>
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

  // ^ Check For isLocked Status
  // ^ If True Disable the input

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
        disablePrev={questionLoading}
        nextAction={handleNext}
        prevAction={handlePrev}
      />
    </ResponsiveContainer>
  );
}
