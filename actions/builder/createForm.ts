
'use server';

import { api } from '@/services/axios/actionWapper'; 

export async function creatFormAction(body: any) {
  return api.post<{ id: string }>('/form', body);
}