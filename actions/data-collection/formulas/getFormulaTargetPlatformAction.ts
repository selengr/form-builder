'use server';

import { api } from '@/services/axios/actionWapper';

export interface IGetFormulaTargetPlatform {
  value: string;
  caption: string;
}

type TargetPlatformResponse = {
  dataList: IGetFormulaTargetPlatform[];
};

export async function getFormulaTargetPlatformAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10,
  };

  const url =
    `/admin/data-collection/formulas/target-platform/custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  const result = await api.get<TargetPlatformResponse>(url);

  console.log('[getFormulaTargetPlatformAction] response:', JSON.stringify(result, null, 2));

  return result;
}
