'use server';

import { api } from '@/services/axios/actionWapper';

export async function showSoloReport(
  data: { formId: number; takePartId: number }[]
) {
  const url = '/report/solo/show-solo-report';

  const res = await api.post(url, data);

  return res;
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
