'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export async function updateReportPositionAction(data: IUpdatePositionPayload) {
  const url = '/report/solo/change-position';

  const res = await AxiosApi.post(url, data);
  return res.data;
}