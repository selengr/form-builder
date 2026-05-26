'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserInfoServer } from '@actions/auth';

const ONE_HOUR = 1000 * 60 * 60;

export function useUserInfoNew() {
  const query = useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const res = await fetchUserInfoServer();
      return res;
    },
    staleTime: ONE_HOUR,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    userInfo: query.data?.userInfo ?? null,
    loading: query.isLoading,
    error: query.error,
    isAuthenticated: !!query.data,
  };
}
