'use server';

import { api } from '@/services/axios/actionWapper';

export interface MetaParamOption {
  value: string;
  caption: string;
}

export async function getMetaParamsComboAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10,
  };

  const url =
    `/admin/data-collection/formulas/meta-params-custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const result = await api.get<{ dataList?: MetaParamOption[] }>(url);

  console.log('[getMetaParamsComboAction] response:', JSON.stringify(result, null, 2));

  return result;
}
