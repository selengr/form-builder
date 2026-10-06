import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '../types';
import { getOnlyAllCalcAction } from '@actions/data-collection/formulas/minor-formula/getOnlyAllCalcAction';

export const useGetOnlyAllCalculation = (formId: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ['MINOR_FORMULA_ONLY_ALL_CALC', formId],
    queryFn: async () => {
      const res = await getOnlyAllCalcAction(formId);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    enabled: Boolean(formId),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });

  const onlyAllCalculationOptions = data?.dataList?.map((item: IConditionQuestionType) => ({
    value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
    label: item.caption,
  }));

  return {
    isFetchingOnlyAllCalculation: isFetching,
    onlyAllCalculation: data?.dataList,
    onlyAllCalculationOptions,
  };
};
