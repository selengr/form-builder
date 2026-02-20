'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function changeGroupStatusAction(input: {
  groupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  try {
    const res = await AxiosApi.post(
      '/user-group/introducer/change-status-group',
      input
    );
    return { ok: res.status === 200 };
  } catch (error) {
    throw error;
  }
}