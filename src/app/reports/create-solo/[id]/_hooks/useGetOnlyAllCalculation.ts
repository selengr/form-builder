import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';
// actions
import { getOnlyAllCalcAction } from '../../../../../../actions/report/getOnlyAllCalcAction';

export const useGetOnlyAllCalculation = () => {
  const { id } = useParams();
  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_CALC'],
    queryFn: () => getOnlyAllCalcAction({ formId: String(id) }),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
