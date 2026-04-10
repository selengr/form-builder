'use server';

import { serverApi } from '@/services/axios/serverApi';
import type { IPostCondition } from '@/types/conditionReportSolo';

type PostReportSoloParams = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postReportSoloAction({ data, isEdit }: PostReportSoloParams) {
  try {
    const url = isEdit ? `/report/solo/${data?.[0]?.id}` : `/report/solo`;

    const res = isEdit
      ? await serverApi.put(url, data)
      : await serverApi.post(url, data);

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}