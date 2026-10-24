'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteMinorFormulaAction(minorId: number | string) {
  return api.delete(`/admin/data-collection/formulas/minor/${minorId}`);
}
