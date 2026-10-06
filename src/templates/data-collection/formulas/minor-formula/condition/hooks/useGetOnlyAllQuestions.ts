import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '../types';
import { getOnlyAllQuestionsAction } from '@actions/data-collection/formulas/minor-formula/getOnlyAllQuestionsAction';

export const useGetOnlyAllQuestions = (formId: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ['MINOR_FORMULA_ONLY_ALL_QUESTIONS', formId],
    queryFn: async () => {
      const res = await getOnlyAllQuestionsAction(formId);

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
    ?.filter((item: IConditionQuestionType) => item.extMap.TEXT_FIELD_PATTERN === 'DATE')
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
