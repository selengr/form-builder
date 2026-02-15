'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { cookies } from 'next/headers';

interface IFetchUserInfoResult {
  userInfo: any;
  isAuthenticated: boolean;
  error: Error | null;
}

export async function fetchUserInfoAction(): Promise<IFetchUserInfoResult> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        userInfo: null,
        isAuthenticated: false,
        error: null,
      };
    }

    const res = await AxiosApi.get(
      '/authorization/front-panel/non-org-user-role/find-user-loggedin-info',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res?.data) {
      throw new Error('خطا در دریافت اطلاعات کاربر');
    }

    return {
      userInfo: res.data,
      isAuthenticated: true,
      error: null,
    };
  } catch (error: any) {
    const err =
      error instanceof Error
        ? error
        : new Error(error?.message || 'خطای نامشخص');

    return {
      userInfo: null,
      isAuthenticated: false,
      error: err,
    };
  }
}
