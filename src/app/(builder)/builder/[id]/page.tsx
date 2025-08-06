'use client';

import { useCallback, useEffect, useState } from 'react';
import useActionDesigner from '@/hooks/useActionDesigner';
import useActionElements from '@/hooks/useActionElements';
import { idGenerator } from '@/lib/idGenerator';
import { AxiosApi } from '@/services/axios/AxiosApi';
import FormBuilder from '@/templates/builder/FormBuilder';
import { FormElementInstance } from '@/types/FormElements';
import { useParams } from 'next/navigation';
import BuilderLoading from './loading';

export default function BuilderPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const setElements = useActionElements();
  const { setQuestionGroups, addStartPage, addFinishPage, setFormName, setFormSetting } = useActionDesigner();

  const fetchFormData = useCallback(async () => {
    try {
      const { data } = await AxiosApi.get(`/form/${id}`);
      const questionGroupIds = data?.questionGroups?.map((group: any) => group.questionGroupId) || [];
      setQuestionGroups(questionGroupIds);
      setFormSetting(data.formSettingModel);
      const allQuestions = data?.questionGroups?.flatMap((group: any) => group.questions) || [];
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
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, addFinishPage, addStartPage, setElements, setFormName, setQuestionGroups]);

  useEffect(() => {
    fetchFormData().then((r) => r);
  }, [fetchFormData]);

  if (loading) return <BuilderLoading />;
  if (error) throw new Error('Form not found');

  return <FormBuilder />;
}
