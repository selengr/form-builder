'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export type OnlyAllQuestionsParams = { formId: string | number };

export async function getOnlyAllQuestionsAction({ formId }: OnlyAllQuestionsParams) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId: String(formId),
      typeRequest: 'ONLY_ALL_QUESTIONS',
    },
  };

  const url =
    `/question/q-and-c-custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const res = await AxiosApi.get(url);
  return res.data;
}