'use server';

import { api } from '@/services/axios/actionWapper';
import type { IChangeOrMovePositionApi } from '@/types/bulider';

export async function changeOrMoveQuestionPositionAction(payload: IChangeOrMovePositionApi) {
  return api.post('/question/change-position-or-move', payload);
}