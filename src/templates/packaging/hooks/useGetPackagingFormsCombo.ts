'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingFormsComboAction } from '@actions/packaging/getFormsCombo';

export const FORM_COMBO_QUERY_KEY = ['form-for-custom-combo'] as const;

export function useGetPackagingFormsCombo() {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: FORM_COMBO_QUERY_KEY,
    queryFn: async () => {
      const res = await getPackagingFormsComboAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست فرم‌ها');
      }

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    isFetchingForms: isFetching,
    isLoadingForms: isLoading,
    isErrorForms: isError,
    errorForms: error,
    FormsList: data?.dataList,
  };
}
