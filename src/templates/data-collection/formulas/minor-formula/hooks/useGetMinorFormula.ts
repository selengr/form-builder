'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMinorFormulaEditDataAction } from '@actions/data-collection/formulas/minor-formula/getMinorFormulaEditDataAction';
import { MinorFormulaDetail } from '../types';

export function useGetMinorFormula(minorId?: number | string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['minor_formula', minorId],
    queryFn: async () => {
      const res = await getMinorFormulaEditDataAction(minorId!);

      console.log('[useGetMinorFormula] response:', res);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت اطلاعات فرمول جزئی');
      }

      const { formId, forms, formQuestions, onlyAllQuestions, onlyAllCalc, calculatorFields } = res.data;
      const seed = (queryKey: unknown[], result: { success: boolean; data?: unknown } | null) => {
        if (result?.success) queryClient.setQueryData(queryKey, result.data);
      };

      seed(['MINOR_FORMULA_FORMS'], forms);
      if (formId) {
        seed(['MINOR_FORMULA_FORM_QUESTIONS', formId], formQuestions);
        seed(['MINOR_FORMULA_ONLY_ALL_QUESTIONS', formId], onlyAllQuestions);
        seed(['MINOR_FORMULA_ONLY_ALL_CALC', formId], onlyAllCalc);
        seed(['MINOR_FORMULA_CALCULATOR_FIELDS', formId], calculatorFields);
      }

      return res.data.minorFormula as MinorFormulaDetail;
    },
    enabled: Boolean(minorId),
    staleTime: 0,
    gcTime: 0,
  });

  return { minorFormula: data, isLoading, isFetching, isError, error };
}
