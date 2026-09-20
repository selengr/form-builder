'use server';

import { api } from '@/services/axios/actionWapper';

export async function getFormDataAction(id: string) {
  return api.get(`/form/${id}`);
}
