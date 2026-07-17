'use server';

import { api } from '@/services/axios/actionWapper';

export interface CreatePackagingRequestPayload {
  name: string;
  targetLabelEnum: string;
  documentList: Array<{ title: string; uuid: string }>;
  formCategorysModel: {
    categoryId: number[];
  };
  newComment?: string;
}

export async function createUserPackagingRequestAction(data: CreatePackagingRequestPayload) {
  return api.post('/user/packaging-request', data);
}
