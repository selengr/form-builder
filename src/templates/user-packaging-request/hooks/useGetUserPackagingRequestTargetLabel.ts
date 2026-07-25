'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserPackagingRequestTargetLabelAction } from '@actions/user-packaging-request/getUserPackagingRequestTargetLabelAction';

export const USER_PACKAGING_REQUEST_TARGET_LABEL_QUERY_KEY = [
  'user-packaging-request-target-label',
] as const;

export function useGetUserPackagingRequestTargetLabel(enabled = true) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: USER_PACKAGING_REQUEST_TARGET_LABEL_QUERY_KEY,
    queryFn: async () => {
      const res = await getUserPackagingRequestTargetLabelAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست جامعه هدف');
      }

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  return {
    isFetchingTargetLabel: isFetching,
    isLoadingTargetLabel: isLoading,
    isErrorTargetLabel: isError,
    errorTargetLabel: error,
    targetLabels: data?.dataList,
  };
}
