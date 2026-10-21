'use client';

import { useQuery } from '@tanstack/react-query';
import { getMajorFormulaAction } from '@actions/data-collection/formulas/getMajorFormulaAction';

export function useGetMajorFormula(majorId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['major_formula', majorId],
    queryFn: async () => {
      const res = await getMajorFormulaAction(majorId);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت اطلاعات فرمول');
      }

      console.log('[useGetMajorFormula] response:', res.data);

      return res.data;
    },
    enabled: Boolean(majorId),
  });

  return { majorFormula: data, isLoading, isError, error };
}
