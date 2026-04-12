'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export async function fetchMenuServer(): Promise<IMenuResponseData> {
  try {
    const { data } = await AxiosApi.get('/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info', {
      baseURL: process.env.BASE_URL,
    });
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}
