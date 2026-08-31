'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteReportAction(id: number) {
  const result = await api.delete(`/report/solo/${id}`);

  if (!result.success) {
    throw new Error(result.message || 'انجام عملیات با خطا مواجه شد');
  }

  return result.data;
}
