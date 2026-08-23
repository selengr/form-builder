'use client';

import { useQuery } from '@tanstack/react-query';
import { getTargetPlatformAction } from '@actions/survey/getTargetPlatformAction';

export const TARGET_PLATFORM_QUERY_KEY = ['survey-TargetPlatform'] as const;

export function useGetTargetPlatform(open?: boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: TARGET_PLATFORM_QUERY_KEY,
    queryFn: async () => {
      const res = await getTargetPlatformAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست سرویس‌گیرنده');
      }

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open ?? true,
  });

  return {
    isFetchingTargetPlatform: isFetching,
    isLoadingTargetPlatform: isLoading,
    isErrorTargetPlatform: isError,
    errorTargetPlatform: error,
    TargetPlatform: data?.dataList,
  };
}
