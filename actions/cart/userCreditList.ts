'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function userCreditListAction(issueRequestId: number) {
  // try {
    const body = { issueRequestId };

    const response = await serverApi.post(
      '/mhesam/profile/credit/user-credit-list',
      body,
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
      }
    );

    return response.data;
  // } catch (error) {
  //   return Promise.resolve('');
  // }
}