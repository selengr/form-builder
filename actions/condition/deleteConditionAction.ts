'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteConditionAction(id: number) {
  return api.delete(`/condition/${id}`);
}
