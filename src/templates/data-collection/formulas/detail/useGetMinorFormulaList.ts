'use client';

import { useQuery } from '@tanstack/react-query';
import { getMinorFormulaListAction } from '@actions/data-collection/formulas/getMinorFormulaListAction';
import { MinorFormulaListItem } from './types';

export function useGetMinorFormulaList(majorId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['minor_formula_list', majorId],
    queryFn: async () => {
      const res = await getMinorFormulaListAction(majorId);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست فرمول‌های جزئی');
      }

      return res.data;
    },
    enabled: Boolean(majorId),
  });

  return {
    minorList: (data?.content ?? []) as MinorFormulaListItem[],
    total: data?.totalElements ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}
