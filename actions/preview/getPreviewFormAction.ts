'use server';

import { api } from '@/services/axios/actionWapper';
import { FormElementInstance } from '@/types/FormElements';
import { IEndPageList } from '@/types/bulider';

type formResDataTypes = {
  name: string;
  description: string;
  typeValue: string;
  startPageMsg: string | null;
  endPageList: IEndPageList[];
  questionGroups: {
    formId: number;
    questionGroupId: number;
    questions: FormElementInstance[];
  }[];
};

export async function getPreviewFormData(id: string | string[], admin: boolean) {
  const result = await api.get<formResDataTypes>(
    admin ? `/admin/form/${id}` : `/user/form/${id}`,
  );

  if (!result.success) {
    return {
      success: false,
      type: 'dataFailed',
      error: result.message,
    };
  }

  const allQuestions =
    result.data?.questionGroups?.map((group) => group?.questions).flat() ?? [];

  if (!allQuestions.length) {
    return {
      success: false,
      type: 'noQuestionExist',
    };
  }

  return {
    success: true,
    type: 'dataReceived',
    data: {
      questions: allQuestions as FormElementInstance[],
      title: result.data.name,
    },
  };
}
