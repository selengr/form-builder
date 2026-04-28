'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface TTicketFormData {
  formId: string | string[];
  ticket: string;
  publicationApprovalByAdmin: boolean;
}

export async function postChangeStatusAction(data: TTicketFormData) {
  try {
    const url = `/admin/form/change-status`;
    const res = await serverApi.put(url, data);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'انجام عملیات با خطا مواجه شد';

    throw new Error(message);
  }
}