'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function getQacWithOutFilterAction(id: string | string[]) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: { formId: id, typeRequest: 'QAC_WIHT_OUT_FILTER' },
  };

  const baseUrl = '/question/q-and-c-custom-combo';
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;

  const response = await AxiosApi.get(url);
  return response.data;
}