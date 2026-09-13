import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';
import { getOnlyAllCalcAction } from '../../../../../../../actions/condition/getOnlyAllCalcAction';

export const useGetOnlyAllCalculation = () => {
  const { id } = useParams();
  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_CALC'],
    queryFn: async () => {
      const res = await getOnlyAllCalcAction(String(id));

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
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
