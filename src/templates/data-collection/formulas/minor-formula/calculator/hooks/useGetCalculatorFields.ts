import { useQuery } from '@tanstack/react-query';
import { getCalculatorFieldsAction } from '@actions/data-collection/formulas/minor-formula/getCalculatorFieldsAction';
import { IFieldQuestionData } from '../types';

const EMPTY_FIELDS: IFieldQuestionData = { dataList: [] };

export const useGetCalculatorFields = (formId: string) => {
  const { data, isFetching, isPending, isError, error } = useQuery({
    queryKey: ['MINOR_FORMULA_CALCULATOR_FIELDS', formId],
    queryFn: async () => {
      const res = await getCalculatorFieldsAction(formId);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data as IFieldQuestionData;
    },
    enabled: Boolean(formId),
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    questionList: data?.dataList ? data : EMPTY_FIELDS,
    isFetchingCalculatorFields: isFetching,
    isPendingCalculatorFields: isPending,
    isCalculatorFieldsError: isError,
    calculatorFieldsError: error,
  };
};
