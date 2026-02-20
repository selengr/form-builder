'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function getConditionListAction(formId: string) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/condition/main-list/${formId}`;
  const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
  const url = baseUrl + queryString;

  const res = await AxiosApi.get(url);
  return res.data.content;
}