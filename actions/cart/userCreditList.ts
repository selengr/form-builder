'use server';

import { api } from '@/services/axios/actionWapper';

export async function userCreditListAction(issueRequestId: number) {
  return api.post('/mhesam/profile/credit/user-credit-list', { issueRequestId }, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
  });
}
