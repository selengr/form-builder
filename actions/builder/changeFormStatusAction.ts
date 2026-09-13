'use server';

import { api } from '@/services/axios/actionWapper';

export async function changeFormStatusAction(input: {
  formId: string | number;
  formBuilderStatusEnum: 'PUBLISH' | 'UN_PUBLISH';
}) {
  return api.put('/form/change-status', input);
}
