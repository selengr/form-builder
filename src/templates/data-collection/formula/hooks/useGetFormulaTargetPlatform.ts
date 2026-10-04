'use client';

import { useQuery } from '@tanstack/react-query';
import { getFormulaTargetPlatformAction } from '@actions/data-collection/formulas/getFormulaTargetPlatformAction';

export const FORMULA_TARGET_PLATFORM_QUERY_KEY = ['FormulaTargetPlatform'] as const;

export function useGetFormulaTargetPlatform(open?: boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: FORMULA_TARGET_PLATFORM_QUERY_KEY,
    queryFn: async () => {
      const res = await getFormulaTargetPlatformAction();

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
