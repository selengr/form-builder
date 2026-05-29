'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface IUser {
  id: number;
  fullName: string;
  username: string;
  nationalCode: string;
  dateOfBorn: string | null;
  citizen: string | null;
}

export interface IUserInfoResponse {
  user: IUser;
  aclList: any[];
  userRoles: any[];
}

export interface IUserInfo   {
  userInfo: IUserInfoResponse | null;
  isAuthenticated: boolean;
  error: string | Error | null;
}

export async function fetchUserInfoServer(): Promise<IUserInfo  > {
  try {
    const response = await serverApi.get<any>('/authorization/front-panel/non-org-user-role/find-user-loggedin-info',{
       baseURL: process.env.BASE_URL,
    });

    return {
      userInfo: response.data,
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