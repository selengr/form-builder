'use server';

import { api } from '@/services/axios/actionWapper';

export async function getMinorFormulaAction(minorId: number | string) {
  const result = await api.get(`/admin/data-collection/formulas/minor/${minorId}`);

  console.log('[getMinorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
