'use client';

import { useQuery } from '@tanstack/react-query';
import { getMetaParamsComboAction, MetaParamOption } from '@actions/data-collection/formulas/getMetaParamsComboAction';

export function useGetMetaParams(enabled = true) {
  const { data, isFetching } = useQuery({
    queryKey: ['FORMULA_META_PARAMS'],
    queryFn: async () => {
      const res = await getMetaParamsComboAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست کلیدها');
      }

      return (res.data?.dataList ?? []) as MetaParamOption[];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return { metaParamOptions: data ?? [], isFetchingMetaParams: isFetching };
}
