'use server';

import { api } from '@/services/axios/actionWapper';

export async function getMajorFormulaAction(majorId: number | string) {
  const result = await api.get(`/admin/data-collection/formulas/major/${majorId}`);

  return result;
}
