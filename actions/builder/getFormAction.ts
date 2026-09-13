'use server';

import { api } from '@/services/axios/actionWapper';

export async function getFormAction(id: string) {
  return api.get(`/form/${id}`);
}
