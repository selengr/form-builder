'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function getOnlyAllQuestionsAction(id: string | string[]) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId: id,
      typeRequest: 'ONLY_ALL_QUESTIONS',
    },
  };

  const baseUrl = '/question/q-and-c-custom-combo';
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;

  const response = await serverApi.get(url);
  return response.data;
}