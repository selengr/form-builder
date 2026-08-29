'use server';

import { api } from '@/services/axios/actionWapper';

export interface TTicketFormData {
  formId: string | string[];
  ticket: string;
  publicationApprovalByAdmin: boolean;
}

export async function postChangeStatusAction(data: TTicketFormData) {
  const result = await api.put(`/admin/form/change-status`, data);

  if (!result.success) {
    throw new Error(result.message || 'انجام عملیات با خطا مواجه شد');
  }

  return result.data;
}
