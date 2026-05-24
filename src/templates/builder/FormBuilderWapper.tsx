import React from 'react'
import { useEffect } from 'react';
import FormBuilder from './FormBuilder';
import { idGenerator } from '@/lib/idGenerator';
import useActionDesigner from '@/hooks/useActionDesigner';
import useActionElements from '@/hooks/useActionElements';
import { FormElementInstance } from '@/types/FormElements';
// ------------------------------------------------------------
export default function FormBuilderWapper({ data }: any) {
    const setElements = useActionElements();
    const {
        setQuestionGroups,
        addStartPage,
        addFinishPage,
        setFormName,
        setFormSetting,
    } = useActionDesigner();

    useEffect(() => {
        if (!data) return;
        const questionGroupIds =
            data?.questionGroups?.map((g: any) => g.questionGroupId) || [];
        setQuestionGroups(questionGroupIds);

        setFormSetting(data.formSettingModel);

        const allQuestions =
            data?.questionGroups?.flatMap((g: any) => g.questions) || [];

        const cleanedQuestions = allQuestions.map((q: FormElementInstance) => {
            const { questionPropertyList, optionList, spectralPlaceList, ...rest } = q;
            return rest;
        });

        setElements(cleanedQuestions);

        if (data?.startPageMsg) {
            addStartPage({
                questionId: idGenerator(),
                questionType: 'TitleFieldStart',
                startPageMsg: data.startPageMsg,
            } as FormElementInstance);
        }

        if (data?.endPageList?.length > 0) {
            const endPage = data.endPageList[0];
            const { endPageId, ...rest } = endPage;

            addFinishPage({
                questionId: endPageId,
                questionType: 'TitleFieldFinish',
                ...rest,
            } as FormElementInstance);
        }

        setFormName(data.name);
    }, [
        data,
        addFinishPage,
        addStartPage,
        setElements,
        setFormName,
        setQuestionGroups,
        setFormSetting,
    ]);

    return <FormBuilder data={data} />;
}
