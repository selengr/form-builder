'use server';

import { serverApi } from '@/services/axios/serverApi';

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

  const { data } = await serverApi.get<TicketListResponse>(url);
  return data.content;
}