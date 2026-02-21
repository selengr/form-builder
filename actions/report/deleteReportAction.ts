'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function deleteReportAction(id: number) {
  const url = `/report/solo/${id}`;
  const res = await serverApi.delete(url);
  return res.data;
}