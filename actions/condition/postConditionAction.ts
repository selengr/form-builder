'use server';

import { serverApi } from '@/services/axios/serverApi';
import { IPostCondition } from '@/types/condition';

type PostConditionArgs = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postConditionAction({ data, isEdit }: PostConditionArgs) {
  const url = isEdit ? `/condition/${data?.[0]?.id}` : `/condition`;

  const response = isEdit
    ? await serverApi.put(url, data)
    : await serverApi.post(url, data);

  return response.data;
}