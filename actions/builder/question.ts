'use server';

import { serverApi } from '@/services/axios/serverApi'; 
export interface IPostPackageFormInjectionBody {
  position: number;
  targetFormId :number
  selectedFormId :number;
}

export async function createQuestionAction(payload: any) {
  try {
    const res = await serverApi.post('/question', payload);
    return { data: res.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'انجام عملیات با خطا مواجه شد';

    throw new Error(message);
  }
}

export async function updateQuestionAction(questionId: string, payload: any) {
  try {
    const res: any = await serverApi.put(`/question/${questionId}`, payload);
    return { data: res.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'انجام عملیات با خطا مواجه شد';

    throw new Error(message);
  }
}

export async function createPackagingFormInjection(payload: IPostPackageFormInjectionBody) {
  try {
    const res: any = await serverApi.post(`/admin/packaging/form-injection`, payload);
    return { data: res.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'انجام عملیات با خطا مواجه شد';

    throw new Error(message);
  }
}