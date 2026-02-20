'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function deleteReportAction(id: number) {
  const url = `/report/solo/${id}`;
  const res = await AxiosApi.delete(url);
  return res.data;
}