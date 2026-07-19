'use server';

import { api } from '@/services/axios/actionWapper';
import { PackagingRequestDetail } from '@/templates/user-packaging-request/types';

export async function getUserPackagingRequestByIdAction(id: number) {
  return api.get<PackagingRequestDetail>(`/user/packaging-request/main-list/${id}`);
}
