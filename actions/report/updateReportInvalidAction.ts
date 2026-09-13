'use server';

import { api } from '@/services/axios/actionWapper';

export async function updateReportInvalidAction(input: {
  id: number;
  invalid: boolean;
}) {
  return api.put('/report/solo/main-list/invalid', input);
}
