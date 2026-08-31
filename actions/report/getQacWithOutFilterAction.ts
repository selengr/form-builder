'use server';

import { api } from '@/services/axios/actionWapper';

export type GetQacWithOutFilterParams = { formId: string | number };

export async function getQacWithOutFilterAction({ formId }: GetQacWithOutFilterParams) {
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

  return api.get(url);
}
