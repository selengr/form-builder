'use server';

import { api } from '@/services/axios/actionWapper';

export interface ChangeGroupStatusInput {
  groupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}

export async function changeGroupStatusAction(input: ChangeGroupStatusInput) {
  return api.post('/user-group/introducer/change-status-group', input);
}
