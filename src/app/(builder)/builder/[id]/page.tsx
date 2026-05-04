'use client';

import { toast } from 'sonner';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useActionDesigner from '@/hooks/useActionDesigner';
import useActionElements from '@/hooks/useActionElements';
import { idGenerator } from '@/lib/idGenerator';
import { FormElementInstance } from '@/types/FormElements';
import FormBuilder from '@/templates/builder/FormBuilder';
import BuilderLoading from './loading';
import { useGetForm } from '../_hook/useGetForm';

export default function BuilderPage() {
  const { id } = useParams();

  const setElements = useActionElements();
  const {
    setQuestionGroups,
    addStartPage,
    addFinishPage,
    setFormName,
    setFormSetting,
  } = useActionDesigner();

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetForm(id);

  useEffect(() => {
    debugger
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

  if (isLoading) return <BuilderLoading />;
  if (isError) {
    if (error.message) {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    } else {
      toast.error(error as any || 'انجام عملیات با خطا مواجه شد');
    }
  }

  return <FormBuilder data={data} />;
}



//   'use client';

// import { useCallback, useEffect, useState } from 'react';
// import useActionDesigner from '@/hooks/useActionDesigner';
// import useActionElements from '@/hooks/useActionElements';
// import { idGenerator } from '@/lib/idGenerator';
// import { AxiosApi } from '@/services/axios/AxiosApi';
// import FormBuilder from '@/templates/builder/FormBuilder';
// import { FormElementInstance } from '@/types/FormElements';
// import { useParams } from 'next/navigation';
// import BuilderLoading from './loading';

// export default function BuilderPage() {
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [settingsData, setSettingsData] = useState<any>();

//   const setElements = useActionElements();
//   const { setQuestionGroups, addStartPage, addFinishPage, setFormName, setFormSetting } = useActionDesigner();

//   const fetchFormData = useCallback(async () => {
//     try {
//       const { data } = await AxiosApi.get(`/form/${id}`);
//       setSettingsData(data);
//       const questionGroupIds = data?.questionGroups?.map((group: any) => group.questionGroupId) || [];
//       setQuestionGroups(questionGroupIds);
//       setFormSetting(data.formSettingModel);
//       const allQuestions = data?.questionGroups?.flatMap((group: any) => group.questions) || [];
//       const cleanedQuestions = allQuestions.map((q: FormElementInstance) => {
//         const { questionPropertyList, optionList, spectralPlaceList, ...rest } = q;
//         return rest;
//       });
//       setElements(cleanedQuestions);

//       if (data?.startPageMsg) {
//         addStartPage({
//           questionId: idGenerator(),
//           questionType: 'TitleFieldStart',
//           startPageMsg: data.startPageMsg,
//         } as FormElementInstance);
//       }

//       if (data?.endPageList?.length > 0) {
//         const endPage = data.endPageList[0];
//         const { endPageId, ...rest } = endPage;
//         addFinishPage({
//           questionId: endPageId,
//           questionType: 'TitleFieldFinish',
//           ...rest,
//         } as FormElementInstance);
//       }

//       setFormName(data.name);
//     } catch (err) {
//       console.error('Error fetching form data:', err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, addFinishPage, addStartPage, setElements, setFormName, setQuestionGroups]);

//   useEffect(() => {
//     fetchFormData().then((r) => r);
//   }, [fetchFormData]);

//   if (loading) return <BuilderLoading />;
//   if (error) throw new Error('Form not found');

//   return <FormBuilder data={settingsData}/>;
// }

