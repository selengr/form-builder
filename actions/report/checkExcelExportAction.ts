'use server';

import { api } from '@/services/axios/actionWapper';

export async function checkExcelExportAction(id: string | number) {
  return api.get(`/report/solo/main-list/excel-export/check/${id}`);
}
