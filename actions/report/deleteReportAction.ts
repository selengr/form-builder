'use server';

import { api } from '@/services/axios/actionWapper';

export async function deleteReportAction(id: number) {
  return api.delete(`/report/solo/${id}`);
}
