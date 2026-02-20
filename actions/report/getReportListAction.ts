'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

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
    `${baseUrl}?searchFilterModel=` +
    encodeURIComponent(JSON.stringify(filterModel));

  const res = await AxiosApi.get(url);
  return res.data.content;
}