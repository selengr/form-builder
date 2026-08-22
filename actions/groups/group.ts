'use server';

import { api } from '@/services/axios/actionWapper';

export async function changeGroupStatusAction(input: {
  groupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  return api.post('/user-group/introducer/change-status-group', input);
}
