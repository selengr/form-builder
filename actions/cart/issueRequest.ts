'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function issueRequestAction() {
  // try {
    const { data } = await serverApi.post('/purchase-order/createIssueRequest');
    return data;
  // } catch (error) {
  //   return Promise.resolve('');
  // }
}