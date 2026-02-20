'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export type GetQacWithOutFilterListParams = { formId: string | number };

export async function getQacWithOutFilterListAction({ formId }: GetQacWithOutFilterListParams) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: { formId: String(formId), typeRequest: 'QAC_WIHT_OUT_FILTER' },
  };

  const url =
    `/question/q-and-c-custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const res = await AxiosApi.get(url);
  return res.data;
}