'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function issueRequestAction() {
  try {
    const { data } = await AxiosApi.post('/purchase-order/createIssueRequest');
    return data;
  } catch (error) {
    return Promise.resolve('');
  }
}