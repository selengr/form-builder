'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function upsertStartPageAction(payload: any) {
  const res: any = await AxiosApi.put('/form/start-page', payload);
  return { data: res.data };
}