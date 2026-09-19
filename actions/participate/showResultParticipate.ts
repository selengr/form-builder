'use server';

import { api } from '@/services/axios/actionWapper';

export async function showResultParticipate(data: {
  formId: number;
  takePartId: number;
}) {
  return api.post('/report/user/solo/show-solo-report', data);
}
