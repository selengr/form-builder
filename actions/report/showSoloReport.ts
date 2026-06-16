'use server';

import { api } from '@/services/axios/actionWapper';
import { serverApi } from '@/services/axios/serverApi';

export async function showSoloReport(
  data: { formId: number; takePartId: number }[]
) {
  // try {
    const url = '/report/solo/show-solo-report';
    const response = await serverApi.post(url, data);
    return response.data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';

  //   throw new Error(message);
  // }
}

export async function deleteTakePartAction(params: {
  formId: string | number;
  takePartId: string | number;
}) {
  const { takePartId, formId } = params;

  const body = [
    {
      formId,
      takePartId,
    },
  ];

  return await api.post("/report/solo/take-part-delete", body);
}
