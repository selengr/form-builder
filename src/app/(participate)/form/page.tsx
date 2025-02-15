"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ParticipateFormPage() {
  const [question, setQuestion] = useState<any>(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  // ^ if is required by default is false if not its true
  // ^ for the first initial click
  const [isValid, setIsValid] = useState(false);
  const [takePartId, setTakePartId] = useState<any>(null);
  const [formData, setFormData] = useState<any>("");
  const [limitation, setLimitation] = useState<ILimitation>({
    isLimited: false,
    limitationType: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await AxiosApi.post(
          "/take-part/check-response-limitation-form",
          {
            id: null,
            link: "public-e3b1018b-52cf-4016-b79e-36e647119872",
          }
        );

        if (res?.data?.responseLimitation) {
          setLimitation({
            isLimited: true,
            limitationType: res.data.responseLimitation,
          });
        }

        await takePartApi();
      } catch (error) {
        console.log(error);
      }
    }

    async function takePartApi() {
      try {
        const response = await AxiosApi.post("/take-part", {
          formId: null,
          link: "public-e3b1018b-52cf-4016-b79e-36e647119872",
          username: null,
        });

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
    try {
      const res = await AxiosApi.post(`/take-part/insert-answer`, {
        formId: question.formId,
        takePartId: takePartId,
        questionId: question.questionId,
        answerList: [
          {
            answer: formData,
            optionId: null,
          },
        ],
      });

      const requiredData = res.data.questionPropertyList?.find(
        (prop: any) => prop.questionPropertyEnum === "REQUIRED"
      )?.value;
      const startData = res.data.questionPropertyList.find(
        (prop: any) => prop.questionPropertyEnum === "SPECTRAL_START"
      )?.value;
      const endData = res.data.questionPropertyList.find(
        (prop: any) => prop.questionPropertyEnum === "SPECTRAL_END"
      )?.value;
      const selectionTypeData = res.data.questionPropertyList.find(
        (prop: any) => prop.questionPropertyEnum === "SELECTION_TYPE"
      )?.value;
      const minLengthData = res.data.questionPropertyList?.find(
        (prop: any) => prop.questionPropertyEnum === "MINIMUM_LEN"
      )?.value;

      if (res.data.questionType === "SPECTRAL") {
        setFormData(
          selectionTypeData === "DOMAIN"
            ? [Number(startData), Number(endData)]
            : Number(startData)
        );
      } else {
        setFormData("");
      }

      setIsValid(!requiredData);
      setQuestion(res.data);
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
        disablePrev={questionLoading}
        nextAction={handleNext}
        prevAction={() => {}}
      />
    </ResponsiveContainer>
  );
}
