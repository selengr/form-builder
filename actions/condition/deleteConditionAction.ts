'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function deleteConditionAction(id: number) {
  const url = `/condition/${id}`;
  const response = await serverApi.delete(url);
  return response.data;
}