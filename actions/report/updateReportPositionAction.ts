'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export async function updateReportPositionAction(data: IUpdatePositionPayload) {
  // try {
    const url = '/report/solo/change-position';

    const res = await serverApi.post(url, data);
    return res.data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';

  //   throw new Error(message);
  // }
}