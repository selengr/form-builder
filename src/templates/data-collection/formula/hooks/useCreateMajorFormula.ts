import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMajorFormulaAction } from '@actions/data-collection/formulas/createMajorFormulaAction';
import { CreateFormulaFormSchemaType } from '../CreateFormulaBtn';

export async function createMajorFormula(data: CreateFormulaFormSchemaType) {
  const res = await createMajorFormulaAction({
    majorName: data.majorName,
    targetPlatformEnum: data.targetPlatformEnum,
    majorLabel: data.majorLabel,
  });

  if (!res.success) {
    throw new Error(res.message || 'خطا در ثبت فرمول.');
  }

  return res.data;
}

export function useCreateMajorFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMajorFormula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['major_formula_list'] });
    },
  });
}
