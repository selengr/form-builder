import { useQuery } from '@tanstack/react-query';
import { getCalculatorFieldsAction } from '@actions/data-collection/formulas/minor-formula/getCalculatorFieldsAction';
import { IFieldQuestionData } from '../types';

const EMPTY_FIELDS: IFieldQuestionData = { dataList: [] };

export const useGetCalculatorFields = (formId: string) => {
  const { data, isFetching } = useQuery({
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
    retry: 3,
  });

  return {
    questionList: data?.dataList ? data : EMPTY_FIELDS,
    isFetchingCalculatorFields: isFetching,
  };
};
