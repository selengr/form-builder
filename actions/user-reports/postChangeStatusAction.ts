'use server';

import { api } from '@/services/axios/actionWapper';

export interface TTicketFormData {
  formId: string | string[];
  ticket: string;
  publicationApprovalByAdmin: boolean;
}

export async function postChangeStatusAction(data: TTicketFormData) {
  return api.put(`/admin/form/change-status`, data);
}
