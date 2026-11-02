'use server';

import { api } from '@/services/axios/actionWapper';

export async function getMinorFormulaAction(minorId: number | string) {
  const result = await api.get(`/admin/data-collection/formulas/minor/${minorId}`);

  return result;
}
