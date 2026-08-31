import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';
// actions
import { getQacWithOutFilterListAction } from '../../../../../../actions/report/getQacWithOutFilterListAction';

export const useGetQacWithOutFilterList = () => {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['QAC_WIHT_OUT_FILTER_LIST'],
    queryFn: async () => {
      const res = await getQacWithOutFilterListAction({ formId: String(id) });

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
    const isMultiCHOICE =
      item.extMap.MULTI_SELECT === 'false' && item.extMap.QUESTION_TYPE === 'MULTIPLE_CHOICE'
        ? !JSON.parse(item.extMap.MULTI_SELECT)
        : false;
    const questionType = isCalculation
      ? `${item.elementStr}*${item.extMap.UNIC_NAME}`
      : isTextFieldDate
        ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
        : isMultiSelect
          ? `${item.extMap.QUESTION_TYPE}_MULTI_SELECT*${item.extMap.UNIC_NAME}`
          : isMultiCHOICE
            ? `${item.extMap.QUESTION_TYPE}*${item.extMap.UNIC_NAME}`
            : isSpectralDouble
              ? `${item.extMap.QUESTION_TYPE}_${item.extMap.SPECTRAL_TYPE}*${item.extMap.UNIC_NAME}`
              : isTextFieldNumber
                ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
                : `${item.extMap.QUESTION_TYPE}*${item.extMap.UNIC_NAME || ''}`;
    if (isMultiSelect || isMultiCHOICE) {
      return {
        value: `${questionType}`,
        label: item.caption,
        options: item.extMap.OPTIONS,
      };
    }
    return {
      value: `${questionType}`,
      label: item.caption,
    };
  });

  return {
    qacWithOutFilterOptions,
  };
};
