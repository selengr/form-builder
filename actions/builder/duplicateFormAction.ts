'use server';

import { api } from '@/services/axios/actionWapper';

export async function duplicateFormAction(id: string | number) {
  return api.post(`/form/${id}/duplicate`);
}
