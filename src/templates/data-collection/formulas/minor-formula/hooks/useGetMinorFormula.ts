'use client';

import { useQuery } from '@tanstack/react-query';
import { getMinorFormulaAction } from '@actions/data-collection/formulas/minor-formula/getMinorFormulaAction';
import { MinorFormulaDetail } from '../types';

export function useGetMinorFormula(minorId?: number | string) {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['minor_formula', minorId],
    queryFn: async () => {
      const res = await getMinorFormulaAction(minorId!);

      console.log('[useGetMinorFormula] response:', res);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت اطلاعات فرمول جزئی');
      }

      return res.data as MinorFormulaDetail;
    },
    enabled: Boolean(minorId),
    staleTime: 0,
    gcTime: 0,
  });

  return { minorFormula: data, isLoading, isFetching, isError, error };
}
