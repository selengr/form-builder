// contexts/user-info-context.tsx

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string | null;
};

type UserInfoState = {
  user: UserInfo | null;
  isAuthenticated: boolean;
};

type UserInfoActions = {
  setUser: (user: UserInfo | null) => void;
  updateUser: (patch: Partial<UserInfo>) => void;
  clearUser: () => void;
};

const UserInfoStateContext = createContext<UserInfoState | null>(null);
const UserInfoActionsContext = createContext<UserInfoActions | null>(null);

type UserInfoProviderProps = {
  initialUser: UserInfo | null;
  children: ReactNode;
};

export function UserInfoProvider({
  initialUser,
  children,
}: UserInfoProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);

  const updateUser = useCallback((patch: Partial<UserInfo>) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...patch,
      };
    });
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const stateValue = useMemo<UserInfoState>(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
    };
  }, [user]);

  const actionsValue = useMemo<UserInfoActions>(() => {
    return {
      setUser,
      updateUser,
      clearUser,
    };
  }, [updateUser, clearUser]);

  return (
    <UserInfoStateContext.Provider value={stateValue}>
      <UserInfoActionsContext.Provider value={actionsValue}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoStateContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoStateContext);

  if (!context) {
    throw new Error('useUserInfo must be used inside UserInfoProvider');
  }

  return context;
}

export function useUserInfoActions() {
  const context = useContext(UserInfoActionsContext);

  if (!context) {
    throw new Error('useUserInfoActions must be used inside UserInfoProvider');
  }

  return context;
}
