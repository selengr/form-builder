import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMajorFormulaAction,
  UpdateMajorFormulaInput,
} from '@actions/data-collection/formulas/updateMajorFormulaAction';

export async function updateMajorFormula(input: UpdateMajorFormulaInput) {
  const res = await updateMajorFormulaAction(input);

  if (!res.success) {
    throw new Error(res.message || 'خطا در ثبت فرمول.');
  }

  return res.data;
}

export function useUpdateMajorFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMajorFormula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['major_formula_list'] });
      queryClient.invalidateQueries({ queryKey: ['major_formula'] });
    },
  });
}
