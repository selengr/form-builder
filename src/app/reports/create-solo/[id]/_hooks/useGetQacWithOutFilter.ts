import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';
// action
import { getQacWithOutFilterAction } from '../../../../../../actions/report/getQacWithOutFilterAction';

export const useGetQacWithOutFilter = () => {
  const { id } = useParams();
  const { data, isFetching } = useQuery({
    queryKey: ['QAC_WIHT_OUT_FILTER'],
    queryFn: async () => {
      const res = await getQacWithOutFilterAction({ formId: String(id) });

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3,
  });

  const qacWithOutFilterOptions = data?.dataList?.map((item: IConditionQuestionType) => {
    const isCalculation = item.elementStr === 'CALCULATION';
    const isTextFieldDate = item.extMap.TEXT_FIELD_PATTERN === 'DATE';
    const isSpectralDouble = item.extMap.SPECTRAL_TYPE === 'DOMAIN';
    const isTextFieldNumber = item.extMap.TEXT_FIELD_PATTERN === 'NUMBER';
    const isMultiSelect = item.extMap.MULTI_SELECT ? JSON.parse(item.extMap.MULTI_SELECT) : false;

    const questionType = isCalculation
      ? `${item.elementStr}*${item.extMap.UNIC_NAME}`
      : isTextFieldDate
        ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
        : isMultiSelect
          ? `${item.extMap.QUESTION_TYPE}_MULTI_SELECT*${item.extMap.UNIC_NAME}`
          : isSpectralDouble
            ? `${item.extMap.QUESTION_TYPE}_${item.extMap.SPECTRAL_TYPE}*${item.extMap.UNIC_NAME}`
            : isTextFieldNumber
              ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
              : `${item.extMap.QUESTION_TYPE}*${item.extMap.UNIC_NAME || ''}`;

    return {
      value: `${questionType}@${item.caption}`,
      label: item.caption,
    };
  });

  return {
    isFetchingQacWithOutFilter: isFetching,
    qacWithOutFilter: data?.dataList,
    qacWithOutFilterOptions,
  };
};
