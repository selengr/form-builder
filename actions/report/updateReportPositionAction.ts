'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export async function updateReportPositionAction(data: IUpdatePositionPayload) {
  const url = '/report/solo/change-position';

  const res = await serverApi.post(url, data);
  return res.data;
}