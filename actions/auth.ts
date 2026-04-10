'use server';

import { serverApi } from '@/services/axios/serverApi';
import { getAuthToken } from '@/utils/getAuthToken';

interface IFetchUserInfoResult {
  userInfo: any;
  isAuthenticated: boolean;
  error: Error | null;
}

export async function fetchUserInfoServer(): Promise<IFetchUserInfoResult> {
  try {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not defined');
    }

    const token = await getAuthToken();

    if (!token) {
      return {
        userInfo: null,
        isAuthenticated: false,
        error: null,
      };
    }

    const res = await serverApi.get<any>('/authorization/front-panel/non-org-user-role/find-user-loggedin-info', {
      baseURL: process.env.BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      userInfo: res.data,
      isAuthenticated: true,
      error: null,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';
    
    return {
      userInfo: null,
      isAuthenticated: false,
      error: message,
    };
  }
}
