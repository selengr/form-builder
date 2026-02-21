'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function showSoloReport(
  data: { formId: number; takePartId: number }[]
) {
  const url = '/report/solo/show-solo-report';
  const response = await serverApi.post(url, data);
  return response.data;
}