'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function showResult(
  data: { formId: number; takePartId: number }[]
) {
  const url = '/report/user/solo/show-solo-report-for-responder';
  const response = await serverApi.post(url, data);
  return response.data;
}