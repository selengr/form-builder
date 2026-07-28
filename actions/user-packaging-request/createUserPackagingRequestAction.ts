'use server';

import { api } from '@/services/axios/actionWapper';

export interface CreatePackagingRequestPayload {
  name: string;
  targetLabelEnum: string;
  ownershipTypeEnum: 'OWNERSHIP_SINGLE' | 'OWNERSHIP_MULTI';
  documentList: Array<{ title: string; uuid: string }>;
  formCategorysModel?: {
    categoryId: number[];
  } | null;
  newComment?: string;
}

export async function createUserPackagingRequestAction(data: CreatePackagingRequestPayload) {
  return api.post('/user/packaging-request', data);
}
