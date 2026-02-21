'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function changeGroupStatusAction(input: {
  groupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  try {
    const res = await serverApi.post(
      '/user-group/introducer/change-status-group',
      input
    );
    return { ok: res.status === 200 };
  } catch (error) {
    throw error;
  }
}