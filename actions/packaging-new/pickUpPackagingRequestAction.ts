'use server';

import { api } from '@/services/axios/actionWapper';

export async function pickUpPackagingRequestAction(id: number) {
  return api.post<{ response: boolean }>('/admin/packaging/packaging-request/pick-up', { id });
}
