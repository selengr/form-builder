'use server';

import { api } from '@/services/axios/actionWapper';

export interface TicketItem {
  ticket: string;
  adminTicket: boolean;
  registrarInformation: string;
  formBuilderName: string;
}

type TicketListResponse = {
  content: TicketItem[];
};

export async function getTicketListAction(id: string | string[]) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 10,
  };

  const baseUrl = `/admin/destroy-form/list-ticket/${id}`;
  const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
  const url = baseUrl + queryString;

  return api.get<TicketListResponse>(url);
}
