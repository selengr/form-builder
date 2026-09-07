'use server';

import { api } from '@/services/axios/actionWapper';

export async function exportExcelAction(takePartIdList: number[]) {
  return api.post('/report/solo/main-list/excel-export', { takePartIdList });
}
