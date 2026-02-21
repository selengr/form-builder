'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function createEndPageAction(payload: any) {
  const res: any = await serverApi.post('/form/end-page', payload);
  return { data: res.data };
}

export async function updateEndPageAction(payload: any) {
  const res: any = await serverApi.put('/form/end-page', payload);
  return { data: res.data };
}