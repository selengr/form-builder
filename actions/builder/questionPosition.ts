'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function changeOrMoveQuestionPositionAction(payload: any) {
  const res: any = await AxiosApi.post('/question/change-position-or-move', payload);
  return { data: res.data };
}