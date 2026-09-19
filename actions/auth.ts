'use server';

import { api } from '@/services/axios/actionWapper';

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

export interface IUserInfo {
  userInfo: IUserInfoResponse | null;
  isAuthenticated: boolean;
  error: string | Error | null;
}

export async function fetchUserInfoServer(): Promise<IUserInfo> {
  const res = await api.get<IUserInfoResponse>(
    '/authorization/front-panel/non-org-user-role/find-user-loggedin-info',
    { baseURL: process.env.BASE_URL },
  );

  if (!res.success) {
    return {
      userInfo: null,
      isAuthenticated: false,
      error: new Error(res.message || 'خطای نامشخص'),
    };
  }

  return {
    userInfo: res.data,
    isAuthenticated: true,
    error: null,
  };
}
