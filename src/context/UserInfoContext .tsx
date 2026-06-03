'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { IUserInfoResponse } from '@actions/auth';

type UserInfoContextType = {
  userInfo: IUserInfoResponse | null;
  user: IUserInfoResponse['user'] | null;
  aclList: IUserInfoResponse['aclList'];
  userRoles: IUserInfoResponse['userRoles'];

  isAuthenticated: boolean;

  setUserInfo: (userInfo: IUserInfoResponse | null) => void;
  clearUserInfo: () => void;
};

const UserInfoContext = createContext<UserInfoContextType | null>(null);
// test git 
type Props = {
  initialUserInfo: IUserInfoResponse | null;
  children: ReactNode;
};
// ----------------------------------------------------------------------
export function UserInfoProvider({ initialUserInfo, children }: Props) {
  const [userInfo, setUserInfo] = useState<IUserInfoResponse | null>(
    initialUserInfo
  );

  const clearUserInfo = () => {
    setUserInfo(null);
  };

  const value = useMemo<UserInfoContextType>(
    () => ({
      userInfo,
      user: userInfo?.user ?? null,
      aclList: userInfo?.aclList ?? [],
      userRoles: userInfo?.userRoles ?? [],

      isAuthenticated: Boolean(userInfo),

      setUserInfo,
      clearUserInfo,
    }),
    [userInfo]
  );

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoContext);

  if (!context) {
    throw new Error('useUserInfo must be used inside UserInfoProvider');
  }

  return context;
}