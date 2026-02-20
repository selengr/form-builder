'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function showSoloReport(
  data: { formId: number; takePartId: number }[]
) {
  const url = '/report/solo/show-solo-report';
  const response = await AxiosApi.post(url, data);
  return response.data;
}