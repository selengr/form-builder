import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '../types';
import { REF_ID_QUESTION_TYPE } from '../utils/questionType';
import { getFormQuestionsAction } from '@actions/data-collection/formulas/minor-formula/getFormQuestionsAction';

export const useGetQacWithOutFilter = (formId: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ['MINOR_FORMULA_FORM_QUESTIONS', formId],
    queryFn: async () => {
      const res = await getFormQuestionsAction(formId);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    enabled: Boolean(formId),
    staleTime: 60 * 1000,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });

  const qacWithOutFilterOptions = data?.dataList?.map((item: IConditionQuestionType) => {
    if (item.value === REF_ID_QUESTION_TYPE) {
      return {
        value: `${REF_ID_QUESTION_TYPE}*${item.value}`,
        label: item.caption,
        elementStr: item.elementStr,
        highlighted: true,
      };
    }

    const extMap = item.extMap ?? {};
    const uniqueName = item.elementStr || extMap.UNIC_NAME || '';
    const baseType = extMap.QUESTION_TYPE ?? item.value;
    const isCalculation = item.elementStr === 'CALCULATION';
    const isTextFieldDate = extMap.TEXT_FIELD_PATTERN === 'DATE';
    const isSpectralDouble = extMap.SPECTRAL_TYPE === 'DOMAIN';
    const isTextFieldNumber = extMap.TEXT_FIELD_PATTERN === 'NUMBER';
    const isMultiSelect = extMap.MULTI_SELECT ? JSON.parse(extMap.MULTI_SELECT) : false;

    const questionType = isCalculation
      ? `${item.elementStr}*${uniqueName}`
      : isTextFieldDate
        ? `${baseType}_${extMap.TEXT_FIELD_PATTERN}*${uniqueName}`
        : isMultiSelect
          ? `${baseType}_MULTI_SELECT*${uniqueName}`
          : isSpectralDouble
            ? `${baseType}_${extMap.SPECTRAL_TYPE}*${uniqueName}`
            : isTextFieldNumber
              ? `${baseType}_${extMap.TEXT_FIELD_PATTERN}*${uniqueName}`
              : `${baseType}*${uniqueName}`;

    return {
      value: questionType,
      label: item.caption,
    };
  });

  return {
    isFetchingQacWithOutFilter: isFetching,
    qacWithOutFilter: data?.dataList,
    qacWithOutFilterOptions,
  };
};
