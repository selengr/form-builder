"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AxiosApi from "@/services/axios/AxiosApi";
import ActionButtons from "@/templates/form/ActionButtons";
import { LinearProgress } from "@mui/material";
import ResponsiveContainer from "@/templates/form/ContentWrapper";
import AnimatedBox from "@/templates/form/AnimatedBox";
import FormLimitation from "@/templates/form/FormLimitation";
// import { ElementsType, FormElements } from "@/types/FormElements";

export interface ILimitation {
  isLimited: boolean;
  limitationType: "" | "phone" | "email";
}

export default function ParticipateFormPage() {
  const [question, setQuestion] = useState<any>(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [limitation, setLimitation] = useState<ILimitation>({
    isLimited: false,
    limitationType: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await AxiosApi.get(
          "/take-part/check-response-limitation-form"
        );

        console.log(res);

        // if (res.data) {
        //   setLimitation({});
        // }
        setFirstLoading(false);
        // await takePartApi();
      } catch (error) {
        console.log(error);
      }
    }

    async function takePartApi() {
      try {
        const response = await AxiosApi.post(
          "/take-part/6c37faec-870b-4ca9-a96b-900e12d384a4"
        );

        // setFirstLoading(false);
        // setQuestion(response.data.data)
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // const FormComponent =
  //   FormElements[question?.questionType as ElementsType]?.formComponent;

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
      <AnimatedBox key="">
        <></>
        {/* <FormComponent elementInstance={question} /> */}
      </AnimatedBox>
      <ActionButtons
        loadingNext={questionLoading}
        disablePrev={questionLoading}
        nextAction={() => {}}
        prevAction={() => {}}
      />
    </ResponsiveContainer>
  );
}
