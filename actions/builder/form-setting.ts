'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function formSetting(formId: string, payload: any) {
  // try {
    const res: any = await serverApi.post(`/form-setting/${formId}`, payload);
    return { data: res.data };
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';
  //   throw new Error(message);
  // }
}
