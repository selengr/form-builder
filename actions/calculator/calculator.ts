'use server';

import { api } from '@/services/axios/actionWapper';

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

  return api.get(url);
}

export async function fetchEditCalculatorsAction(calcId: number) {
  return api.get(`/calculation/main-list/find/${calcId}`);
}
