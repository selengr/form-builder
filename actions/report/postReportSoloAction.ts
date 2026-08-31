'use server';

import { api } from '@/services/axios/actionWapper';
import type { IPostCondition } from '@/types/conditionReportSolo';

type PostReportSoloParams = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postReportSoloAction({ data, isEdit }: PostReportSoloParams) {
  const url = isEdit ? `/report/solo/${data?.[0]?.id}` : `/report/solo`;

  const result = isEdit ? await api.put(url, data) : await api.post(url, data);

  if (!result.success) {
    throw new Error(result.message || 'انجام عملیات با خطا مواجه شد');
  }

  return result.data;
}
