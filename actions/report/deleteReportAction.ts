'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function deleteReportAction(id: number) {
  try {
    const url = `/report/solo/${id}`;
    const res = await serverApi.delete(url);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'انجام عملیات با خطا مواجه شد';

    throw new Error(message);
  }
}