import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';
// action
import { getOnlyAllQuestionsAction } from '../../../../../../actions/report/getOnlyAllQuestionsAction';

export const useGetOnlyAllQuestions = () => {
  const { id } = useParams();
  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_QUESTIONS'],
    queryFn: async () => {
      const res = await getOnlyAllQuestionsAction({ formId: String(id) });

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

  const onlyAllQuestionsOptions = data?.dataList?.map((item: IConditionQuestionType) => ({
    value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
    label: item.caption,
  }));

  const onlySomeQuestionsOptions = data?.dataList
    ?.filter((item: IConditionQuestionType) => {
      const { TEXT_FIELD_PATTERN, SPECTRAL_TYPE, MULTI_SELECT } = item.extMap;
      const isMultiSelect = MULTI_SELECT === 'false';
      const isSpectralSingle = SPECTRAL_TYPE === 'SPECTRAL';
      const isTextFieldNumber = TEXT_FIELD_PATTERN === 'NUMBER';

      return isTextFieldNumber || isMultiSelect || isSpectralSingle;
    })
    ?.map((item: IConditionQuestionType) => ({
      value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
      label: item.caption,
    }));

  const onlyAllDateOptions = data?.dataList
    ?.filter((item: IConditionQuestionType) => {
      const isTextFieldDate = item.extMap.TEXT_FIELD_PATTERN === 'DATE';
      return isTextFieldDate;
    })
    ?.map((item: IConditionQuestionType) => ({
      value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
      label: item.caption,
    }));

  return {
    isFetchingOnlyAllQuestions: isFetching,
    onlyAllQuestions: data?.dataList,
    onlyAllQuestionsOptions,
    onlySomeQuestionsOptions,
    onlyAllDateOptions,
  };
};
