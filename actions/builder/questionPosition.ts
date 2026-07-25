'use server';

import { api } from '@/services/axios/actionWapper';

export async function changeOrMoveQuestionPositionAction(payload: any) {
  return api.post('/question/change-position-or-move', payload);
}

// 'use server';

// import { serverApi } from '@/services/axios/serverApi';

// export async function changeOrMoveQuestionPositionAction(payload: any) {
//   const res: any = await serverApi.post('/question/change-position-or-move', payload);
//   return { data: res.data };
// }