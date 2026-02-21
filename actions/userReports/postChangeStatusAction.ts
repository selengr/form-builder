'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface TTicketFormData {
  formId: string | string[];
  ticket: string;
  publicationApprovalByAdmin: boolean;
}

export async function postChangeStatusAction(data: TTicketFormData) {
  const url = `/admin/form/change-status`;
  const res = await serverApi.put(url, data);
  return res.data;
}