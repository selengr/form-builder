'use server';

import { api } from '@/services/axios/actionWapper';

export interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export async function updateReportPositionAction(data: IUpdatePositionPayload) {
  const result = await api.post('/report/solo/change-position', data);

  if (!result.success) {
    throw new Error(result.message || 'انجام عملیات با خطا مواجه شد');
  }

  return result.data;
}
