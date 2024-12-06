"use client";

import { useEffect, useState } from "react";
import useActionDesigner from "@/hooks/useActionDesigner";
import useActionElements from "@/hooks/useActionElements";
import { idGenerator } from "@/lib/idGenerator";
import AxiosApi from "@/services/axios/AxiosApi";
import FormBuilder from "@/templates/builder/FormBuilder";
import { FormElementInstance } from "@/types/FormElements";
import { notFound, useParams } from "next/navigation";
import BuilderLoading from "./loading";

export default function BuilderPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const setElements = useActionElements();
  const { setQuestionGroups, addStartPage, addFinishPage, setFormName } =
    useActionDesigner();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await AxiosApi.get(`/form/${id}`);

        const allQuestionGroups = response?.data?.questionGroups?.map(
          (group: any) => group?.questionGroupId
        );
        setQuestionGroups(allQuestionGroups);

        const allQuestions = response?.data?.questionGroups
          ?.map((group: any) => group?.questions)
          .flat();
        const newQuestions = allQuestions.map(
          (question: FormElementInstance) => {
            delete question.questionPropertyList;
            delete question.optionList;
            delete question.spectralPlaceList;
            return question;
          }
        );
        setElements(newQuestions);

        if (response?.data?.startPageMsg) {
          const startPage = {
            startPageMsg: response?.data?.startPageMsg,
            questionId: idGenerator(),
            questionType: "TitleFieldStart",
          };
          addStartPage(startPage as FormElementInstance);
        }

        if (response?.data?.endPageList?.length) {
          const endPage: any = response?.data?.endPageList[0];
          const newEndPage = {
            ...endPage,
            questionId: endPage.endPageId,
            questionType: "TitleFieldFinish",
          };
          delete newEndPage.endPageId;
          addFinishPage(newEndPage as any);
        }

        setFormName(response?.data.name);
      } catch (err) {
        console.log(err);
        setError("Form not found");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  if (loading) {
    return <BuilderLoading />;
  }

  if (error) {
    notFound();
  }

  return <FormBuilder />;
}
