import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMajorFormulaAction } from '@actions/data-collection/formulas/deleteMajorFormulaAction';

export async function deleteMajorFormula(majorId: number) {
  const res = await deleteMajorFormulaAction(majorId);

  if (!res.success) {
    throw new Error(res.message || 'خطا در حذف فرمول.');
  }

  return res.data;
}

export function useDeleteMajorFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMajorFormula,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['major_formula_list'] }),
  });
}
