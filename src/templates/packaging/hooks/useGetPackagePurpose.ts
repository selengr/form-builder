'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagePurposeAction } from '@actions/packaging/getPackagePurposeAction';

export const PACKAGE_PURPOSE_QUERY_KEY = ['package-purpose'] as const;

export function useGetPackagePurpose(open?: boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: PACKAGE_PURPOSE_QUERY_KEY,
    queryFn: async () => {
      const res = await getPackagePurposeAction();
      
      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست هدف پکیج');
      }
      
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open
  });

  return {
    isFetchingPackage: isFetching,
    isLoadingPackage: isLoading,
    isErrorPackage: isError,
    errorPackage: error,
    Package: data?.dataList,
  };
}
