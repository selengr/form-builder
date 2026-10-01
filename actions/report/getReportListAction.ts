'use server';

import { api } from '@/services/axios/actionWapper';
import type { IGetCondition } from '@/types/conditionReportSolo';

export type GetReportListParams = {
  formId: string | number;
  admin: boolean;
};

export async function getReportListAction({ formId, admin }: GetReportListParams) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const baseUrl = admin
    ? `/admin/report/solo/main-list/${String(formId)}`
    : `/report/solo/main-list/${String(formId)}`;

  const url =
    `${baseUrl}?searchFilterModel=` + encodeURIComponent(JSON.stringify(filterModel));

  return api.get<{ content: IGetCondition[] }>(url);
}
