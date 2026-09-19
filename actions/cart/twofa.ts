'use server';

import { api } from '@/services/axios/actionWapper';

export async function twoFARequestHandlerAction(nationalCode: string) {
  return api.post(`/check-nationalCode-send-code`, { nationalCode });
}
