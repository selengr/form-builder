'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteMajorFormulaAction(majorId: number | string) {
  return api.delete(`/admin/data-collection/formulas/major/${majorId}`);
}
