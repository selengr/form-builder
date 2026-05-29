'use server';

import { serverApi } from '@/services/axios/serverApi';

export type ActionResponse<T = any> = {
  ok: boolean;
  message?: string;
  data?: T;
};

export async function changeGroupStatusAction(input: {
  groupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}): Promise<ActionResponse> {
    const res = await serverApi.post(
      '/user-group/introducer/change-status-group',
      input
    );
   
    return { ok: res.status === 200 };
}
