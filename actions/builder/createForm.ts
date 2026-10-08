
'use server';

import { api } from '@/services/axios/actionWapper'; 

export interface CreateFormPayload {
  name: string;
  typeEnum: string;
  formCategorysModel: {
    categoryId: string[];
  };
}

export async function creatFormAction(body: CreateFormPayload) {
  return api.post<{ id: string }>('/form', body);
}