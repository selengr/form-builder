'use server';

import { api } from '@/services/axios/actionWapper';

export async function duplicateReportAction(id: number) {
  return api.post(`/report/solo/main-list/${id}/duplicate`);
}
