'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export interface TTicketFormData {
  formId: string | string[];
  ticket: string;
  publicationApprovalByAdmin: boolean;
}

export async function postChangeStatusAction(data: TTicketFormData) {
  const url = `/admin/form/change-status`;
  const res = await AxiosApi.put(url, data);
  return res.data;
}