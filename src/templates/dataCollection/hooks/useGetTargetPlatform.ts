'use client';

import { useQuery } from '@tanstack/react-query';
import { getTargetPlatformAction } from '../../../../actions/dataCollection/getTargetPlatformAction';

export const TARGET_PLATFORM_QUERY_KEY = ['TargetPlatform'] as const;

export function useGetTargetPlatform(open?:boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: TARGET_PLATFORM_QUERY_KEY,
    queryFn: () => getTargetPlatformAction(),
    staleTime: 5 * 60 * 1000,
    enabled : open
  });

  return {
    isFetchingTargetPlatform: isFetching,
    isLoadingTargetPlatform: isLoading,
    isErrorTargetPlatform: isError,
    errorTargetPlatform: error,
    TargetPlatform: data?.dataList,
  };
}