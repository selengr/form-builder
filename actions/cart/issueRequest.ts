'use server';

import { api } from '@/services/axios/actionWapper';

export async function issueRequestAction() {
  return api.post<{ issueRequestId: number }>('/purchase-order/createIssueRequest');
}
