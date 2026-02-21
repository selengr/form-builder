'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function twoFARequestHandlerAction(nationalCode: string) {
  try {
    const response = await serverApi.post(`/check-nationalCode-send-code`, {
      nationalCode,
    });
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}