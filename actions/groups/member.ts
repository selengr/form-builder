'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function changeMemberStatusAction(input: {
  groupId: number | null;
  introducedUserJTGroupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  try {
    const res = await serverApi.post(
      '/user-group/introducer/change-status-member',
      input
    );
    return { ok: res.status === 200 };
  } catch (error) {
    throw error;
  }
}
