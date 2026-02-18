'use server';

import { getAuthToken } from '@/utils/getAuthToken';

const API_BASE = '/api/builder';

export async function getConditionListAction(formId: string | string[]) {
  const token = await getAuthToken();

  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;

  const res = await fetch(`${API_BASE}/condition/main-list/${formId}${queryString}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Condition_List (${res.status})`);
  }

  const data = await res.json();
  
  return data.content;
}