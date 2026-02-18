'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function deleteConditionAction(id: number) {
  const url = `/condition/${id}`;
  const response = await AxiosApi.delete(url);
  return response.data;
}