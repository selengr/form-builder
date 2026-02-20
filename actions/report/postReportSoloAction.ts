'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import type { IPostCondition } from '@/types/conditionReportSolo';

type PostReportSoloParams = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postReportSoloAction({ data, isEdit }: PostReportSoloParams) {
  const url = isEdit ? `/report/solo/${data?.[0]?.id}` : `/report/solo`;
  
  const res = isEdit
    ? await AxiosApi.put(url, data)
    : await AxiosApi.post(url, data);

  return res.data;
}