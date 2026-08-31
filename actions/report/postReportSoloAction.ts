'use server';

import { api } from '@/services/axios/actionWapper';
import type { IPostCondition } from '@/types/conditionReportSolo';

type PostReportSoloParams = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postReportSoloAction({ data, isEdit }: PostReportSoloParams) {
  const url = isEdit ? `/report/solo/${data?.[0]?.id}` : `/report/solo`;

  return isEdit ? api.put(url, data) : api.post(url, data);
}
