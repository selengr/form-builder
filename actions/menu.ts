'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export async function fetchMenuServer(): Promise<IMenuResponseData> {
  try {
    const { data } = await AxiosApi.get('/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info', {
      baseURL: process.env.BASE_URL,
    });
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}
