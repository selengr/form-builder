'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function twoFARequestHandlerAction(nationalCode: string) {
  try {
    const response = await AxiosApi.post(`/check-nationalCode-send-code`, {
      nationalCode,
    });
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}