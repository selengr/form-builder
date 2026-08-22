'use server';

import { api } from '@/services/axios/actionWapper';

export async function changeMemberStatusAction(input: {
  groupId: number | null;
  introducedUserJTGroupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  return api.post('/user-group/introducer/change-status-member', input);
}
