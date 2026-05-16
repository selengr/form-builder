'use server';

import { serverApi } from '@/services/axios/serverApi';

interface IFetchUserInfoResult {
  userInfo: any;
  isAuthenticated: boolean;
  error: Error | null;
}

export async function fetchUserInfoServer(): Promise<IFetchUserInfoResult> {
  try {
    const res = await serverApi.get<any>('/authorization/front-panel/non-org-user-role/find-user-loggedin-info',{
       baseURL: process.env.BASE_URL,
    });

    return {
      userInfo: res.data,
      isAuthenticated: true,
      error: null,
    };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(error?.message || 'خطای نامشخص');
    return {
      userInfo: null,
      isAuthenticated: false,
      error: err,
    };
  }
}
