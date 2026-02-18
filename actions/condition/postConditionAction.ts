'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IPostCondition } from '@/types/condition';

type PostConditionArgs = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postConditionAction({ data, isEdit }: PostConditionArgs) {
  const url = isEdit ? `/condition/${data?.[0]?.id}` : `/condition`;

  const response = isEdit
    ? await AxiosApi.put(url, data)
    : await AxiosApi.post(url, data);

  return response.data;
}