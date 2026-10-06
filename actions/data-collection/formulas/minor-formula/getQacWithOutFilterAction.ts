'use server';

import { api } from '@/services/axios/actionWapper';

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

  const url =
    `/question/q-and-c-custom-combo` +
    `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;

  return api.get(url);
}
