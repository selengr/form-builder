'use server';

import { api } from '@/services/axios/actionWapper';
import { IPostCondition } from '@/types/condition';

type PostConditionArgs = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postConditionAction({ data, isEdit }: PostConditionArgs) {
  const url = isEdit ? `/condition/${data?.[0]?.id}` : `/condition`;

  return isEdit ? api.put(url, data) : api.post(url, data);
}
