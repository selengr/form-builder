'use server';

import { api } from '@/services/axios/actionWapper';

export async function checkDataCollectionExcelExportAction(id: string | number) {
  return api.get(
    `/admin/form/data-collection/answers-data-sheet/excel-export/check/${id}`,
  );
}
