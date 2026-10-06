'use server';

import { api } from '@/services/axios/actionWapper';

export async function getOnlyAllCalcAction(formId: string) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId,
      typeRequest: 'ONLY_ALL_CALC',
    },
  };

  const url =
    `/question/q-and-c-custom-combo` +
    `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;

  return api.get(url);
}
