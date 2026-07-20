'use server';

import { api } from '@/services/axios/actionWapper';
import { PackagingRequestStatus } from '@/templates/user-packaging-request/constants';

export interface ProcessAdminPackagingRequestPayload {
  id: number;
  status: Extract<PackagingRequestStatus, 'ACCEPTED' | 'REJECTED' | 'REVISION'>;
  newComment?: string | null;
}

export async function processAdminPackagingRequestAction(
  data: ProcessAdminPackagingRequestPayload,
) {
  return api.post('/admin/packaging-request/process', data);
}
