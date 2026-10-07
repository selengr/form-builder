import { useQuery } from '@tanstack/react-query';
import { getFormulaFormsAction } from '@actions/data-collection/formulas/minor-formula/getFormulaFormsAction';

export interface FormulaFormOption {
  value: string;
  label: string;
}

interface FormulaFormItem {
  value: string | number;
  caption: string;
}

export const useGetFormulaForms = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['MINOR_FORMULA_FORMS'],
    queryFn: async () => {
      const res = await getFormulaFormsAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت لیست فرم‌ها');
      }

      return res.data as { dataList?: FormulaFormItem[] };
    },
    staleTime: 0,
    retry: 3,
  });

  const formOptions: FormulaFormOption[] =
    data?.dataList?.map((item) => ({
      value: String(item.value),
      label: item.caption,
    })) ?? [];

  return {
    formOptions,
    isFetchingForms: isFetching,
  };
};
