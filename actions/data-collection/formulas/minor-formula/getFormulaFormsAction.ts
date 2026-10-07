'use server';

import { api } from '@/services/axios/actionWapper';

export async function getFormulaFormsAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10,
  };

  const url =
    `/admin/data-collection/formulas/forms-custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const result = await api.get(url);

  console.log('[getFormulaFormsAction] response:', JSON.stringify(result, null, 2));

  return result;
}
