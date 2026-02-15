'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function createEndPageAction(payload: any) {
  const res: any = await AxiosApi.post('/form/end-page', payload);
  return { data: res.data };
}

export async function updateEndPageAction(payload: any) {
  const res: any = await AxiosApi.put('/form/end-page', payload);
  return { data: res.data };
}