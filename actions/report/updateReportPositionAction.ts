'use server';

import { api } from '@/services/axios/actionWapper';

export interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export async function updateReportPositionAction(data: IUpdatePositionPayload) {
  return api.post('/report/solo/change-position', data);
}
