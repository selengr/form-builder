'use server';

import { api } from '@/services/axios/actionWapper';

const PAGE_SIZE = 100;

export async function getMinorFormulaListAction(majorId: number | string) {
  const params = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: PAGE_SIZE,
  };

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  const url = `/admin/data-collection/formulas/minor-list-grid/${majorId}?searchFilterModel=${encodedParams}`;

  const result = await api.get<{ content: unknown[]; totalElements: number }>(url);

  console.log('[getMinorFormulaListAction] response:', JSON.stringify(result, null, 2));

  return result;
}
