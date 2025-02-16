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
  // const [finishPage, setFinishPage] = useState<boolean>(false);
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

        takePartApi();
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

        const requiredData =
          extractProperty(
            response.data.questionModel.questionPropertyList,
            "REQUIRED"
          ) === "true";
        const startData = extractProperty(
          response.data.questionModel.questionPropertyList,
          "SPECTRAL_START"
        );
        const endData = extractProperty(
          response.data.questionModel.questionPropertyList,
          "SPECTRAL_END"
        );
        const selectionTypeData = extractProperty(
          response.data.questionModel.questionPropertyList,
          "SELECTION_TYPE"
        );
        const minLengthData = extractProperty(
          response.data.questionModelquestionPropertyList,
          "MINIMUM_LEN"
        );

        if (response.data.questionModel.questionType === "SPECTRAL") {
          setFormData(
            selectionTypeData === "DOMAIN"
              ? [Number(startData), Number(endData)]
              : Number(startData)
          );
        } else {
          setFormData("");
        }

        setFirstLoading(false);
        setIsValid(!requiredData);
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

      // if (!res.data.questionId) {
      //   setFinishPage(true);
      // } else {
      const requiredData =
        extractProperty(res.data.questionPropertyList, "REQUIRED") === "true";
      const startData = extractProperty(
        res.data.questionPropertyList,
        "SPECTRAL_START"
      );
      const endData = extractProperty(
        res.data.questionPropertyList,
        "SPECTRAL_END"
      );
      const selectionTypeData = extractProperty(
        res.data.questionPropertyList,
        "SELECTION_TYPE"
      );
      const minLengthData = extractProperty(
        res.data.questionPropertyList,
        "MINIMUM_LEN"
      );

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
      // }
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

  // if (finishPage) {
  //   return (
  //     <ResponsiveContainer>
  //       <p>خدانگهدار</p>
  //     </ResponsiveContainer>
  //   );
  // }

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
