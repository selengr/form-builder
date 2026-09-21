'use server';

import { api } from '@/services/axios/actionWapper';
import type { UserCreditListResponse } from '@/app/purchase-order/[purchaseOrderId]/gateway/types';

export async function userCreditListAction(issueRequestId: number) {
  // Same host as other server actions (internal BASE_URL), not the browser public URL.
  // Path stays `/mhesam/...` (outside `/psya`), matching the old AxiosApi baseURL override.
  return api.post<UserCreditListResponse[]>(
    '/mhesam/profile/credit/user-credit-list',
    { issueRequestId },
    { baseURL: process.env.BASE_URL },
  );
}
