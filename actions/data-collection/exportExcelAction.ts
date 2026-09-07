'use server';

import { api } from '@/services/axios/actionWapper';

export async function exportDataCollectionExcelAction(takePartIdList: number[]) {
  return api.post(
    '/admin/form/data-collection/answers-data-sheet/excel-export',
    { takePartIdList },
  );
}
