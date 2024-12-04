import { useEffect, memo } from "react";
import { FormElementInstance } from "@/types/FormElements";
import useActionElements from "@/hooks/useActionElements";
import useActionDesigner from "@/hooks/useActionDesigner";
import { formResDataTypes } from "@/types/bulider";
import { idGenerator } from "@/lib/idGenerator";
import FormBuilder from "./FormBuilder";

const FormBuilderMiddleware = memo(function FormBuilderMiddleware({
  formData,
}: {
  formData: formResDataTypes;
}) {
  const setElements = useActionElements();
  const { setQuestionGroups, addStartPage, addFinishPage, setFormName } =
    useActionDesigner();

  useEffect(() => {
    const allQuestionGroups = formData?.questionGroups?.map(
      (group: any) => group?.questionGroupId
    );
    setQuestionGroups(allQuestionGroups);

    const allQuestions = formData?.questionGroups
      ?.map((group: any) => group?.questions)
      .flat();
    const newQuestions = allQuestions.map((question: FormElementInstance) => {
      delete question.questionPropertyList;
      delete question.optionList;
      delete question.spectralPlaceList;
      return question;
    });
    setElements(newQuestions);

    if (formData?.startPageMsg) {
      const startPage = {
        startPageMsg: formData?.startPageMsg,
        questionId: idGenerator(),
        questionType: "TitleFieldStart",
      };
      addStartPage(startPage as FormElementInstance);
    }

    if (formData?.endPageList?.length) {
      const endPage: any = formData?.endPageList[0];
      const newEndPage = {
        ...endPage,
        questionId: endPage.endPageId,
        questionType: "TitleFieldFinish",
      };
      delete newEndPage.endPageId;
      addFinishPage(newEndPage as any);
    }

    setFormName(formData.name);
  }, []);

  return <FormBuilder />;
});

export default FormBuilderMiddleware;
