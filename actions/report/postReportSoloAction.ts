'use server';

import { serverApi } from '@/services/axios/serverApi';
import type { IPostCondition } from '@/types/conditionReportSolo';

type PostReportSoloParams = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postReportSoloAction({ data, isEdit }: PostReportSoloParams) {
  const url = isEdit ? `/report/solo/${data?.[0]?.id}` : `/report/solo`;

  const res = isEdit
    ? await serverApi.put(url, data)
    : await serverApi.post(url, data);

  return res.data;
}