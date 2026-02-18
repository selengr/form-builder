'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IPostCondition } from '@/types/condition';

export enum HttpMethod {
  POST = 'post',
  PUT = 'put',
}

type PostConditionArgs = {
  data: IPostCondition[];
  isEdit: boolean;
};

export async function postConditionAction({ data, isEdit }: PostConditionArgs) {
  const method = isEdit ? HttpMethod.PUT : HttpMethod.POST;
  const url = isEdit ? `/condition/${data?.[0]?.id}` : `/condition`;

  const response = await AxiosApi[method](url, data);
  return response.data;
}