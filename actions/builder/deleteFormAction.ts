'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteFormAction(id: string | number) {
  return api.delete(`/form/${id}`);
}
