'use server';

import { api } from '@/services/axios/actionWapper';

type TicketListResponse = {
  content: any[];
};

export async function getTicketListAction(id: string | string[]): Promise<any[]> {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 10,
  };

  const baseUrl = `/admin/destroy-form/list-ticket/${id}`;
  const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
  const url = baseUrl + queryString;

  const result = await api.get<TicketListResponse>(url);

  if (!result.success) {
    throw new Error(result.message || 'انجام عملیات با خطا مواجه شد');
  }

  return result.data.content;
}
