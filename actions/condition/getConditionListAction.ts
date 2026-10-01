'use server';

import { api } from '@/services/axios/actionWapper';
import type { IGetCondition } from '@/types/condition';

export async function getConditionListAction(formId: string) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const url =
    `/condition/main-list/${formId}` +
    `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;

  const result = await api.get<{ content: IGetCondition[] }>(url);

  if (!result.success) {
    return { success: false as const, message: result.message };
  }

  return {
    success: true as const,
    data: result.data.content,
  };
}
