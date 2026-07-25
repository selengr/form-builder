'use server';

import { api } from '@/services/axios/actionWapper';
import { PackagingRequestDetail } from '@/templates/user-packaging-request/types';

export async function getAdminPackagingRequestByIdAction(id: number) {
  return api.get<PackagingRequestDetail>(`/admin/packaging-request/main-list/${id}`);
}
