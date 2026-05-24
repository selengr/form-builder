'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function getConditionListAction(formId: string) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/condition/main-list/${formId}`;
  const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
  const url = baseUrl

  const res = await serverApi.get(url);
  return res.data.content;
}