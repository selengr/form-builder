'use server';

import { serverApi } from '@/services/axios/serverApi';
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
  try {
    const {
      data,
    }: {
      data: formResDataTypes;
    } = await serverApi.get(admin ? `/admin/form/${id}` : `/user/form/${id}`);

    const allQuestions = data?.questionGroups?.map((group: any) => group?.questions).flat();

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
        title: data.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      type: 'dataFailed',
      error: 'خطا در دریافت اطلاعات',
    };
  }
}
