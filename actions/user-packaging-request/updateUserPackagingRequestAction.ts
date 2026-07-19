'use server';

import { api } from '@/services/axios/actionWapper';

export interface UpdatePackagingRequestPayload {
  id: number;
  name: string;
  documentList: Array<{
    id?: number;
    title: string;
    uuid: string;
  }>;
  newComment?: string;
}

export async function updateUserPackagingRequestAction(data: UpdatePackagingRequestPayload) {
  return api.put('/user/packaging-request', data);
}
