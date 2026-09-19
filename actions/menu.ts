'use server';

import { api } from '@/services/axios/actionWapper';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export async function fetchMenuServer(): Promise<IMenuResponseData> {
  const res = await api.get<IMenuResponseData>(
    '/authorization/front-panel/non-org-user-role/find-user-loggedin-info',
    { baseURL: process.env.BASE_URL },
  );

  if (!res.success) {
    throw new Error(res.message || 'خطا در دریافت منو');
  }

  return res.data;
}
