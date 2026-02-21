'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function fetchCalculatorsAction(formId: string) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId,
      typeRequest: 'QAC_BY_FILTER',
    },
  };

  const url =
    `/question/q-and-c-custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const response = await serverApi.get(url);
  return response.data;
}

export async function fetchEditCalculatorsAction(calcId: number) {
  const url = `/calculation/main-list/find/${calcId}`;
  const response = await serverApi.get(url);
  return response.data;
}