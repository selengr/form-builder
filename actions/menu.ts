'use server';

import { serverApi } from '@/services/axios/serverApi';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export async function fetchMenuServer(): Promise<IMenuResponseData> {
  try {
    const { data } = await serverApi.get('/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info', {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
    });
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}
